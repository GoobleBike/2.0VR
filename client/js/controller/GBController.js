/**
 * controller dell'MVC della web-client application Gooble Bike
 * @type type
 */
class GBController{
    /**
     * istanzia gli oggetti di model
     * @returns {GoobleControl}
     */
    constructor(){
        this.conf=new GBConfig();
        this.presetPercorsi=PRESET_PERCORSI;
        this.em=new ErrorManager(LOGGERENABLE,LOGAPI);//error manager  
        this.view=null;//view
        //model
        //la mappa di google maps
        this.map;  
        //panorama
        this.panorama;
        //percorso attivo significa che siamo in ride
        this.percorsoAttivo=false;
        //il servizio di geocoding
        this.geoCoder = new google.maps.Geocoder();
        //il servizio di directions
        this.directionsService = new google.maps.DirectionsService();
        //il servizio di renderizzazione dei percorsi
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        //il centro di default della mappa
        this.mapOrigin;
        //il percorso in stile gooble bike
        this.gooblePath = new GooblePath();
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
//        this.lastClickTime=0;
        //velocità corrente
        this.actualSpeed=20;
        this.currentHeading=0;
        this.currentPitch=0;
        this.currentDir=0;
        this.currentTarget=0;
        // timer per riconoscere la fermata
        this.timerFermo;
        //la pendenza corrente
        this.pendenza=0;
        // filtro inclinazione
        this.inclinationFilter = new GoobleInclinationFilter();
        //ultimo intervallo di tempo tra due click
        this.ultimoIntertempo=0;
        this.elevation = new google.maps.ElevationService();
        this.startPoint;
        this.markersArray = [];
        this.segManager=new SegmentManager();
        //LatLng del punto corrente stimato
        this.currentPoint=null;
    }
    
    setup(){
        //automa dei control buttons
        //deve essere lanciato a pagina completamente caricata
        this.view=new GBView(this.conf.mode);
        this.goobleButtons = new GoobleButtons();
        this.trace=new TraceView();
    }
    
    log(msg){
        this.em.debug(msg);
    }
    critical(msg){
        this.em.critical(msg);
    }
    
    //
    askMap(origin) {
//        this.log("loadMap")
        //crea l'oggetto di accesso al servizio
        //geoposiziona l'indirizzo
        this.geoCoder.geocode({'address': origin}, CB.askMap);
        //N.B.:essendo stata chiamata una callback questa viene eseguita in modo asincrono
        //ed il metodo termina prima che sia finita.
    };
    
    /**
     * carica la mappa ricevuta in results e la mostra nel canvas
     * @param {type} results
     * @returns {void}
     */
    loadMap(results){
        var originPos = results[0].geometry.location;
        this.mapOrigin = originPos;
        var mapOptions = {
            center: originPos,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };
        //mostra la mappa nel canvas
        var el=document.getElementById("map")
        this.map = new google.maps.Map(el, mapOptions);
        this.view.tipoVista=VISTAMAPPA;
//        this.log("loadMap: mappa caricata")
//        google.maps.event.addListener(map, 'click', function(mouseEvent) {
//          //TODO non è compito di loadMap rimuovere lo splash
//            //document.getElementById("splash").style.visibility = "hidden";
//            app.view.hideSplash();
//            self.placeMarker(mouseEvent.latLng);
//
//        });
    }
    
    autorunBySpeed() {
        if (this.bikeRideStart()) {
            //programma click
            
        //        this.autoTimer = setTimeout(this.autoMove.bind(this), 2000);
            this.speedPoller = setInterval(CB.pollSpeedFromDefaulUrl, DATA_REFRESH_TIME);
            this.autoTimer = setInterval(CB.autoMoveBySpeed, VIEW_REFRESH_TIME);
        //        this.autoTimer = setInterval(this.autoMoveBySpeedNoImg, VIEW_REFRESH_TIME);
        //        this.imageTimer = setInterval(this.updateImage, IMAGE_REFRESH_TIME);
                //commuta stato
            this.goobleButtons.action(this.goobleButtons.AUTORUN);
        }
    };

    //cancella il percorso e si porta allo stato iniziale
    clearRoute() {
      this.view.swapCruscottoOffPreloadOn();
        //cancella directions
        this.directionsDisplay.setMap(null);
        this.gooblePath.clear();
        this.askMap(DEFAULT_MAP_ORIGIN);
        this.vistamappa=VISTAMAPPA;
        //DEBUG: rimuove le coordinate dal pannello di stato
       // document.getElementById("array").innerHTML = "<table border=\"1\"><thead><tr><th>N</th><th>Lat</th><th>Lng</th><th>Pov</th><th>Dst</th><th>Elv</th><th>Inc</th><th>Dst TOT</th><th>Elv2</th></tr></thead><tbody id=\"arrayTableBody\"></tbody></table>";
        this.goobleButtons.action(this.goobleButtons.RESTART);
    //    clearTimeout(this.autoTimer);
        this.stradaPercorsa=0;
        this.toNextPoint=0;
    }
    
    /**
     * crea un percorso a partire da due punti passati come parametri
     * @param {String} start l'origine del percorso
     * @param {String} end la destinazione del percorso
     * @returns {undefined}
     */
    makeRoute(start, end) {
        //imposta la chiamata alla googleapi, il relativo metodo di callback manipolerà i dati ricevuti

        //accede al directions service
        var myDirections = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.WALKING
    //        travelMode: google.maps.TravelMode.BICYCLING
        };


        //predispone il renderizzatore del percorso e lo associa alla mappa
        this.directionsDisplay.setMap(this.map); //ERRORE02
        //chiede la costruzione di un percorso ritardare callback
        this.directionsService.route(myDirections, CB.makeRoute );

    //    //N.B.:essendo stata chiamata una callback questa viene eseguita in modo asincrono
    //    //ed il metodo termina prima che sia finita.
    //    non è più problema, le azioni conseguenti sono tutte nella callback
        //commuta stato
        this.goobleButtons.action(this.goobleButtons.MAKEPATH);

    }; // end makeRoute
    
   
    //avvia il rilevamento dei middle click
    /**
     * Avvia il percorso corrente
     * @returns {Boolean}
     */
    bikeRideStart() {
        this.view.swapCruscottoOnPreloadOff();
        //passa in street view
        //inizializza iteratore
        this.rideIterator = this.gooblePath.getGoobleIterator();
        this.rideStep=-1;//contatore di step
        var tuttoOk=true;
        //estrae posizione iniziale
        if (this.rideIterator.hasNext()) {
            var curPoint=this.moveToNext(this.rideIterator);
            this.currentPoint=new google.maps.LatLng(curPoint.lat, curPoint.lng);
            this.currentDir=curPoint.pov;
            this.trace.setMap(this.currentPoint);
            var now=new Date().getTime();
            this.ultimoIntertempo=0;
            this.actualSpeed=20;
            this.stradaPercorsa=0;
//            this.lastClickTime=now;
            this.toNextPoint+=curPoint.dst;//imposta la distanza al prossimo punto
            this.pendenza=curPoint.inc;
            if (INCLINATION_FILTER_MODE===IF_ABSORBER) {
              this.inclinationFilter.preset(curPoint.inc);
            }
            this.view.openDashboard();
            this.view.updateDashboard();

            //commuta stato
            this.goobleButtons.action(this.goobleButtons.RIDE);
//            this.lastClickTime=new Date().getTime();
            this.percorsoAttivo=true;
        }
        else {
            this.em.critical("Critical Error GoobleControl 0006");
            tuttoOk=false;
        }
        return tuttoOk;
    };
    
    /**
     * muove al punto successivo sia in automatico che a comando
     * @param {GoobleIterator} iterator
     * @returns {GoobleView}
     */
    moveToNext(iterator) {
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
//            this.sendInclination(inc);
            //TODo, inserire l'inclinazione della strada self.calcInclination
            //this.calcInclination(curPoint,nextPoint);

    //        viewPos = new google.maps.LatLng(lat, lng);
            this.rideStep++;
            this.currentPoint=new google.maps.LatLng(curPoint.lat, curPoint.lng);
            this.currentDir=curPoint.pov;
            this.trace.addMarker(this.currentPoint);
        }
        else {
          this.em.critical("Critical Error GoobleControl 0005");
        }

        //DEBUG: dati nel pannello di stato
        this.view.dumpPoint(curPoint,this.rideStep);
        //TODO: elevation,pov

        //è la prima volta?
        if (this.vistamappa===VISTAMAPPA){
          //prima volta, istanzio panorama
          this.panorama=new GooblePanorama(this.trace.map,document.getElementById('map'),curPoint,iterator.nextNoMove());
//            this.trace.map.setStreetView(this.panorama);   
          this.vistamappa=VISTAPANORAMA;
        }
        else {
          //aggiorno panorama
          this.panorama.update(curPoint,iterator.nextNoMove());
        }
        return curPoint;
    };
    
    sendInclination(value) {
        value=parseInt(value);
        $.ajax("manageInclination.php?value=" + value, {
            dataType: 'html',
            success: function(data, status, xhr) {
                //response
            }
        });
    };
    
    /**
     * 
     * @param {String} pano panorama id
     * @returns {void}
     */
    updatePanorama(pano){
        this.panorama.updatePano(pano)
    }

    //percentuale percorsa
    getPercentPercorso() {
        var perc = 100.0*this.stradaPercorsa/this.gooblePath.getPathLength();
        return (perc>100?100:perc);
    };

    //pendenza
    getPendenza() {
        return this.pendenza;
    };

    //velocità corrente
    getActualSpeed() {
        return this.actualSpeed;
    };

    //distanza percorsa
    getKmPercorsi() {
        return this.stradaPercorsa/1000.0;
    };

    //distanza mancante al prossimo gooblePoint
    getToNextPoint() {
        return this.toNextPoint;
    };

/**
 * aggiorna i dati perché ci si è mossi di ìdistance'
 * @param {type} distance
 * @returns {Boolean}
 */
moveNextDistanceNORUNME(distance) {
    // ho avuto un click
    var percorsoFinito=false;
    //un colpo di click indica una avanzamento sulla strada percorsa
    var now=new Date().getTime();
//    this.log("now="+now+", intertempo="+this.ultimoIntertempo+"(msec), velocità="+this.actualSpeed+"(km/h)");
    this.stradaPercorsa+=distance;
    this.toNextPoint-=distance;
    if (INCLINATION_FILTER_MODE===IF_ABSORBER) {
      this.pendenza=this.inclinationFilter.update(distance);
    }
//    this.lastClickTime=now;
    //sposto currentPoint
    this.currentPoint=this.currentPoint.destinationPoint(this.currentDir,distance/1000);
    //aggiorna il panorama
    this.panorama.refresh(this.currentPoint,this.currentDir)
    this.trace.addMarker(this.currentPoint);
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
          this.view.updateDashboard();
      }
      else {
          //arrivato a destinazione ferma autorun
          this.percorsoAttivo=false;
        clearInterval(this.autoTimer);
        clearInterval(this.speedPoller);
          this.goobleButtons.action(this.goobleButtons.STOP);
//          this.clearRoute();//portato dentro a loadSegment
          $("#splash2text").html("Congratulations !!! <br> You've completed the path:<br>"+
                  this.presetPercorsi[this.segManager.currentSegment][2]);
          $("#splash2").show();
//          $("#splash").show(2000);
//          this.view.msgFinePath();
          percorsoFinito=true;
//          this.loadSegment();
            setTimeout(function(){
                app.segManager.loadSegment();        
            }, 5000);
          
      }
//      this.view.updateDashboard();
    }
    return percorsoFinito;
};

/**
 * aggiorna i dati perché ci si è mossi di ìdistance'
 * @param {type} distance
 * @returns {Boolean}
 */
moveNextDistance2(distance) {
    // foi spostare current point
    this.panorama.goFwdStart(distance);
}
curPointMoved(distance){
    var percorsoFinito=false;
    this.stradaPercorsa+=distance;
    this.toNextPoint-=distance;
    //////////////////TODO verificare
    if (INCLINATION_FILTER_MODE===IF_ABSORBER) {
      this.pendenza=this.inclinationFilter.update(distance);
    }
    //aggiorna il panorama !!già fatto!!
//    this.panorama.refresh(this.currentPoint,this.currentDir)
    this.trace.addMarker(this.currentPoint);
    this.view.updateDashboard();
    //estrae posizione successiva ??
    if (false && this.toNextPoint<=0){
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
          this.view.updateDashboard();
      }
      else {
          //arrivato a destinazione ferma autorun
          this.percorsoAttivo=false;
        clearInterval(this.autoTimer);
        clearInterval(this.speedPoller);
          this.goobleButtons.action(this.goobleButtons.STOP);
//          this.clearRoute();//portato dentro a loadSegment
          $("#splash2text").html("Congratulations !!! <br> You've completed the path:<br>"+
                  this.presetPercorsi[this.segManager.currentSegment][2]);
          $("#splash2").show();
//          $("#splash").show(2000);
//          this.view.msgFinePath();
          percorsoFinito=true;
//          this.loadSegment();
            setTimeout(function(){
                app.segManager.loadSegment();        
            }, 5000);
          
      }
//      this.view.updateDashboard();
    }
    return percorsoFinito;
};

/*
 * develop tools
 */

    incSpeed(){
       this.actualSpeed++; 
    }

    decSpeed(){
        if (this.actualSpeed>0){
            this.actualSpeed--; 
        }
    }
    
    upPitch(){
        if(this.currentPitch<90){
            this.currentPitch++;
            this.panorama.refreshPov();
        }
    }

    dnPitch(){
        if(this.currentPitch>-90){
            this.currentPitch--;
            this.panorama.refreshPov();
        }
    }

    rtHeading(){
        if(this.currentHeading<180){
            this.currentHeading++;
            this.panorama.refreshPov();
        }
    }

    ltHeading(){
        if(this.currentHeading>-180){
            this.currentHeading--;
            this.panorama.refreshPov();
        }
    }
    centerPitchHeading(){
        this.currentPitch=0;
        this.currentHeading=0;
        this.panorama.refreshPov();
    }
    
    targetLt(){
        this.currentTarget=-60;
        this.view.updateTargetDir();
    }

    targetFwd(){
        this.currentTarget=0;
        this.view.updateTargetDir();
    }

    targetRt(){
        this.currentTarget=60;
        this.view.updateTargetDir();
    }

/*
 * end develop tools
 */


    
    /*
     * Static methods
     */
    
    static run(){
//        alert("Per aumentare e diminuire velocità: tasti + e -\nPer ruotare la vista: i quattro tasti freccia")
        app.setup();
        //carica la mappa
//        app.log("Chiamata a loadMap");
        app.askMap(DEFAULT_MAP_ORIGIN);
        //sovrapponi logo
        app.view.showSplash();
        if (typeof app.presetPercorsi != 'undefined' && app.presetPercorsi.length>0) {
    //      app.em.debug("Presente");
            app.view.mostraPresetPercorsi(app.presetPercorsi)
        }
        app.log("running...");
        app.segManager.startSegment();
        //capture keydown
        $( "body" ).on( "keydown", CB.keydownHandler);
        
    }
    
   
}
