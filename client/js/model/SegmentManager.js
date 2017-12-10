class SegmentManager{
    constructor(){
        this.currentSegment=0;
    }
    
    startSegment(){
        this.currentSegment=-1;
        this.loadSegment();
    }
    
    
    loadSegment() {
    //carica il prossimo segmento presetPercorsi
    if (this.currentSegment<app.presetPercorsi.length-1){
        this.currentSegment++;
    }
    else {
        this.currentSegment=0;
//        this.em.debug("reboot");
        location.reload(); 
    }
    app.log('load segment '+this.currentSegment);
    app.clearRoute();
//    $("#preload_info").html(app.presetPercorsi[this.currentSegment][2]);
//    $("#cruscotto_info").html(app.presetPercorsi[this.currentSegment][2]);
    setTimeout(SegmentManager.timeOutCB, 5000);
};
    //metodi statici
    static timeOutCB(){
        $("#splash2").hide(); 
        $("#splash").hide(); //fermati
        app.log("current segment : "+app.segManager.currentSegment);
        app.log("start : "+app.presetPercorsi[app.segManager.currentSegment][0]);
        app.makeRoute(app.presetPercorsi[app.segManager.currentSegment][0],app.presetPercorsi[app.segManager.currentSegment][1]);
        setTimeout(function(){ app.autorunBySpeed(); }, 5000);        
    }

}
