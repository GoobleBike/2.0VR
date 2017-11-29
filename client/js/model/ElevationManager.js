const ELV_POLL_TIME=20000;//20 sec
const MIN_DIST=10;//meter: don't compute unless distance > MIN_DIST

class ElevationManager{
    constructor(){
        this.elvService = new google.maps.ElevationService();
        this.elvPolling=null;
        this._totDist=0;
        this._elevation=0;
        this._slope=0;
    }
    
    get elevation(){
        return this._elevation;
    }
    
    get slope(){
        return this._slope;
    }
    
    sample(){
        if (app.stradaPercorsa-this._totDist>MIN_DIST){
            //get next elevation
        var locationElevationRequest = {
           'locations': [ app.panorama.panorama.getLocation().latLng ]
        };
        this.elvService.getElevationForLocations(locationElevationRequest,ElevationManager.nextGetElvCB);
        }
        // else nothing to do!
    }
    
    nextElv(results){
        //set newElevation
        var newElevation = results[0].elevation;
        var dElv=newElevation-this._elevation;
        var dist=app.stradaPercorsa-this._totDist;
        this._slope=dElv*100/dist;
        this._totDist=app.stradaPercorsa;
        this._elevation=newElevation;
        //notify update
        app.elvUpdated();
    }
    
    /**
     * 
     * @param {LatLng} point
     * @returns {undefined}
     */
    start(point){
        this._totDist = app.stradaPercorsa;
        //get first elevation
        var locationElevationRequest = {
           'locations': [ point ]
        };
        this.elvService.getElevationForLocations(locationElevationRequest,ElevationManager.firstGetElvCB);
    }
    
    firstElv(results){
        //set _elevation
        this._elevation = results[0].elevation;
        //start polling
        this.elvPolling = setInterval(ElevationManager.pollElv, ELV_POLL_TIME);
        //notify update
        app.elvUpdated();
    }
    
    stop(){
        clearInterval(this.elvPolling);
    }
    
    static pollElv(){
        app.elvManager.sample();
    }
    
    static firstGetElvCB(results, status){
        //this.em.debug("entrato");
        if (status === google.maps.ElevationStatus.OK) {
            if (results[0]) {
                app.elvManager.firstElv(results);
            }
            else app.critical("Critical Error ElevationManager 0001");
        }
        else app.em.critical("Critical Error ElevationManager 0002");
    }
    
    static nextGetElvCB(results, status){
        //this.em.debug("entrato");
        if (status === google.maps.ElevationStatus.OK) {
            if (results[0]) {
                app.elvManager.nextElv(results);
            }
            else app.critical("Critical Error ElevationManager 0003");
        }
        else app.em.critical("Critical Error ElevationManager 0004");
    }
    
}