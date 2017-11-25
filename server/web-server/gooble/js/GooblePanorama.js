/* $Id: GooblePanorama.js 147 2013-10-03 14:50:17Z ragno $ */

/*
 * This program is free software; you can redistribuite it and/or modify it 
 * under the terms of the GNU/General Pubblic License as published the Free software Foundation; 
 * either version 3 of the License, or (at your opinion) any later version
 */

function GooblePanorama(map,elementId,curPoint,nextPoint) {
  //utilizzo die panorami per avere un precarico img
  this.panoramaOdd;
  this.panoramaEven;
  this.oddIsVisible;
  this.map=map;
  this.elementId=elementId;
  this.curPoint=curPoint;
  this.nextPoint=nextPoint;
  //istanzio i due panorami
  this.istanziaPanoramas();
  this.oddIsVisible=true;
  //precarica su Even il nextpoint
  
}

GooblePanorama.prototype.update = function(curPoint,nextPoint) {
  this.curPoint=curPoint;
  this.nextPoint=nextPoint;
  if (this.oddIsVisible){
    //even ha il next point
    this.panoramaEven.setVisible(true);
    this.panoramaOdd.setVisible(false);
    this.oddIsVisible=false;
    if (nextPoint){
      //aggiorno panorama in odd per precaricare il prossimo step
      this.panoramaOdd.setPosition(new google.maps.LatLng(this.nextPoint.lat, this.nextPoint.lng));
      this.panoramaOdd.setPov({
              heading: this.nextPoint.pov,
              pitch: 0,
              zoom: 1
      });
    }
  }
  else {
    //odd ha il next point
    this.panoramaOdd.setVisible(true);
    this.panoramaEven.setVisible(false);
    this.oddIsVisible=true;
    if (nextPoint){
      //aggiorno panorama in even per precaricare il prossimo step
      this.panoramaEven.setPosition(new google.maps.LatLng(this.nextPoint.lat, this.nextPoint.lng));
      this.panoramaEven.setPov({
              heading: this.nextPoint.pov,
              pitch: 0,
              zoom: 1
      });
    }
  }
  
}

GooblePanorama.prototype.istanziaPanoramas = function() {
  //precarico next point
  if (this.nextPoint){
    panoramaOptions = {
      position: new google.maps.LatLng(this.nextPoint.lat, this.nextPoint.lng),
      pov: {
        heading: this.nextPoint.pov,
        pitch: 0,
        zoom: 1
      },
      scrollwheel: false
    };    
    this.panoramaEven = new google.maps.StreetViewPanorama(this.elementId, panoramaOptions);
    //rendo invisibile Even
    this.panoramaEven.setVisible(false);
    this.map.setStreetView(this.panoramaEven);
  }
  var panoramaOptions = {
    position: new google.maps.LatLng(this.curPoint.lat, this.curPoint.lng),
    pov: {
      heading: this.curPoint.pov,
      pitch: 0,
      zoom: 1
    },
    scrollwheel: false
  };
  this.panoramaOdd = new google.maps.StreetViewPanorama(this.elementId, panoramaOptions);
  this.map.setStreetView(this.panoramaOdd);
  
}


