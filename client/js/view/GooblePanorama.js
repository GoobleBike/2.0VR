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
        this.nextPanorama=null;
        this.setPanorama();
        this.pathFollower=new PathFollower();
    }
    
    goFwdStart(distance){
        var pos=this.panorama.getLocation();
        var links=this.panorama.getLinks();
        this.pathFollower.goFwdStart(pos,links,app.currentDir,distance);
    }
    
    /**
     * 
     * @param {GooblePoint} gbPpoint
     * @returns {void}
     */
    update(gbPpoint) {
        this.curPoint=gbPpoint;
//        this.refresh(new google.maps.LatLng(this.curPoint.lat, this.curPoint.lng),this.curPoint.pov);
        this.panorama.setPosition(new google.maps.LatLng(this.curPoint.lat, this.curPoint.lng));
        this.refreshDir(this.curPoint.pov);
    }
    movePano(pano,dir,dist){
        if(pano!=null){
            this.panorama.setPano(pano);
        }
        this.refreshDir(dir);
        app.currentPoint=this.panorama.getLocation().latLng;
        app.curPointMoved(dist);
    }
    refreshDir(dir){
//        var links=this.panorama.getLinks();
//        if (links.length!=0) {
//            var fwd=this.fwdLink(links);
//            var sl="";
//            for (var i=0;i<links.length;i++){
//                sl+="\tlnk["+i+"]:"+links[i].heading.toFixed(2);
//            }
        app.currentDir = dir;
        this.panorama.setPov({
                heading: app.currentHeading+app.currentDir,
                pitch: app.currentPitch,
            zoom: 1
        });
//        }
    }
    /**
     * 
     * @param {LatLng} point
     * @param {float} dir
     * @returns {void}
     */
    refreshNORUNME(point,dir){
        this.panorama.setPosition(point);
        var pos=this.panorama.getLocation().latLng;
        var links=this.panorama.getLinks();
        if (links.length!=0) {
            var fwd=this.fwdLink(links);
            var sl="";
            for (var i=0;i<links.length;i++){
                sl+="\tlnk["+i+"]:"+links[i].heading.toFixed(2);
            }
//            app.log("curr:"+app.currentDir.toFixed(2)+"\tfwd:"+fwd.heading.toFixed(2)+sl);
        app.currentDir = fwd.heading;
        this.panorama.setPov({
//            heading: dir,
//            pitch: 0,
                heading: app.currentHeading+app.currentDir,
                pitch: app.currentPitch,
            zoom: 1
        });
        }
        
//        pos=this.panorama.getLinks();
////        app.currentPoint=pos;
//                app.log('panorama.update.oddIsVisible pov='+this.nextPoint.pov+"ODD -> "+JSON.stringify(this.panoramaOdd.getLinks()));
//        app.log('panorama.refresh pov='+dir+" point = "+JSON.stringify(point)+" pos = "+JSON.stringify(pos));
//        app.log('panorama.refresh pov='+dir+" point = "+JSON.stringify(point)+" pano = "+JSON.stringify(fwd));
    }
    
    fwdLinkNoRunMe(links){
        var fwd=links[0];
        var min=Math.abs(fwd.heading-app.currentDir);
        for (var i=1;i<links.length;i++){
            var d=Math.abs(links[i].heading-app.currentDir);
            if(d<min){
                min=d;
                fwd=links[i];
            }
        }
        return fwd;
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
        var coord=new google.maps.LatLng(this.curPoint.lat, this.curPoint.lng);
//        var panoramaOptions = {
//            position: coord,
//            pov: {
////                heading: this.curPoint.pov,
//                heading: app.currentHeading,
//                pitch: app.currentPitch,
//                zoom: 1
//            },
//            scrollwheel: false
//        };
        app.trace.map = new google.maps.Map(document.getElementById('trace'), {
          center: coord,
          zoom: 16
        });
        this.panorama = new google.maps.StreetViewPanorama(
            this.elementId, {
              position: coord,
              pov: {
                heading: app.currentHeading,
                pitch: app.currentPitch
              },
            scrollwheel: false
            });
        app.trace.map.setStreetView(this.panorama);
        app.log('panorama.setPanorama pov='+this.curPoint.pov+" point = "+JSON.stringify(coord));
    }

}
