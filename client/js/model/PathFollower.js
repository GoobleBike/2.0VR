/*
 * Questo oggetto si deve occupare di individuare il percorso che dal punto corrente procede 
 * nella direzione corrente fino a ricoprire la distanza attesa per l'intervallo temporale 
 * necessario per il prossimo refresh
 */

class PathFollower{
    constructor(){
        this.service=new google.maps.StreetViewService();
        this.currentPanorama=null;
        this.sum=0;
        this.dist=null;
    }
    
    setCurrentPanorama(panorama){
        this.currentPanorama=panorama;        
    }
    
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
    
    goFwdStart(location,links,dist){
        this.dist=dist;
        this.currentLatLng=null;
        this.currentLinks=null;
        this.prevPano=null;
        this.prevLatLng=null;
        this.nextPano=null;
        this.nextLatLng=null;
        this.newPano=null;
        this.waitingFor=null;
        var fwd=this.fwdLink(links,dir);
        this.service.getPanorama({pano:fwd.pano},cbGetPanorama);//will call goFwdStep
    }
    goFwdStep(location,links){
        var segLen=1;//TODO google.maps.geometry.spherical.computeDistanceBetween(curGPoint, nextGPoint);
        if(segLen<this.dist-this.sum){
            //accumulo questa lunghezza
            this.sum+=segLen;
        }
        else{
            //quale approssima meglio?
            var toDist=this.dist-this.sum;
            if(toDist<segLen-toDist){
                //meglio prev
                newPano=prevPano;
            }
            else {
                //meglio next
                newPano=nextPano;
            }
            found=true;
            //questo sarà il nuovo panorama 
            return newPano; 
        }            
        //next step
        var fwd=this.fwdLink(links,dir);
        this.service.getPanorama({pano:fwd.pano},cbGetPanorama);//will call goFwdStep
    }
    
    objCbGetPanorama(data){
        if(this.waitingFor!=null){
            //dato atteso?
            if(this.waitingFor==data.location.pano){
                this.goFwdStep(data.location,data.links);
            }
            else {
                //errore
            }
        }
        else {
            //errore
        }
        
    }

    fwdLink(links,dir){
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
            app.pFollower.objCbGetPanorama(data);
        }
        else {
            app.pFollower.errCbGetPanorama();
        }
    }
}


