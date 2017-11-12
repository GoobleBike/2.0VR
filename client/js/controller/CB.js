/**
 * Classe con i metodi callback
 * @type type
 */
class CB{
    
    /**
     * callback del geoposizionamento mappa
     * @param {type} results
     * @param {type} status
     * @returns {void}
     */
    static askMap(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            //visualizza mappa usando la location ottenuta
            app.loadMap(results)
        }
        else {
            app.critical("Critical Error GBControl 0012 askMapCB " + status);
        }
    }
    
    /**
    * callaback function per directionsService.route, effettua il postprocesso dei dati
    * @param {DirectionsResult} result il risultato fornito dalla api
    * @param {DirectionsStatus} status lo stato ritornato
    * @returns {undefined}
    */
    static makeRoute(result, status) {
       //callback dal directions services
       if (status == google.maps.DirectionsStatus.OK) {
           //reset del path
           app.gooblePath.clear();
           //reset InclinationFilter
           app.inclinationFilter.clear();
           //mostra il percorso sulla mappa
           var directionsResultObj = result;
           app.directionsDisplay.setDirections(result);
           //estrae punti dal percorso e li memorizza nei gooble points
           //percorre gli steps
           var mySteps = directionsResultObj.routes[0].legs[0].steps;
           //var totalDistance=directionsResultObj.routes[0].legs[0].distance;
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
                       //this.em.debug("sonodentro");
                       var point = new GooblePoint(mySteps[i].path[j].lat(), mySteps[i].path[j].lng(), 0, 0, 0, 0, 0);
                       app.gooblePath.add(point);
                       lastLat=lat;
                       lastLng=lng;
                   }

               }
           }
           // il path è ora memorizzato nell'attributo gooblePath
   //        //dump dei dati
   //        goobleControl.view.dumpPath(self.gooblePath);

           //calcola il pov  e la distance
           app.gooblePath.calcolaPovDistanzePath();

           //calcola altezza e inclinazione dei punti nel path
           app.gooblePath.calcolaAltezzaInclinazionePath();  //apre un thread con il suo callback

   //        //fine calcolo dst,elv, dump dei dati
   //        goobleControl.view.dumpPath(self.gooblePath);

       }
       else  {
            app.critical("Critical Error GoobleControl 0001");
       }

   };
   
static pollSpeedFromDefaulUrl(){
    app.actualSpeed=5;
    return;
    $.ajax(URL+parseInt(app.pendenza), {
        dataType: 'json',
        success: function(msg, status, xhr) {
            if (msg.ck=='OK'){
                if (msg.resp.v=="UNKNOWN") {
                    app.actualSpeed=0;
                }
                else {
                    app.actualSpeed = parseInt(msg.resp.v);//km/h
                    //TODO:notifica in cruscotto
                }
            }
            else{
                app.actualSpeed=0;
                //TODO:notifica in cruscotto
            }
        }
    });
}



static autoMoveBySpeed() {
//    console.log(goobleControl.percorsoAttivo?'autoMove-attivo':'autoMove-NONattivo')
  if (app.percorsoAttivo){
    //programma click
    var distanza = (app.actualSpeed *1.5)* VIEW_REFRESH_TIME / 1000 // VIEW_REFRESH_TIME è in msec
    var percorsoFinito=app.moveNextDistance(distanza);
//        this.autoTimer = setTimeout(this.autoMove.bind(this), 2000);
        // this.autoTimer = setTimeout(this.autoMove.bind(this), tempo);
  }
}

    
}