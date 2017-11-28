/*
 * This program is free software; you can redistribuite it and/or modify it 
 * under the terms of the GNU/General Pubblic License as published the Free software Foundation; 
 * either version 3 of the License, or (at your opinion) any later version
 */

/*
La classe Landmeter estende Basemeter
 */


class DirectionMeter extends BaseMeter {
    
    constructor(canvasId,canvasWidth,canvasEight) {
        super(canvasId,canvasWidth,canvasEight);  
        this.CENTER_Y = 48+20;
    }
    writeText(options) {
	options.ctx.font = 'italic '+this.FONT_POINT+'pt Calibri';
        options.ctx.fillText(options.measure+'°', options.center.X-this.FONT_X_DIFF, this.FONT_Y);
    };

    drawLand(options) {
	options.ctx.beginPath();
	// 80% transparency
	options.ctx.globalAlpha = 0.8;
	// orange
	options.ctx.fillStyle = "rgb(255,159,56)";
	// Draw the outer circle
	options.ctx.arc(options.center.X,
            options.center.Y,
            options.radius-this.OPTION_RADIUS_DIFF,
            Math.PI+this.convertMeasureToAngle(options),
            this.convertMeasureToAngle(options),
            true);
	// Fill the last object
	options.ctx.fill();
    };

    drawMeasure(options) {
        //draw the land
        this.drawLand(options);
        //write text
        this.writeText(options);
    };

//convertInclinationToAngle(options) {
//	/* Helper function to convert a speed to the 
//	* equivelant angle.
//	*/
//	var inclinationAsAngle = (options.inclination/MAX_INCLINATION_DEGREE)*MAX_PRESENTATION_DEGREE;
//	inclinationAsAngle = this.degToRad(inclinationAsAngle);
//	return inclinationAsAngle;
//}

}
