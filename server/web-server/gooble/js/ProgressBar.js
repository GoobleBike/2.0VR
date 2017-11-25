/* $Id: GooblePath.js 133 2013-09-24 13:32:34Z ragno $ */

/*
 * This program is free software; you can redistribuite it and/or modify it 
 * under the terms of the GNU/General Pubblic License as published the Free software Foundation; 
 * either version 3 of the License, or (at your opinion) any later version
 */

/**
 * Oggetto per la gestione di una progress bar
 * @returns {ProgressBar}
 */
function ProgressBar() {
    this.img,
    this.iHEIGHT = 33, //50, //161
    this.iWIDTH = 206, //208, //670
    this.canvas = null, 
    this.ctx = null, 
    this.slider = null;
    
    this.init();
}

ProgressBar.prototype.drawBase = function() {

    this.ctx.drawImage(this.img, 0, 0, this.iWIDTH, this.iHEIGHT, 0, 0, this.iWIDTH, this.iHEIGHT);

}

ProgressBar.prototype.drawProgress = function(s) {

    var x1 = 51,  // X position where the progress segment starts
        x2 = 190,  // X position where the progress segment ends
//        s = slider.value, 
        x3 = 0,
        x4 = 16, // X position 
        y1 = 20; //79; //63;
        
    // Calculated x position where the overalyed image should end

    x3 = (x1 + ((x2 - x1) / 100) * s);

    this.ctx.drawImage(this.img, 0, this.iHEIGHT, x3, this.iHEIGHT, 0, 0, x3, this.iHEIGHT);

    // Text to screen
    this.ctx.fillStyle = "grey";
    this.ctx.font = "8pt Arial"; //"14pt Arial";
    this.ctx.fillText(s + " %", x4, y1);
}

 ProgressBar.prototype.drawImage = function(s) {

    // Draw the base image - no progress
    this.drawBase();

    // Draw the progress segment level
    this.drawProgress(s);

}

 ProgressBar.prototype.drawImage0 = function() {

    // 
    goobleControl.view.progressBar.drawImage(0);

};

 ProgressBar.prototype.init = function() {

    this.canvas = document.getElementById('progress');

    // Create the image resource
    this.img = new Image();

    // Canvas supported?
    if (this.canvas.getContext) {

        this.ctx = this.canvas.getContext('2d');
//        slider = document.getElementById('slider');

        // Setup the onload event
        this.img.onload = this.drawImage0;

        // Load the image
        this.img.src = 'images/progress_tiles206x66.jpg';

    } else {
        alert("Canvas not supported!");
    }
}
