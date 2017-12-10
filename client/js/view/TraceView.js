class TraceView{
    constructor(){
        this.el=document.getElementById("trace");
        this._trace=$("#trace");
        var posy=$(main).height()-this._trace.height()-10;
        this._trace.css({'top' : posy + 'px'});
        this.count=0;
        this.map=null;
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
//        this.map = new google.maps.Map(this.el, mapOptions);
        this.count=0;
        this.poly = new google.maps.Polyline({
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 1
        });
        this.poly.setMap(this.map);
        this.path = this.poly.getPath();

//        this.addMarker(origin);
//        $("#trace").show();
    }
    
    /**
     * add a marker in the map
     * @param {google.maps.LatLng} point
     * @returns {void}
     */
    addMarker(point){
        if(this.map==null){
            this.setMap(point);
        }
        else {
//        new google.maps.Marker({
//            position: point,
//            map: this.map,
//            icon: {
//                path: google.maps.SymbolPath.CIRCLE,
//                scale: 1
//            },
//        });
            this.path.push(point);
            this.map.setCenter(point);
            this.count++;
    //        app.log("addMArker #"+this.count+' '+JSON.stringify(point));
        }
    }
}

