/* $Id: GoobleButtons.js 147 2013-10-03 14:50:17Z ragno $ */

/*
 * This program is free software; you can redistribuite it and/or modify it 
 * under the terms of the GNU/General Pubblic License as published the Free software Foundation; 
 * either version 3 of the License, or (at your opinion) any later version
 */

//automa dei control Buttons
function GoobleButtons() {
    //valori di ingresso
    this.MAKEPATH = 0;
    this.AUTORUN = 1;
    this.RIDE = 2;
    this.STOP = 3;
    this.RESTART = 4;
    //valori di stato
    this.STBY = 0;
    this.RIDING = 1;
    this.AUTORUNNING = 2;
    //variabili di stato
    this.hasPath = false;
    this.isRiding = this.STBY;
    //variabili di uscita
    this.makeButton = document.getElementById("route");
    this.autoButton = document.getElementById("autorun");
    this.startButton = document.getElementById("startButton");
    this.stopButton = document.getElementById("stop");
    this.newRouteButton = document.getElementById("newRoute");
    //inzializza
    this.setButtons();
}
//Trasformazione: modifica lo stato dei bottoni in base allo stato del sistema
GoobleButtons.prototype.setButtons = function() {
    //controlla lo stato dell'automa
    if (this.hasPath) {
        //this.makeButton.disabled = true;
        switch (this.isRiding) {
            case this.STBY:
              //  this.autoButton.disabled = false;
                this.startButton.disabled = false;
                this.startButton.value="START";
               // this.stopButton.disabled = true;
                this.newRouteButton.disabled = false;
                break;
            case this.RIDING:
            case this.AUTORUNNING:
                this.startButton.value="RESTART";
                this.startButton.disabled = false;
             //   this.stopButton.disabled = false;
                this.newRouteButton.disabled = false;
                break;
            default:
                alert("Critical Error GoobleButton 0001");
        }
    }
    else {
        this.startButton.value="START";
       // this.makeButton.disabled = false;
        //this.autoButton.disabled = true;
        this.startButton.disabled = true;
        //this.stopButton.disabled = true;
        this.newRouteButton.disabled = true;
    }
}

//Transizione: cambia lo stato del sistema
GoobleButtons.prototype.action = function(request) {
    switch (request) {
        case this.MAKEPATH:
            this.hasPath = true;
            this.isRiding = this.STBY;
            break;
        case this.AUTORUN:
            this.hasPath = true;
            this.isRiding = this.AUTORUNNING;
            break;
        case this.RIDE:
            this.hasPath = true;
            this.isRiding = this.RIDING;
            break;
        case this.STOP:
            this.hasPath = true;
            this.isRiding = this.STBY;
            break;
        case this.RESTART:
            this.hasPath = false;
            this.isRiding = this.STBY;
            break;
        default:
            alert("Critical Error GoobleButtons 0002");
    }
    this.setButtons();
};


