/* $Id: GoobleControl.js 148 2013-10-04 11:55:41Z ragno $ */

/*
 * This program is free software; you can redistribuite it and/or modify it 
 * under the terms of the GNU/General Pubblic License as published the Free software Foundation; 
 * either version 3 of the License, or (at your opinion) any later version
 */

/*
 * costanti di configurazione
 */
//costanti per modo di visualizzazione
var DEVELOP="DEVELOP";
var PRODUCTION="PRODUCTION";
//delle prossime due va attivata una sola
//var GOOBLE_CONTROL_MODE=DEVELOP;
var GOOBLE_CONTROL_MODE=PRODUCTION;

//costanti per scelta di filtro inclinazione
var IF_NONE="nessun filtro inclinazione";
var IF_BATCH="filtro inclinazione batch su percorso"; //raggruppa i segmenti piccoli
var IF_ABSORBER="filtro inclinazione ammortizzatore"; //diluisce nello spazio le variazioni di inclinazione (oltre a raggruppare segmenti)
var INCLINATION_FILTER_MODE=IF_ABSORBER;
// costante per mappa di default
//TODO: per il momento si parte dal centro di Bologna
var DEFAULT_LOAD_MAP="via Rizzoli,2 Bologna";


//delle prossime due va attivata una sola
var CFG_PRESET="20131122";//firmware dhcp
//var CFG_PRESET="20131005";//makerfair

switch(CFG_PRESET){
  case  "20131122"://firmware dhcp
    /*
     METRI_PER_CLICK 
     corrispondenza fra click e distanza percorsa
     */
    //var METRI_PER_CLICK=15.0; //Roma, maker faire: più brillantezza nella resa!
//    var METRI_PER_CLICK=10.0; //un click corrisponde a 10 metri percorsi sia in vecchio firmware sia in nuovo con LIMIT1 
    var METRI_PER_CLICK=5.0; //un click corrisponde a 5 metri percorsi in nuovo firmware con LIMIT0

    /*
     MAX_SPEED in km/h
     è la massima velocità prevista, e viene utilizzata per impostare 
     il tachimetro che porta il fondo scala a MAX_SPEED+10
     */
    //var MAX_SPEED=3.6*METRI_PER_CLICK;// Vecchio firmware: max frequenza è 1 click al secondo
    var MAX_SPEED=36;//nuovo firmware: non dipende più dai mperclick, è solo questione di resa in vista
    /*
     MIN_SPEED in km/h
     è la minima velocità al di sotto della quale il firmware considera fermo
     */
    //var MIN_SPEED=3.6; //corrisponde ad almeno 8 impulsi di basso livello per secondo => 1 m/sec
    var MIN_SPEED=3.6;

    /*
    questo fattore separa la velocità reale e quella virtuale
    se vale 1 c'è identità fra le due grandezze
    se vale <1 la velocità simulata è minore di quella reale (periferia della ruota) per cui in salita si accentua il senso di affaticamento
     */
    var FATTORE_VIRTUALIZZ_VELOCITA=0.5;

    /*
     TIMEOUT_PER_FERMO in msec
     riconosce il fermo e azzera tachimetro
     */
    // vecchio firmware: la velocità minima corrisponde a 10800 msec, quindi a 10900 considero fermo.
    //var TIMEOUT_PER_FERMO=10900; 
    // nuovo firmware: la velocità minima corrisponde 8 impulsi di basso livello per secondo -> 1 m/sec => T=V*S
    // nuovo firmware: la velocità minima è riconosciuta se trascorre un T = Vmin *Sperclick +1%
    var TIMEOUT_PER_FERMO=FATTORE_VIRTUALIZZ_VELOCITA*(MIN_SPEED/3.6)*METRI_PER_CLICK*1000*1.01; 
    
    var DELTATMIN=(METRI_PER_CLICK*3600.0/MAX_SPEED)*0.95; //msec S/V => METRI_PER_CLICK/(3.6*METRI_PER_CLICK) - 5%
    var DELTAV_PEROVERFLOW=3;//incremento di velocità max se ho overflow



    //distanza minima al di sotto della quale i segmenti vanno "fusi"
    var MIN_LUNG_SEGMENTO=15.0;
    //var MIN_LUNG_SEGMENTO=1.2*METRI_PER_CLICK;
    break;  
  case  "20131005"://makerfair
  default:
    var FATTORE_VIRTUALIZZ_VELOCITA=1.0;//rende ininfluente questo fattore
    //corrispondenza fra click e distanza percorsa
    //var METRI_PER_CLICK=10.0; //un click corrisponde a 10 metri percorsi
    var METRI_PER_CLICK=15.0; //un click corrisponde a 10 metri percorsi
    var MAX_SPEED=3.6*METRI_PER_CLICK;//in km/h, sappiamo che max frequenza e 1 click al secondo
    var MIN_SPEED=3.6;
    var TIMEOUT_PER_FERMO=10900; // la velocità minima corrisponde a 10800 msec, quindi a 10900 considero fermo.
    var DELTATMIN=1000.0*0.95; //msec S/V con tolleranza 5%
    var DELTAV_PEROVERFLOW=5;//incremento di velocità max se ho overflow

    //distanza minima al di sotto della quale i segmenti vanno "fusi"
    //var MIN_LUNG_SEGMENTO=20.0;
    var MIN_LUNG_SEGMENTO=1.2*METRI_PER_CLICK;
  break;
}
console.log("GOOBLE_CONTROL_MODE="+GOOBLE_CONTROL_MODE);
console.log("CFG_PRESET="+CFG_PRESET);
console.log("METRI_PER_CLICK="+METRI_PER_CLICK);
console.log("MAX_SPEED="+MAX_SPEED);
console.log("MIN_SPEED="+MIN_SPEED);
console.log("TIMEOUT_PER_FERMO="+TIMEOUT_PER_FERMO);
console.log("DELTATMIN="+DELTATMIN);
console.log("DELTAV_PEROVERFLOW="+DELTAV_PEROVERFLOW);
console.log("MIN_LUNG_SEGMENTO="+MIN_LUNG_SEGMENTO);
//console.log("="+);

/*
 AVERAGE_SPEED=MAX_SPEED
 serve solo in modo DEVELOP, è la velocità simulata in Autorun
*/
//var AVERAGE_SPEED=10.75; // 10,75m/sec, 38,7 km/h è la vel max rilevata dal rullo
//var AVERAGE_SPEED=10.0; // 10m/sec, 36 km/h
var AVERAGE_SPEED=MAX_SPEED; //

//per la vista mappa/panorama
var VISTAMAPPA="vistaMappa";
var VISTAPANORAMA="vistaPanorama";

var presetPercorsi=[
  ["Via Siepelunga, 2 Bologna","Via Santa Liberata Bologna","Monte Donato"],
  ["44.489623,11.309306","44.479385,11.296335","San Luca"],
  ["via del genio 3 bologna","via di gaibola 6 bologna","via Del Genio"],
  ["46.607300, 12.277274","46.609857, 12.296371","3 Cime Di Lavaredo"]
];

/**
 * GoogleControl implementa la parte controller dell'MVC della web-client application Gooble Bike
 * istanzia il modello dei dati e espone un metodo di inserimento ed un iteratore per la navigazione nell'elenco
 * @returns {GoobleControl}
 */
function GoobleControl() {
    //il modo può essere DEVELOP o PRODUCTION a seconda del valore della costatnte GOOBLE_CONTROL_MODE
    this.mode=GOOBLE_CONTROL_MODE;
    //view
    this.view=new GoobleView(this.mode);
    //model
    //la mappa di google maps
    this.map;  //ERRORE02 in realtà viene usata una variabile globale map
    //panorama
    this.panorama;
    //cosa si vede?
    this.vistamappa=VISTAMAPPA;//
     //model
     //percorso attivo significa che siamo in ride
     percorsoAttivo=false;
   //il servizio di geocoding
    this.geoCoder = new google.maps.Geocoder();
    //il servizio di directions
    this.directionsService = new google.maps.DirectionsService();
    //il servizio di renderizzazione dei percorsi
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    //il centro di default della mappa
    this.mapOrigin;  //ERRORE01 in realtà viene usata una variabile globale mapOrigin
    //il percorso in stile gooble bike
    this.gooblePath = new GooblePath();
    //automa dei control buttons
    this.goobleButtons = new GoobleButtons();
    //timer per autorun
    this.autoTimer;
    //iteratore per autorun
    this.autoIterator;
    //iteratore per ride
    this.rideIterator;
    //contatore di passi per ride/autorun
    this.rideStep;
    // accumulatore della strada percorsa
    this.stradaPercorsa=0;
    //strada rimanente al prossimo GooglePoint;
    this.toNextPoint=0;
    //ora dell'ultimo click
    this.lastClickTime=0;
    //velocità corrente
    this.actualSpeed=0;
    // timer per riconoscere la fermata
    this.timerFermo;
    //la pendenza corrente
    this.pendenza=0;
    // filtro inclinazione
    this.inclinationFilter = new GoobleInclinationFilter();
    //ultimo intervallo di tempo tra due click
    this.ultimoIntertempo=0;
    this.elevation = new google.maps.ElevationService();
    //flag per non innescare un loop nel filtro
    this.eseguitoFiltro=false; // per (INCLINATION_FILTER_MODE===IF_BATCH) 
    this.startPoint;
//    //accesso locale !!!ERRORE03 self è window.self, andrebbe eventualmente usata la variabili globale goobleControl
//    alert(window.location);
//    alert(self.location);
//    this.location="goobleControl";
    self = this;
//    alert(self.location);
    this.markersArray = [];
    //carica la mappa
    this.loadMap(DEFAULT_LOAD_MAP);
                //sovrapponi logo
//            document.getElementById("splash").style.visibility = "visible"; //ci vuole un metodo di vista
            this.view.showSplash();
    if (typeof presetPercorsi != 'undefined' && presetPercorsi.length>0) {
//      alert("Presente");
      this.view.mostraPresetPercorsi(presetPercorsi)
    }
//    else {
//      alert("Manca");
//    }
}


GoobleControl.prototype.placeMarker = function(location) {

    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    // add marker in markers array
    self.markersArray.push(marker);

    if (self.markersArray.length == 2) {

        self.makeRoute(this.markersArray[0].position, this.markersArray[1].position);
        this.markersArray.length = 0;
    } else {


    }
}


/**
 * callaback function per directionsService.route, effettua il postprocesso dei dati
 * @param {DirectionsResult} result il risultato fornito dalla api
 * @param {DirectionsStatus} status lo stato ritornato
 * @returns {undefined}
 */
GoobleControl.prototype.cbMakeRoute = function(result, status) {
    //callback dal directions services
    if (status == google.maps.DirectionsStatus.OK) {
        //reset del path
        self.gooblePath.clear();
        //reset InclinationFilter
        self.inclinationFilter.clear();
        this.eseguitoFiltro=false;
        //mostra il percorso sulla mappa
        var directionsResultObj = result;
        self.directionsDisplay.setDirections(result);
        //estrae punti dal percorso e li memorizza nei gooble points
        //percorre gli steps
        var mySteps = directionsResultObj.routes[0].legs[0].steps;
        var stepElements = mySteps.length;
        var i;
        var lastLat = 0;
        var lastLng = 0;
        for (i = 0; i < stepElements; i++) {
            //per ogni step percorre il path
            var pathElements = mySteps[i].path.length;
            var j;
            for (j = 0; j < pathElements - 1; j++) {
//                k = j + 1;                 //per ogni elemento di path crea un Gooble Point
//                var lat = mySteps[i].path[j].lat();
//                var lng = mySteps[i].path[j].lng();
                  var lat = Math.round(mySteps[i].path[j].lat()*10000)/10000;
                  var lng = Math.round(mySteps[i].path[j].lng()*10000)/10000;
                if ((lat != lastLat) && (lng != lastLng)) {
                    //alert("sonodentro");
                    var point = new GooblePoint(mySteps[i].path[j].lat(), mySteps[i].path[j].lng(), 0, 0, 0, 0, 0);
                    self.gooblePath.add(point);
                    lastLat=lat;
                    lastLng=lng;
                }

            }
        }
        // il path è ora memorizzato nell'attributo gooblePath
//        //dump dei dati
//        goobleControl.view.dumpPath(self.gooblePath);
                
        //calcola il pov  e la distance
        goobleControl.calcolaPovDistanzePath();  

        //calcola altezza e inclinazione dei punti nel path
        goobleControl.calcolaAltezzaInclinazionePath();  //apre un thread con il suo callback

//        //fine calcolo dst,elv, dump dei dati
//        goobleControl.view.dumpPath(self.gooblePath);
          
    }
    else  {
      alert("Critical Error GoobleControl 0001");
    }
        
};


/**
 * calcola POV e distanza di ogni punto del path
 * @returns {undefined}
 */
GoobleControl.prototype.calcolaPovDistanzePath = function() {
            //calcola il pov  e la distance
            var k = 0;
            var it = self.gooblePath.getGoobleIterator();
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
                    //nextPoint.pov = (curPov < 0) ? 360 + curPov * (180 / Math.PI) : curPov * (180 / Math.PI);//perché next e non cur??
                    curPoint.pov = (curPov < 0) ? 360 + curPov * (180 / Math.PI) : curPov * (180 / Math.PI);
                    //Calcolo elevation                    
                    var nextGPoint = new google.maps.LatLng(nextLat, nextLng);
                    //var startGPoint = new google.maps.LatLng(self.gooblePath.path[0].lat, self.gooblePath.path[0].lng);

                    //Calcola la distanza
                    self.gooblePath.path[k].dst = google.maps.geometry.spherical.computeDistanceBetween(curGPoint, nextGPoint);

                    if (k > 0)
                        //self.gooblePath.path[k].dstTot = self.gooblePath.path[k].dst + self.gooblePath.path[k - 1].dstTot;
                        self.gooblePath.path[k].tot = self.gooblePath.path[k].dst + self.gooblePath.path[k - 1].tot;
                    else
                        //self.gooblePath.path[k].dstTot = self.gooblePath.path[k].dst;
                        self.gooblePath.path[k].tot = self.gooblePath.path[k].dst;
                    curPoint = nextPoint;
                    curGPoint = nextGPoint;
                    k++;
                }
//                //fine calcolo dst,elv, dump dei dati
//                goobleControl.view.dumpPath(self.gooblePath);
            }
            else {
                alert("Critical Error GoobleControl 0002");
            }
}

/**
 * calcola l'elevation di ogni punto del path
 * @returns {undefined}
 */
GoobleControl.prototype.calcolaAltezzaInclinazionePath = function() {
    //il calcolo di elevation ha una limitazione sul numero di punti.
    if(self.gooblePath.path.length<512){          
        self.calcElevation(self.gooblePath.toGooglePoint(), function(result) {

            var k = 0;
            while (k < self.gooblePath.path.length) {
                self.gooblePath.path[k].elv = result[k].elevation;
                k++;
            }
//                //dump dei dati
//                goobleControl.view.dumpPath(self.gooblePath);
            // ho elv, posso calcolare inc
            //calcola la inclinazione di ogni punto
            GoobleControl.prototype.calcolaInclinazionePath();
        });
    }
//    else alert("PERCORSO TROPPO LUNGO, REIMPOSTARE");
    else alert("Critical Error GoobleControl 0013");
  
};


/**
 * calcola l'inclinazione di ogni punto del path
 * @returns {undefined}
 */
GoobleControl.prototype.calcolaInclinazionePath = function() {
//________CALCOLA INCLINAZIONE_________
        var k = 0;
        var it = self.gooblePath.getGoobleIterator();
        if (it.hasNext()) {

            var curPoint = it.next();

            while (it.hasNext()) {

                var nextPoint = it.next();
                self.gooblePath.path[k].inc = self.calcInclination(curPoint, nextPoint);

                curPoint = nextPoint;
                k++;
            }
        }
        else {
            alert("Critical Error GoobleControl 0003");
        }
        
        if (INCLINATION_FILTER_MODE===IF_BATCH || INCLINATION_FILTER_MODE===IF_ABSORBER) {
          //finito, in modo PRODUCTION si passa al filtro
          if (!goobleControl.eseguitoFiltro && goobleControl.mode===PRODUCTION){
            goobleControl.eseguitoFiltro=true;
            goobleControl.filtraPath();
          }
        }
        
        //fine, dump dei dati
        goobleControl.view.dumpPath(self.gooblePath);
/*
//________FILTRA INCLINAZIONE_________
        var k = 1;
        var it = self.gooblePath.getGoobleIterator();
        if (it.hasNext()) {
            while (it.hasNext()) {

                var filtrato = self.filter(k, 20);
                it.next();
                if (filtrato) {
                    it.next();
                    k++;
                }
                k++;
            }
        }
        else {
            alert("non dovrebbe accadere");
        }
        

         var ultimo=self.gooblePath.path.length-2;
         var cambio = self.gooblePath.path.splice(0,ultimo);  // Togliamo l'ultimo elemento
         self.gooblePath.path=cambio;

         var k = 0;
         var it = self.gooblePath.getGoobleIterator();
        if (it.hasNext()) {
            while (it.hasNext()) {
                
                if(self.gooblePath.path[k].inc>25) self.gooblePath.path[k].inc=25;
                if(self.gooblePath.path[k].inc<0) self.gooblePath.path[k].inc=0;
                it.next();
                k++;
            }
        }
        else {
            alert("non dovrebbe accadere");
        }
  */
//_____________________________________
//____________INIZIO DEBUG_____________
        // var k = 0;
        // var pointArray = "";
        // var it = self.gooblePath.getGoobleIterator();
        // while (it.hasNext()) {

        //     var point = it.next();
        //     pointArray += "<tr><td>" + k + "</td><td>" + point.lat + "</td><td>" + point.lng + "</td><td>" + point.pov + "</td><td>" + point.dst + "</td>" + "</td><td>" + point.elv + "</td><td>" + point.inc + "</td><td>" + point.dstTot + "</td><td>" + point.elv2 + "</td></tr>";
        //     k++;
        // }



        // document.getElementById("arrayTableBody").innerHTML = pointArray;

};

GoobleControl.prototype.filtraPath = function() {
  //copia i dati grezzi di path 
  var grezzi=goobleControl.gooblePath;
  //azzera i dati di path
  goobleControl.gooblePath = new GooblePath();
  //flag per indicare se siamo in una sequenza di segmenti corti
  var sequenzaCorta=false;
  var it=grezzi.getGoobleIterator();
  while (it.hasNext()) {
    var punto=it.next();
    if (punto.dst === 0 || punto.dst > MIN_LUNG_SEGMENTO) {
      //è l'ultimo o ha lunghezza valida
      if (!sequenzaCorta){
        //memorizzo il punto 
        goobleControl.gooblePath.add(punto);
      }
      else {
        //la seq corta ha accumulato abbastanza lunghezza?
        if (lungSegmCorto>MIN_LUNG_SEGMENTO){
          //rendo autonomo quel segmento e memorizzo questo punto
          goobleControl.gooblePath.add(punto);
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
        goobleControl.gooblePath.add(punto);
      }
      else {
        //sono in sequenza corta
        //scarto il punto e sommo le distanze
        lungSegmCorto+=punto.dst;
      }
    }
  }
  // ora faccio ricalcolare tutto.
        //calcola altezza e inclinazione dei punti nel path
        goobleControl.calcolaAltezzaInclinazionePath();  //apre un thread con il suo callback

        //calcola il pov  e la distance
        goobleControl.calcolaPovDistanzePath();  
  
}


/**
 * crea un percorso a partire da due punti passati come parametri
 * @param {String} start l'origine del percorso
 * @param {String} end la destinazione del percorso
 * @returns {undefined}
 */
GoobleControl.prototype.makeRoute = function(start, end) {
    //imposta la chiamata alla googleapi, il relativo metodo di callback manipolerà i dati ricevuti

    //accede al directions service
    var myDirections = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.WALKING
    };


    //predispone il renderizzatore del percorso e lo associa alla mappa
    this.directionsDisplay.setMap(map); //ERRORE02
    //chiede la costruzione di un percorso ritardare callback
    this.directionsService.route(myDirections, GoobleControl.prototype.cbMakeRoute ); 

//    //N.B.:essendo stata chiamata una callback questa viene eseguita in modo asincrono
//    //ed il metodo termina prima che sia finita.           
//    non è più problema, le azioni conseguenti sono tutte nella callback
    //commuta stato
    this.goobleButtons.action(this.goobleButtons.MAKEPATH);
    
}; // end makeRoute
 


/**
 * Permette di calcolare l'inclinazione della strada partendo da due punti
 * @param {GooblePoint} curPoint
 * @param {GooblePoint} nextPoint
 * @returns {float} inclinazione per cento
 */
GoobleControl.prototype.calcInclination = function(curPoint, nextPoint) {
    return ((nextPoint.elv - curPoint.elv) / curPoint.dst) * 100;

};


/**
 * Calcola l'altitudine di un array di punti
 * @param {GooblePoint[]} newArray
 * @param {function} callback
 * @returns {undefined}
 */
GoobleControl.prototype.calcElevation = function(newArray, callback) {
    //alert(newArray.length);

    var positionalRequest = {
        'locations': newArray
    };
    this.elevation.getElevationForLocations(positionalRequest, function(results, status) {
        //alert("entrato");
        if (status === google.maps.ElevationStatus.OK) {
            if (results[0]) {
                callback(results);
            }else alert("Critical Error GoobleControl 0008");
        }else alert("Critical Error GoobleControl 0009");
    });
};


//Calcola l'altitudine di un punto
GoobleControl.prototype.calcElevationVersione500 = function(newArray, callback) {
    //alert(newArray.length);
        
   var dimGruppo=500;
        var nGruppi=newArray.length/dimGruppo;
        var gruppo=0;

         var positionalRequest = {
        'locations': new Array(dimGruppo)
    };
         var risultati=new Array(newArray.length);
        do{
                for(i=gruppo*dimGruppo, j=0 ;i<(gruppo+1)*dimGruppo && i< newArray.length;i++, j++){
                        positionalRequest.locations[j]=newArray[i];
                }
                
                this.elevation.getElevationForLocations(positionalRequest, function(results, status) {
        //alert("entrato");
        if (status === google.maps.ElevationStatus.OK) {
            if (results[0]) {
                callback(results, gruppo*dimGruppo);
            }else alert("Critical Error GoobleControl 0010");
        }else alert("Critical Error GoobleControl 0011");
    });
        
                gruppo++;
        }while(gruppo<nGruppi)
        
        
    
};

//simulazione di percorso in automatico
GoobleControl.prototype.autoRun = function() {
  //fai partire la route
  if (goobleControl.bikeRideStart()) {
    //programma click
        var tempo = METRI_PER_CLICK/AVERAGE_SPEED;
//        this.autoTimer = setTimeout(this.autoMove.bind(this), 2000);
        this.autoTimer = setTimeout(this.autoMove.bind(this), tempo);
        //commuta stato
        this.goobleButtons.action(this.goobleButtons.AUTORUN);
  }
  
}
//simulazione di percorso in automatico
GoobleControl.prototype.autoRunOld = function() {
    //passa in street view
    //inizializza iteratore
    this.autoIterator = this.gooblePath.getGoobleIterator();
    goobleControl.rideStep=-1; 
    //estrae posizione iniziale
    if (this.autoIterator.hasNext()) {
        var point=this.moveToNext(this.autoIterator);
//        goobleControl.view.dumpPoint(point,passo);
        //lancia timer per successivo avanzamento
        var tempo = 1000*point.dst/AVERAGE_SPEED;
//        this.autoTimer = setTimeout(this.autoMove.bind(this), 2000);
        this.autoTimer = setTimeout(this.autoMove.bind(this), tempo);
        //commuta stato
        this.goobleButtons.action(this.goobleButtons.AUTORUN);
        this.view.openDashboard();
        this.view.updateDashboard();
    }
    else {
        alert("Critical Error GoobleControl 0004");
    }
}

//si automaticamente muove di un passo ed avvia il timeout per il passo successivo
GoobleControl.prototype.autoMove = function() {
  var percorsoFinito=goobleControl.moveNextClick();
  if (!percorsoFinito){
    //programma click
        var tempo = 1000*3.6*METRI_PER_CLICK/AVERAGE_SPEED;//n.b. sono msec!
//        this.autoTimer = setTimeout(this.autoMove.bind(this), 2000);
        this.autoTimer = setTimeout(this.autoMove.bind(this), tempo);
  }
}
//si automaticamente muove di un passo ed avvia il timeout per il passo successivo
GoobleControl.prototype.autoMoveOld = function() {
    this.view.updateDashboard();
    //estrae posizione successiva
    if (this.autoIterator.hasNext()) {
//        this.rideStep++;//incrementa il passo
        //ci sono ancora punti
        var point=this.moveToNext(this.autoIterator);
        //lancia timer per successivo avanzamento
         var tempo = 1000*point.dst/AVERAGE_SPEED;
//        this.autoTimer = setTimeout(this.autoMove.bind(this), 2000);
        this.autoTimer = setTimeout(this.autoMove.bind(this), tempo);
    }
    else {
        //arrivato a destinazione ferma autorun
        this.goobleButtons.action(this.goobleButtons.STOP);
    }
};

GoobleControl.prototype.sendInclination = function(value) {
    value=parseInt(value);
    $.ajax("manageInclination.php?value=" + value, {
        dataType: 'html',
        success: function(data, status, xhr) {
            //response
        }
    });
};

GoobleControl.prototype.filter = function(k, salto) {
//TODO
    var flagFiltrato = false;
//alert("dentro a filter")
    if (k < self.gooblePath.path.length - 2) {
        if (self.gooblePath.path[k].dst > salto) {
            //alert("dentro a if di filter");
            flagFiltrato = true;
            // alert();

            var next = k + 2;
     
            var dstk2 = self.gooblePath.path[k].dst + self.gooblePath.path[k + 1].dst;
            var diffElvk2 = self.gooblePath.path[next].elv - self.gooblePath.path[k].elv;
            var inc = diffElvk2 / (self.gooblePath.path[k].dst + self.gooblePath.path[k + 1].dst);

//self.gooblePath.path[k+1].elv=self.gooblePath.path[k].elv+self.gooblePath.path[k].dst*inc;
            self.gooblePath.path[k + 1].elv2 = self.gooblePath.path[k].elv + self.gooblePath.path[k].dst * inc;
            self.gooblePath.path[k].elv2 = self.gooblePath.path[k].elv;

//self.gooblePath.path[k].dst=google.maps.geometry.spherical.computeDistanceBetween(newGPoint, nextGPoint);



            //self.gooblePath.path[k].inc=self.calcInclination(self.gooblePath.path[k], self.gooblePath.path[next]);
//self.gooblePath.path[k]=self.gooblePath.path[next];
//self.gooblePath.path[k].pov=0;
            self.gooblePath.path[k].inc = inc * 100;
            self.gooblePath.path[k + 1].inc = inc * 100;
        } else {
            self.gooblePath.path[k].elv2 = self.gooblePath.path[k].elv;
        }





    }

    return flagFiltrato;
};



/**
 * muove al punto successivo sia in automatico che a comando
 * @param {GoobleIterator} iterator
 * @returns {GoobleView}
 */
GoobleControl.prototype.moveToNext = function(iterator) {
    var elv;
    var curPoint;
    var lat;
    var lng;
    var pv;
//    var viewPos;
    var dst;
    var dstTOT;
    var inc;
    var elv2;
    //estrae posizione successiva

    if (iterator.hasNext()) {
        curPoint = iterator.next();
        /// nextPoint = iterator.next();
        lat = curPoint.lat;
        lng = curPoint.lng;
        pv = curPoint.pov;
        elv = curPoint.elv;
        dst = curPoint.dst;
        dstTOT = curPoint.dstTot;
        inc = curPoint.inc;
        elv2 = curPoint.elv2;
        this.sendInclination(inc);
        //TODo, inserire l'inclinazione della strada self.calcInclination


        //this.calcInclination(curPoint,nextPoint);

//        viewPos = new google.maps.LatLng(lat, lng);
        this.rideStep++;
    }
    else {
      alert("Critical Error GoobleControl 0005");
    }
    
    //DEBUG: dati nel pannello di stato
    goobleControl.view.dumpPoint(curPoint,this.rideStep);
    //TODO: elevation,pov
    
    //è la prima volta?
    if (goobleControl.vistamappa===VISTAMAPPA){
      //prima volta, istanzio panorama
      goobleControl.panorama=new GooblePanorama(map,document.getElementById('map_canvas'),curPoint,iterator.nextNoMove());
//      //aggiorna posizione street view
//      var panoramaOptions = {
//          position: viewPos,
//          pov: {
//              heading: pv,
//              pitch: 0,
//              zoom: 1
//          },
//          scrollwheel: false
//      };
//      goobleControl.panorama = new google.maps.StreetViewPanorama(document.getElementById('map_canvas'), panoramaOptions);
//      map.setStreetView(goobleControl.panorama);
      goobleControl.vistamappa=VISTAPANORAMA;
    }
    else {
      //aggiorno panorama
      goobleControl.panorama.update(curPoint,iterator.nextNoMove());
//      goobleControl.panorama.setPosition(viewPos);
//      goobleControl.panorama.setPov({
//              heading: pv,
//              pitch: 0,
//              zoom: 1
//          });
    }
    return curPoint;
};

//avvia il rilevamento dei middle click
GoobleControl.prototype.bikeRideStart = function() {
    this.view.swapCruscottoOnPreloadOff();
    //passa in street view
    //inizializza iteratore
    this.rideIterator = this.gooblePath.getGoobleIterator();
    this.rideStep=-1;//contatore di step
    var tuttoOk=true;
    //estrae posizione iniziale
    if (this.rideIterator.hasNext()) {
        var curPoint=this.moveToNext(this.rideIterator);
        var now=new Date().getTime();
        this.ultimoIntertempo=0;
        this.actualSpeed=0;
        this.stradaPercorsa=0;
        this.lastClickTime=now;
        this.toNextPoint+=curPoint.dst;//imposta la distanza al prossimo punto
        this.pendenza=curPoint.inc;
        if (INCLINATION_FILTER_MODE===IF_ABSORBER) {
          this.inclinationFilter.preset(curPoint.inc);
        }
        this.view.openDashboard();
        this.view.updateDashboard();

        //commuta stato
        this.goobleButtons.action(this.goobleButtons.RIDE);
        this.lastClickTime=new Date().getTime();
        this.percorsoAttivo=true;
    }
    else {
        alert("Critical Error GoobleControl 0006");
        tuttoOk=false;
    }
    return tuttoOk;
}

//ferma il rilevamento dei middle clik
GoobleControl.prototype.bikeRideStop = function() {
    //TODO: termine del movimento
    this.goobleButtons.action(this.goobleButtons.STOP);
    clearTimeout(this.autoTimer);
    this.percorsoAttivo=false;
}

//cancella il percorso e si porta allo stato iniziale
GoobleControl.prototype.clearRoute = function() {
  this.view.swapCruscottoOffPreloadOn();
    //cancella directions
    this.directionsDisplay.setMap(null);
    this.gooblePath.clear();
    this.loadMap(DEFAULT_LOAD_MAP);
    this.vistamappa=VISTAMAPPA;
    //DEBUG: rimuove le coordinate dal pannello di stato
   // document.getElementById("array").innerHTML = "<table border=\"1\"><thead><tr><th>N</th><th>Lat</th><th>Lng</th><th>Pov</th><th>Dst</th><th>Elv</th><th>Inc</th><th>Dst TOT</th><th>Elv2</th></tr></thead><tbody id=\"arrayTableBody\"></tbody></table>";
    this.goobleButtons.action(this.goobleButtons.RESTART);
    clearTimeout(this.autoTimer);
    this.stradaPercorsa=0;
    this.toNextPoint=0;
}
//si muove di un punto al rilevemanto di un middle click
GoobleControl.prototype.move = function() {
  if (this.percorsoAttivo){
    //una sola delle due seguenti deve essere SCOMMENTATA
//    this.moveNextPoint();//implica un passo al prossimo GooblePoint ad ogni click
    this.percorsoAttivo=!this.moveNextClick(); //implica un passo pari ai metri equivalenti al click
    if (!this.percorsoAttivo) {
      goobleControl.clearRoute();
    }
  }
}

//si muove di un punto al rilevemanto di un middle click
GoobleControl.prototype.moveNextPoint = function() {
    //estrae posizione successiva
    if (this.rideIterator.hasNext()) {
        //ci sono ancora punti
        this.moveToNext(this.rideIterator);
//        this.rideStep++;
    }
    else {
        //arrivato a destinazione ferma autorun
        this.goobleButtons.action(this.goobleButtons.STOP);
        this.view.msgFinePath();
    }
}

// scatta il timeout di fermo
GoobleControl.prototype.timeOutFermo = function() {
  //azzero velocità
  this.actualSpeed=0;
  //aggiorno cruscotto
  this.view.updateDashboard();
}
//si muove di un punto al rilevemanto di un middle click
GoobleControl.prototype.moveNextClick = function() {
    // ho avuto un click
    clearTimeout(this.timerFermo); // disabilito il timeout precedente
    this.timerFermo = setTimeout(this.timeOutFermo.bind(this), TIMEOUT_PER_FERMO); // armo il prossimo timeout
    var percorsoFinito=false;
    //un colpo di click indica una avanzamento sulla strada percorsa
    var now=new Date().getTime();
    this.ultimoIntertempo=now-this.lastClickTime;
    if (this.ultimoIntertempo>0) {
      if (this.ultimoIntertempo<DELTATMIN){
        this.actualSpeed+=DELTAV_PEROVERFLOW;
        if (this.actualSpeed>MAX_SPEED){
          this.actualSpeed=MAX_SPEED;
        }
      }
      else {
        this.actualSpeed=FATTORE_VIRTUALIZZ_VELOCITA*3.6*METRI_PER_CLICK*1000/(this.ultimoIntertempo);
      }
    }
    console.log("now="+now+", intertempo="+this.ultimoIntertempo+"(msec), velocità="+this.actualSpeed+"(km/h)");
    this.stradaPercorsa+=METRI_PER_CLICK;
    this.toNextPoint-=METRI_PER_CLICK;
    if (INCLINATION_FILTER_MODE===IF_ABSORBER) {
      this.pendenza=this.inclinationFilter.update(METRI_PER_CLICK);
    }
    this.lastClickTime=now;
    this.view.updateDashboard();
    //estrae posizione successiva ??
    if (this.toNextPoint<=0){
      //avanza al prossimo punto  
      if (this.rideIterator.hasNext()) {
          //ci sono ancora punti
          var curPoint=this.moveToNext(this.rideIterator);
//          this.rideStep++;
          this.toNextPoint+=curPoint.dst;//imposta la distanza al prossimo punto
          if (INCLINATION_FILTER_MODE===IF_ABSORBER) {
            this.inclinationFilter.newPoint(curPoint.inc)
          }
          else {
            this.pendenza=curPoint.inc;
          }
      }
      else {
          //arrivato a destinazione ferma autorun
          this.goobleButtons.action(this.goobleButtons.STOP);
          this.view.msgFinePath();
          percorsoFinito=true;
      }
      this.view.updateDashboard();
    }
    return percorsoFinito;
}

//metodo delegato sull'evento onMouseDown
GoobleControl.prototype.mouseDown = function(event) {
    //TODO: cross-browser check
    var result = false;
    switch (event.button) {
        case 0:         //left button: pass through -> azioni normali
            document.getElementById("splash").style.visibility = "hidden";
            result = true;
            break;
        case 1:         //middle button: comando di movimento
            this.move();
            result = false;
            break;
        case 2:

            //right button: TODO menu contestuale personalizzato
            //alert("menu personalizzato");
            //result=false;
            result = true;
            break;
        default:        //no button: TODO gestione errore
            alert("Critical Error GoobleControl 0007");
    }
    return result;
}
//carica una mappa nel canvas
GoobleControl.prototype.loadMap = function(origin) {
    //crea l'oggetto di accesso al servizio
    //geoposiziona l'indirizzo
    this.geoCoder.geocode({'address': origin}, function(results, status) {
        //callback del geoposizionamento
        if (status == google.maps.GeocoderStatus.OK) {
            //visualizza mappa usando la location ottenuta
            var originPos = results[0].geometry.location;
//  ERRORE01 la funzione callback non è eseguita dall'oggetto goobleControl ma da oggetto global!!!          
            this.mapOrigin = originPos;
            var mapOptions = {
                center: originPos,
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false
            };
            //mostra la mappa nel canvas
//  ERRORE02 la funzione callback non è eseguita dall'oggetto goobleControl ma da oggetto global!!!                      
            this.map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
            this.vistamappa=VISTAMAPPA;
//            //sovrapponi logo 
//            è compito del costruttore
////            document.getElementById("splash").style.visibility = "visible";
//            this.view.showSplash();
            google.maps.event.addListener(map, 'click', function(mouseEvent) {
              //TODO non è compito di loadMap rimuovere lo splash
                //document.getElementById("splash").style.visibility = "hidden";
                goobleControl.view.hideSplash();
                self.placeMarker(mouseEvent.latLng);

            });
        }
        else {
//            alert("Geocode was not successful for the following reason: " + status);
            alert("Critical Error GoobleControl 0012 " + status);
        }
    });
    //N.B.:essendo stata chiamata una callback questa viene eseguita in modo asincrono
    //ed il metodo termina prima che sia finita.           


};

//GETTER

//velocità corrente
GoobleControl.prototype.getActualSpeed = function() {
  return this.actualSpeed;
};

//distanza percorsa
GoobleControl.prototype.getKmPercorsi = function() {
  return this.stradaPercorsa/1000.0;
};

//percentuale percorsa
GoobleControl.prototype.getPercentPercorso = function() {
  var perc = 100.0*this.stradaPercorsa/this.gooblePath.getPathLength();
  return (perc>100?100:perc);
};

//pendenza
GoobleControl.prototype.getPendenza = function() {
  return this.pendenza;
};

//distanza mancante al prossimo gooblePoint
GoobleControl.prototype.getToNextPoint = function() {
  return this.toNextPoint;
};

//ultimo intertempo fra i due click
GoobleControl.prototype.getUltimoIntertempo = function() {
  return this.ultimoIntertempo;
};


