/*
 * Questo oggetto si deve occupare di individuare il percorso che dal punto corrente procede 
 * nella direzione corrente fino a ricoprire la distanza attesa per l'intervallo temporale 
 * necessario per il prossimo refresh
 */

class PathFollower{
    constructor(){
        this.service=new google.maps.StreetViewService();
//        this.currentPanorama=null;
        this.sum=0;
        this.dist=null;
        this.currentLatLng=null;
        this.currentLinks=null;
        this.prevPano=null;
        this.prevLatLng=null;
        this.nextPano=null;
        this.nextLatLng=null;
        this.newPano=null;
        this.waitingFor=null;
    }
    
//    setCurrentPanorama(panorama){
//        this.currentPanorama=panorama;        
//    }
    
    /**
     * 
     * @param {type} dist distanza in metri
     * @returns {undefined}
     */
    goFwd(dist){
        var prevPano=this.currentPanorama;
        var nextPano=null;
        var newPano=null;
        var found=false;
        while(!found){
            //nextPano=prossimo panorama in direzione fwd
            //segLen=calcolo lunghezza di questo segmento
            if(segLen<dist-this.sum){
                //accumulo questa lunghezza
                this.sum+=segLen;
            }
            else{
                //quale approssima meglio?
                var toDist=dist-this.sum;
                if(toDist<segLen-toDist){
                    //meglio prev
                    newPano=prevPano;
                }
                else {
                    //meglio next
                    newPano=nextPano;
                }
                found=true;
            }            
        }
        //questo sarà il nuovo panorama 
        return newPano;        
    }
    dummy(fwd){
        this.service.getPanorama({pano:fwd.pano},function(data,status){
            if(status==google.maps.StreetViewStatus.OK){
                app.panorama.nextPanorama=data;
                app.log("nextPano:"+JSON.stringify(data));
            }
        });
    }
    
    goFwdStart(location,links,dir,dist){
//        app.log("pFollw: d="+dist+"\ts="+this.sum+"\tlocation="+JSON.stringify(location));
//        console.log("pFollw: d="+dist.toFixed(3)+"\ts="+this.sum.toFixed(3)+"\tpano="+app.panorama.panorama.getLocation().pano+"\tdir="+dir.toFixed(2)+" START\ttot="+app.stradaPercorsa.toFixed(1));
        this.dist=dist;
        this.currentDir=dir;
        this.currentLatLng=null;
        this.currentLinks=null;
        this.prevPano=null;
        this.prevLatLng=location.latLng;
        this.nextPano=null;
        this.nextLatLng=null;
        this.newPano=null;
        var fwd=this.fwdLink(links,dir);
        this.fwdDir=fwd.heading;
        this.waitingFor=fwd.pano;
        this.service.getPanorama({pano:fwd.pano},PathFollower.cbGetPanorama);//will call goFwdStep
    }
    
    goFwdStep(location,links){
//        app.log(JSON.stringify(this.prevLatLng)+JSON.stringify(location.latLng))
        var segLen= google.maps.geometry.spherical.computeDistanceBetween(this.prevLatLng, location.latLng);
        var dLat=(location.latLng.lat()-this.prevLatLng.lat())*100000;
        var dLng=(location.latLng.lng()-this.prevLatLng.lng())*100000;
        if(segLen<this.dist-this.sum){
            //accumulo questa lunghezza
            this.sum+=segLen;
            this.prevLatLng=location.latLng;
            this.prevPano=location.pano;
//            console.log("pFollw: d="+this.dist.toFixed(3)+"\ts="+this.sum.toFixed(3)+"\tseg="+segLen.toFixed(3)+"\tpano="+location.pano+"\tdir="+this.currentDir.toFixed(2)+"\tdLat="+dLat.toFixed(2)+"\tdLng="+dLng.toFixed(2));
        }
        else{
            //quale approssima meglio?
            var toDist=this.dist-this.sum;
            if(toDist<segLen-toDist){
                //meglio prev
                this.newPano=this.prevPano;
                this.newHeading=this.currentDir;
            }
            else {
                //meglio next
                this.newPano=location.pano;
                this.newHeading=this.fwdDir;
                this.sum+=segLen;
                this.prevLatLng=location.latLng;
            }
//            found=true;
            this.sum-=this.dist;
//            console.log("pFollw: d="+this.dist.toFixed(3)+"\ts="+this.sum.toFixed(3)+"\tseg="+segLen.toFixed(3)+"\tpano="+this.newPano+"\tdir="+app.currentDir.toFixed(2)+"\tdLat="+dLat.toFixed(2)+"\tdLng="+dLng.toFixed(2)+"\tFOUND!");
            //questo sarà il nuovo panorama 
            app.panorama.movePano(this.newPano,this.newHeading,this.dist);
            return; 
        }            
        //next step
        this.currentDir=this.fwdDir;
        var fwd=this.fwdLink(links,this.currentDir);
        this.fwdDir=fwd.heading;
        this.waitingFor=fwd.pano;
        this.service.getPanorama({pano:fwd.pano},PathFollower.cbGetPanorama);//will call goFwdStep
    }
    
    objCbGetPanorama(data){
        if(this.waitingFor!=null){
            //dato atteso?
            if(this.waitingFor==data.location.pano){
                this.goFwdStep(data.location,data.links);
            }
            else {
                //errore
                app.log("PathFollower.objCbGetPanorama data.location.pano not found");
            }
        }
        else {
            //errore
            app.log("PathFollower.objCbGetPanorama waiting for null");
        }
    }
    
    errCbGetPanorama(status){
        app.log("PathFollower.errCbGetPanorama status="+status);
        this.waitingFor=null;
    }

    fwdLink(links,dir){
        dir+=app.currentTarget;
//        var s="links=";
//        for (var i=0;i<links.length;i++){
//            s+=" {"+links[i].heading.toFixed(2)+" "+links[i].pano+"}";
//        }
//        console.log(s+dir.toFixed(1));
        var fwd=links[0];
        var min=Math.abs(fwd.heading-dir);
        for (var i=1;i<links.length;i++){
            var d=Math.abs(links[i].heading-dir);
            if(d<min){
                min=d;
                fwd=links[i];
            }
        }
        return fwd;
    }

    
    
    static cbGetPanorama(data,status){
        if(status==google.maps.StreetViewStatus.OK){
            app.panorama.pathFollower.objCbGetPanorama(data);
        }
        else {
            app.panorama.pathFollower.errCbGetPanorama(status);
        }
    }
}


