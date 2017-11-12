/*
 * This program is free software; you can redistribuite it and/or modify it 
 * under the terms of the GNU/General Pubblic License as published the Free software Foundation; 
 * either version 3 of the License, or (at your opinion) any later version
 */

/**
 * GooglePath incapsula un elenco di oggetti GooblePoint ordinati lungo un percorso
 * espone un metodo di inserimento ed un iteratore per la navigazione nell'elenco
 * @type type
 */
class GooblePath {
    
    constructor() {
        //array dei punti gooble
        this.path = new Array();
        //flag per non innescare un loop nel filtro
        this.eseguitoFiltro=false; // per (INCLINATION_FILTER_MODE===IF_BATCH)
    }

    //restituisce il numero di punti del percorso
    size() {
        return this.path.length;
    };
    
    //aggiunge un punto in fondo al percorso
    add(point) {
        this.path.push(point);
    };
    //crea un iteratore per muoversi nel percorso e lo restituisce al chiamante
    getGoobleIterator() {
        return new GoobleIterator(this.path);
    };
    //restituisce il punto
    get(pos) {
        var ris = this.path[pos];
        return ris;
    };
    
    //cancella il percorso
    clear() {
        this.path.length = 0;
        this.eseguitoFiltro=false; // per (INCLINATION_FILTER_MODE===IF_BATCH)
    };

    toGooglePoint() {
        var i = 0;
        var googlePointPath = new Array();
        while (i < this.path.length) {
            var curPoint = new google.maps.LatLng(this.path[i].lat, this.path[i].lng);
            googlePointPath[i] = curPoint;
            i++;
        }
        return googlePointPath;
    };

    //lunghezza del percorso
    getPathLength() {
        var ultimo=this.path.length-1;
        var lun=this.path[ultimo-1].tot
        return lun;
    };
    
    
    /**
     * calcola POV e distanza di ogni punto del path
     * @returns {undefined}
     */
    calcolaPovDistanzePath() {
        //calcola il pov  e la distance
        var k = 0;
        var it = this.getGoobleIterator();
        if (it.hasNext()) {
            //inizia il calcolo pov
            var curPoint = it.next();
            var curGPoint = new google.maps.LatLng(curPoint.lat, curPoint.lng); //per calcolo POV
            while (it.hasNext()) {

                var curLat = curPoint.lat;
                var curLng = curPoint.lng;

                var nextPoint = it.next();
                var nextLat = nextPoint.lat;
                var nextLng = nextPoint.lng;

                var difX = nextLng - curLng;
                var difY = nextLat - curLat;
                var curPov = Math.atan2(difX, difY);
                curPoint.pov = (curPov < 0) ? 360 + curPov * (180 / Math.PI) : curPov * (180 / Math.PI);
                //Calcolo elevation
                var nextGPoint = new google.maps.LatLng(nextLat, nextLng);

                //Calcola la distanza
                this.path[k].dst = google.maps.geometry.spherical.computeDistanceBetween(curGPoint, nextGPoint);

                if (k > 0)
                    this.path[k].tot = this.path[k].dst + this.path[k - 1].tot;
                else
                    this.path[k].tot = this.path[k].dst;
                curPoint = nextPoint;
                curGPoint = nextGPoint;
                k++;
            }
        }
        else {
            app.critical("Critical Error GoobleControl 0002");
        }
    }

    /**
     * calcola l'elevation di ogni punto del path
     * @returns {undefined}
     */
    calcolaAltezzaInclinazionePath() {
        //il calcolo di elevation ha una limitazione sul numero di punti.
        if(this.path.length<512){
            this.calcElevation(this.toGooglePoint(), function(result) {
                var k = 0;
                while (k < app.gooblePath.path.length) {
                    app.gooblePath.path[k].elv = result[k].elevation;
                    k++;
                }
                // ho elv, posso calcolare inc
                //calcola la inclinazione di ogni punto
                app.gooblePath.calcolaInclinazionePath();
            });
        }
    //    else this.em.critical("PERCORSO TROPPO LUNGO, REIMPOSTARE");
        else app.critical("Critical Error GoobleControl 0013");

    };
    
    /**
    * Calcola l'altitudine di un array di punti
    * @param {GooblePoint[]} newArray
    * @param {function} callback
    * @returns {void}
    */
    calcElevation(newArray, callback) {
       //this.em.debug(newArray.length);

       var positionalRequest = {
           'locations': newArray
       };
       app.elevation.getElevationForLocations(positionalRequest, function(results, status) {
           //this.em.debug("entrato");
           if (status === google.maps.ElevationStatus.OK) {
               if (results[0]) {
                   callback(results);
               }else app.em.critical("Critical Error GoobleControl 0008");
           }else app.em.critical("Critical Error GoobleControl 0009");
        });
    };
    
    /**
     * calcola l'inclinazione di ogni punto del path
     * @returns {void}
     */
    calcolaInclinazionePath() {
            var k = 0;
            var it = this.getGoobleIterator();
            if (it.hasNext()) {

                var curPoint = it.next();

                while (it.hasNext()) {

                    var nextPoint = it.next();
                    this.path[k].inc = MapTools.calcInclination(curPoint, nextPoint);

                    curPoint = nextPoint;
                    k++;
                }
            }
            else {
                app.critical("Critical Error GoobleControl 0003");
            }

            if (INCLINATION_FILTER_MODE===IF_BATCH || INCLINATION_FILTER_MODE===IF_ABSORBER) {
              //finito, in modo PRODUCTION si passa al filtro
              if (!this.eseguitoFiltro && app.mode===PRODUCTION){
                this.eseguitoFiltro=true;
                this.filtraPath();
              }
            }

//            //fine, dump dei dati
//            app.view.dumpPath(this);
    };
    
    filtraPath() {
      var nuovopath = new Array();
      var lungSegmCorto;
      //flag per indicare se siamo in una sequenza di segmenti corti
      var sequenzaCorta=false;
      var it=this.getGoobleIterator();
      while (it.hasNext()) {
        var punto=it.next();
        if (punto.dst === 0 || punto.dst > MIN_LUNG_SEGMENTO) {
          //è l'ultimo o ha lunghezza valida
          if (!sequenzaCorta){
            //memorizzo il punto
            nuovopath.push(punto);
          }
          else {
            //la seq corta ha accumulato abbastanza lunghezza?
            if (lungSegmCorto>MIN_LUNG_SEGMENTO){
              //rendo autonomo quel segmento e memorizzo questo punto
              nuovopath.push(punto);
            }
            else {
              // faccio niente, cioè
              // inglobo il seg corto e il corrente
            }
            sequenzaCorta=false;
          }
        }
        else {
          // segmento corto
          if (!sequenzaCorta){
            //inizia sequenza corta
            sequenzaCorta=true;
            lungSegmCorto=punto.dst;
            //memorizzo questo punto
            nuovopath.push(punto);
          }
          else {
            //sono in sequenza corta
            //scarto il punto e sommo le distanze
            lungSegmCorto+=punto.dst;
          }
        }
      }
      //sostituisco path con quello filtrato
      this.path=nuovopath;
      // ora faccio ricalcolare tutto.
            //calcola altezza e inclinazione dei punti nel path
            this.calcolaAltezzaInclinazionePath();  //apre un thread con il suo callback

            //calcola il pov  e la distance
            this.calcolaPovDistanzePath();

    }
    

}