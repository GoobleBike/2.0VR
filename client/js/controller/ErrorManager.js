class ErrorManager{
    
    constructor(enable,logApi) {
        this._enable=enable;
        //future inprovment: an API for remote logging
        this.logApi= logApi;
    }
    /**
     * Setter di abilitazione al log
     * @param {boolean} b
     * @returns {undefined}
     */
    set enable(b){
        this._enable=b;
    }

    //gestisce msg di critical error non mascherabili
    critical(msg) {
        this.log("CRITICAL: "+msg);
//        alert(msg);
    };

    //gestisce msg di debug, mascherabili
    debug(msg) {
        if (this._enable){
            this.log(msg);
//            alert(msg);
        }
    };

    log(msg) {
        //chiama api
        console.log(msg);
    };

}


