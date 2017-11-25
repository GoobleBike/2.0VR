/* $Id: Speedometer.js 147 2013-10-03 14:50:17Z ragno $ */

/*
 * This program is free software; you can redistribuite it and/or modify it 
 * under the terms of the GNU/General Pubblic License as published the Free software Foundation; 
 * either version 3 of the License, or (at your opinion) any later version
 */

/*
La classe Speedometer estende Basemeter
 */

function Speedometer(canvasId,canvasWidth,canvasEight,maxSpeed) {
  BaseMeter.call(this,canvasId,canvasWidth,canvasEight);  
  //COSTANTI
  // dimensionamento presentazione
  this.MIN_MEASURE = 0;
  this.MAX_MEASURE = (Math.floor(maxSpeed/10)+1)*10;
  this.MIN_PRESENTATION_DEGREE = 10;//in presentazione MIN_MEASURE viene mostrato con MIN_PRESENTATION_DEGREE
  this.MAX_PRESENTATION_DEGREE = 180-10;//in presentazione MAX_MEASURE viene mostrato con MAX_PRESENTATION_DEGREE
  this.SCALE_FACTOR=(this.MAX_PRESENTATION_DEGREE-this.MIN_PRESENTATION_DEGREE)/(this.MAX_MEASURE-this.MIN_MEASURE);
  this.DELTA_INERZIALE = 5; //in presentazione le variazioni si muovono di questo delta ad ogni refresh
  // dimensionamento immagine
  this.ARC_STOP = Math.PI;  // angolo piatto
  this.CENTER_Y = 90;
  this.tickNumber=(this.MAX_MEASURE/5)+1;//un tick ogni 5 unità, estremi compresi
  this.tickStep=this.SCALE_FACTOR*5;
  
  this.jobEnable=true;//abilita la gestione autonoma dell'inerzia
//  this.consoleEnable=true;

}
Speedometer.prototype = new BaseMeter();



Speedometer.prototype.drawSmallTickMarks = function(options) {
	/* The small tick marks against the coloured
	 * arc drawn every 5 mph from MIN_PRESENTATION_DEGREE degrees to
	 * MAX_PRESENTATION_DEGREE degrees.
	 */

	var tickvalue = options.levelRadius - 8,
	    iTick = 0,
	    gaugeOptions = options.gaugeOptions,
	    iTickRad = 0,
	    onArchX,
	    onArchY,
	    innerTickX,
	    innerTickY,
	    fromX,
	    fromY,
	    line,
		toX,
		toY;

	this.applyDefaultContextSettings(options);

	// Tick every 20 degrees (small ticks)
//	for (iTick = 10; iTick < 180; iTick += 20) {
	for (iTick = this.MIN_PRESENTATION_DEGREE; iTick <= this.MAX_PRESENTATION_DEGREE; iTick += this.tickStep) {

		iTickRad = this.degToRad(iTick);

		/* Calculate the X and Y of both ends of the
		 * line I need to draw at angle represented at Tick.
		 * The aim is to draw the a line starting on the 
		 * coloured arc and continueing towards the outer edge
		 * in the direction from the center of the gauge. 
		 */

		onArchX = gaugeOptions.radius - (Math.cos(iTickRad) * tickvalue);
		onArchY = gaugeOptions.radius - (Math.sin(iTickRad) * tickvalue);
		innerTickX = gaugeOptions.radius - (Math.cos(iTickRad) * gaugeOptions.radius);
		innerTickY = gaugeOptions.radius - (Math.sin(iTickRad) * gaugeOptions.radius);

		fromX = (options.center.X - gaugeOptions.radius) + onArchX;
		fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + onArchY;
		toX = (options.center.X - gaugeOptions.radius) + innerTickX;
		toY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY;

		// Create a line expressed in JSON
		line = this.createLine(fromX, fromY, toX, toY, "rgb(127,127,127)", 3, 0.6);

		// Draw the line
		this.drawLine(options, line);

	}
}

Speedometer.prototype.drawLargeTickMarks = function(options) {
	/* The large tick marks against the coloured
	 * arc drawn every 10 mph from 10 degrees to
	 * 170 degrees.
	 */

	var tickvalue = options.levelRadius - 8,
	    iTick = 0,
        gaugeOptions = options.gaugeOptions,
        iTickRad = 0,
        innerTickY,
        innerTickX,
        onArchX,
        onArchY,
        fromX,
        fromY,
        toX,
        toY,
        line;

	this.applyDefaultContextSettings(options);

	tickvalue = options.levelRadius - 2;

	// 10 units (major ticks)
//	for (iTick = 20; iTick < 180; iTick += 20) {
        for (iTick = this.MIN_PRESENTATION_DEGREE+this.tickStep/2; iTick <= this.MAX_PRESENTATION_DEGREE; iTick += this.tickStep) {

		iTickRad = this.degToRad(iTick);

		/* Calculate the X and Y of both ends of the
		 * line I need to draw at angle represented at Tick.
		 * The aim is to draw the a line starting on the 
		 * coloured arc and continueing towards the outer edge
		 * in the direction from the center of the gauge. 
		 */

		onArchX = gaugeOptions.radius - (Math.cos(iTickRad) * tickvalue);
		onArchY = gaugeOptions.radius - (Math.sin(iTickRad) * tickvalue);
		innerTickX = gaugeOptions.radius - (Math.cos(iTickRad) * gaugeOptions.radius);
		innerTickY = gaugeOptions.radius - (Math.sin(iTickRad) * gaugeOptions.radius);

		fromX = (options.center.X - gaugeOptions.radius) + onArchX;
		fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + onArchY;
		toX = (options.center.X - gaugeOptions.radius) + innerTickX;
		toY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY;

		// Create a line expressed in JSON
		line = this.createLine(fromX, fromY, toX, toY, "rgb(127,127,127)", 3, 0.6);

		// Draw the line
		this.drawLine(options, line);
	}
}

Speedometer.prototype.drawTicks = function(options) {
	/* Two tick in the coloured arc!
	 * Small ticks every 5
	 * Large ticks every 10
	 */
	this.drawSmallTickMarks(options);
	this.drawLargeTickMarks(options);
}

Speedometer.prototype.drawTextMarkers = function(options) {
	/* The text labels marks above the coloured
	 * arc drawn every 10 unit from 10 degrees to
	 * 170 degrees.
	 */
	var innerTickX = 0,
	    innerTickY = 0,
        iTick = 0,
        gaugeOptions = options.gaugeOptions,
        iTickToPrint = 0;

	this.applyDefaultContextSettings(options);

	// Font styling
	options.ctx.font = 'italic 10px sans-serif';
	options.ctx.textBaseline = 'top';

	options.ctx.beginPath();

	// Tick every 20 (small ticks)
//	for (iTick = 10; iTick < 180; iTick += 20) {
        for (iTick = this.MIN_PRESENTATION_DEGREE; iTick <= this.MAX_PRESENTATION_DEGREE; iTick += this.tickStep) {

		innerTickX = gaugeOptions.radius - (Math.cos(this.degToRad(iTick)) * gaugeOptions.radius);
		innerTickY = gaugeOptions.radius - (Math.sin(this.degToRad(iTick)) * gaugeOptions.radius);

		// Some cludging to center the values (TODO: Improve)
		if (iTick <= 10) {
			options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX,
					(gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY + 5);
		} else if (iTick < 50) {
			options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX - 5,
					(gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY + 5);
		} else if (iTick < 90) {
			options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX,
					(gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY);
		} else if (iTick === 90) {
			options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX + 4,
					(gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY);
		} else if (iTick < 145) {
			options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX + 10,
					(gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY);
		} else {
			options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX + 15,
					(gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY + 5);
		}

		// MPH increase by 10 every 20 degrees
		iTickToPrint += 5;
	}

    options.ctx.stroke();
}

Speedometer.prototype.drawSpeedometerPart = function(options, alphaValue, strokeStyle, startPos) {
	/* Draw part of the arc that represents
	* the colour speedometer arc
	*/

	options.ctx.beginPath();

	options.ctx.globalAlpha = alphaValue;
	options.ctx.lineWidth = 5;
	options.ctx.strokeStyle = strokeStyle;

	options.ctx.arc(options.center.X,
		options.center.Y,
		options.levelRadius,
		Math.PI + (Math.PI / 360 * startPos),
		0 - (Math.PI / 360 * 10),
		false);

	options.ctx.stroke();
}

Speedometer.prototype.drawSpeedometerColourArc = function(options) {
	/* Draws the colour arc.  Three different colours
	 * used here; thus, same arc drawn 3 times with
	 * different colours.
	 * TODO: Gradient possible?
	 */

	var startOfGreen = 10,
	    endOfGreen = 200,
	    endOfOrange = 280;

	this.drawSpeedometerPart(options, 1.0, "rgb(82, 240, 55)", startOfGreen);
	this.drawSpeedometerPart(options, 0.9, "rgb(198, 111, 0)", endOfGreen);
	this.drawSpeedometerPart(options, 0.9, "rgb(255, 0, 0)", endOfOrange);

}

Speedometer.prototype.drawNeedleDial = function(options, alphaValue, strokeStyle, fillStyle) {
	/* Draws the metallic dial that covers the base of the
	* needle.
	*/
    var i = 0;

	options.ctx.globalAlpha = alphaValue;
	options.ctx.lineWidth = 3;
	options.ctx.strokeStyle = strokeStyle;
	options.ctx.fillStyle = fillStyle;

	// Draw several transparent circles with alpha
	for (i = 0; i < 30; i++) {

		options.ctx.beginPath();
		options.ctx.arc(options.center.X,
			options.center.Y,
			i,
			0,
			Math.PI,
			true);

		options.ctx.fill();
		options.ctx.stroke();
	}
};


//function convertSpeedToAngle(options) {
//	/* Helper function to convert a speed to the 
//	* equivelant angle.
//	*/
//	//var iSpeed = (options.speed / 10),
//	//    iSpeedAsAngle = ((iSpeed * 20) + 10) % 180;
//	var iSpeed = (options.speed),
//		iSpeedAsAngle = ((iSpeed*4)+10) % 180;
//
//	// Ensure the angle is within range
//	if (iSpeedAsAngle > 180) {
//        iSpeedAsAngle = iSpeedAsAngle - 180;
//    } else if (iSpeedAsAngle < 0) {
//        iSpeedAsAngle = iSpeedAsAngle + 180;
//    }
//
//	return iSpeedAsAngle;
//}

Speedometer.prototype.drawNeedle = function(options) {
	/* Draw the needle in a nice read colour at the
	* angle that represents the options.speed value.
	*/

//	var iSpeedAsAngle = convertSpeedToAngle(options),
	var iSpeedAsAngleRad = this.convertMeasureToAngle(options),
//	    iSpeedAsAngleRad = this.degToRad(iSpeedAsAngle),
        gaugeOptions = options.gaugeOptions,
        innerTickX = gaugeOptions.radius - (Math.cos(iSpeedAsAngleRad) * 20),
        innerTickY = gaugeOptions.radius - (Math.sin(iSpeedAsAngleRad) * 20),
        fromX = (options.center.X - gaugeOptions.radius) + innerTickX,
        fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY,
        endNeedleX = gaugeOptions.radius - (Math.cos(iSpeedAsAngleRad) * gaugeOptions.radius),
        endNeedleY = gaugeOptions.radius - (Math.sin(iSpeedAsAngleRad) * gaugeOptions.radius),
        toX = (options.center.X - gaugeOptions.radius) + endNeedleX,
        toY = (gaugeOptions.center.Y - gaugeOptions.radius) + endNeedleY,
        line = this.createLine(fromX, fromY, toX, toY, "rgb(255,0,0)", 5, 0.6);

	this.drawLine(options, line);

	// Two circle to draw the dial at the base (give its a nice effect?)
	this.drawNeedleDial(options, 0.6, "rgb(127, 127, 127)", "rgb(255,255,255)");
	this.drawNeedleDial(options, 0.2, "rgb(127, 127, 127)", "rgb(127,127,127)");

}

//function buildOptionsAsJSON(canvas, iSpeed) {
//	/* Setting for the speedometer 
//	* Alter these to modify its look and feel
//	*/
//
//	var centerX = 210,
//	    centerY = 210,
//        radius = 140,
//        outerRadius = 200;
//
//	// Create a speedometer object using Javascript object notation
//	return {
//		ctx: canvas.getContext('2d'),
//		speed: iSpeed,
//		center:	{
//			X: centerX,
//			Y: centerY
//		},
//		levelRadius: radius - 10,
//		gaugeOptions: {
//			center:	{
//				X: centerX,
//				Y: centerY
//			},
//			radius: radius
//		},
//		radius: outerRadius
//	};
//}
//
//function clearCanvas(options) {
//	options.ctx.clearRect(0, 0, 800, 600);
//	applyDefaultContextSettings(options);
//}

Speedometer.prototype.drawMeasure = function(options) {
		// Draw tick marks
		this.drawTicks(options);

		// Draw labels on markers
		this.drawTextMarkers(options);

		// Draw speeometer colour arc
		this.drawSpeedometerColourArc(options);

		// Draw the needle and base
		this.drawNeedle(options);
};



