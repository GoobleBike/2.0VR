class TraceView{
    constructor(){
        this.el=document.getElementById("trace");
        this._trace=$("#trace");
        var posy=$(main).height()-this._trace.height()-10;
        this._trace.css({'top' : posy + 'px'});
    }
    
    /**
     * a new map in trace window centered on origin pont
     * marker on center
     * @param {LatLng} origin
     * @returns {TraceView}
     */
    setMap(origin){
//        $("#trace").hide();
        $("#trace").show();
        var mapOptions = {
            center: origin,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };
        //map in canvas
        this.map = new google.maps.Map(this.el, mapOptions);
        this.addMarker(origin);
//        $("#trace").show();
    }
    
    /**
     * add a marker in the map
     * @param {google.maps.LatLng} point
     * @returns {void}
     */
    addMarker(point){
        new google.maps.Marker({
           position: point,
           map: this.map,
           icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 1
    },

        });
        this.map.setCenter(point);
        app.log("addMArker "+JSON.stringify(point));
    }
}

