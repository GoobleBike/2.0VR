/*
 * This program is free software; you can redistribuite it and/or modify it 
 * under the terms of the GNU/General Pubblic License as published the Free software Foundation; 
 * either version 3 of the License, or (at your opinion) any later version
 */
/**
 * StreetViewPanorama handler
 * @type GooblePanorama
 */
class GooblePanorama{
    constructor(map,elementId,curPoint) {
        this.map=map;
        this.elementId=elementId;
        this.curPoint=curPoint;
        this.panorama=null;
        this.setPanorama();
    }

    /**
     * 
     * @param {GooblePoint} gbPpoint
     * @returns {void}
     */
    update(gbPpoint) {
        this.curPoint=gbPpoint;
        this.refresh(new google.maps.LatLng(this.curPoint.lat, this.curPoint.lng),this.curPoint.pov);
    }
    
    /**
     * 
     * @param {LatLng} point
     * @param {float} dir
     * @returns {void}
     */
    refresh(point,dir){
        this.panorama.setPosition(point);
        this.panorama.setPov({
//            heading: dir,
//            pitch: 0,
                heading: app.currentHeading+this.curPoint.pov,
                pitch: app.currentPitch,
            zoom: 1
        });
        var pos=this.panorama.getLocation().latLng;
//        pos=this.panorama.getLinks();
////        app.currentPoint=pos;
//                app.log('panorama.update.oddIsVisible pov='+this.nextPoint.pov+"ODD -> "+JSON.stringify(this.panoramaOdd.getLinks()));
//        app.log('panorama.refresh pov='+dir+" point = "+JSON.stringify(point)+" pos = "+JSON.stringify(pos));
        app.log('panorama.refresh pov='+dir+" point = "+JSON.stringify(point));
    }

    refreshPov(){
        this.panorama.setPov({
            heading: app.currentHeading+this.curPoint.pov,
            pitch: app.currentPitch,
            zoom: 1
        });
        app.log('panorama.refreshPov head='+app.currentHeading+" pitch = "+app.currentPitch);
    }

    setPanorama() {
        var panoramaOptions = {
            position: new google.maps.LatLng(this.curPoint.lat, this.curPoint.lng),
            pov: {
//                heading: this.curPoint.pov,
                heading: app.currentHeading,
                pitch: app.currentPitch,
                zoom: 1
            },
            scrollwheel: false
        };
        this.panorama = new google.maps.StreetViewPanorama(this.elementId, panoramaOptions);
        this.map.setStreetView(this.panorama);
        app.log('panorama.setPanorama pov='+this.curPoint.pov+" point = "+JSON.stringify(panoramaOptions.position));
    }

}
