/* $Id: BaseMeter.js 147 2013-10-03 14:50:17Z ragno $ */

/*
 * This program is free software; you can redistribuite it and/or modify it 
 * under the terms of the GNU/General Pubblic License as published the Free software Foundation; 
 * either version 3 of the License, or (at your opinion) any later version
 */

function BaseMeter(canvasId,canvasWidth,canvasEight) {
  //COSTANTI
  // dimensionamento presentazione
  this.MIN_MEASURE = -30;
  this.MAX_MEASURE = 30;
  this.MIN_PRESENTATION_DEGREE = -45;//in presentazione MIN_MEASURE viene mostrato con MIN_PRESENTATION_DEGREE
  this.MAX_PRESENTATION_DEGREE = 45;//in presentazione MAX_MEASURE viene mostrato con MAX_PRESENTATION_DEGREE
  //fattore di scala per la presentaione NB se una classe estesa ridefinisce uno di questi parametri deve anche ridefinire SCALE_FACTOR
  this.SCALE_FACTOR=(this.MAX_PRESENTATION_DEGREE-this.MIN_PRESENTATION_DEGREE)/(this.MAX_MEASURE-this.MIN_MEASURE);
  this.DELTA_INERZIALE = 2; //in presentazione le variazioni si muovono di questo delta ad ogni refresh
  // dimensionamento immagine
  this.ARC_START = 0;
  this.ARC_STOP = 2*Math.PI;  // angolo giro
  this.SEMI_TRANSPARENT_LOW = 77;
  this.SEMI_TRANSPARENT_TOP = 82;
  this.CENTER_X = 95;
  this.CENTER_Y = 48;
  this.RADIUS = 64;
  this.OUTER_RADIUS = 91;
  this.LEVEL_RADIUS_DIFF = 5;
  this.OPTION_RADIUS_DIFF = 15;
  this.FONT_POINT = 16;
  this.FONT_X_DIFF = 1;
  this.FONT_Y = 30+8;
/*
Parametro	OrigX	OrigY	NuovoX	NuovoY
canvas width	440		200	
canvas height		440		50
centerX_____	210		95	
centerY_____		210		24
radius______	140		64	
SemiTrLow	170		77	
SemiTrTop	180		82	
outerRadius	200		91	
lvlRadDiff	10		5	
optRadDiff	32		15	
fontPoint	40		18	
fontXdiff	48		22	
fontY_______		130		15
 */
  
  
  //attributi della classe
  //canvas
  this.canvasId = canvasId;
  this.canvasWidth = canvasWidth;
  this.canvasEight = canvasEight;
  this.canvas = document.getElementById(canvasId);
  //la misura
  this.iCurrentMeasure = 0;
  this.iTargetMeasure = 0;
  this.bDecrement = null;
  //per gestione inerzia 
  this.jobEnable=false; //porre a true per abilitare inerzia in real time
  this.jobTimeout=100; //msec
  this.job = null;
  //per debug
  this.consoleEnable=false;
}

BaseMeter.prototype.degToRad = function(angle) {
	// Degrees to radians
	return ((angle * Math.PI) / 180);
};

BaseMeter.prototype.radToDeg = function(angle) {
	// Radians to degree
	return ((angle * 180) / Math.PI);
};

BaseMeter.prototype.drawLine = function(options, line) {
	// Draw a line using the line object passed in
	options.ctx.beginPath();

	// Set attributes of open
	options.ctx.globalAlpha = line.alpha;
	options.ctx.lineWidth = line.lineWidth;
	options.ctx.fillStyle = line.fillStyle;
	options.ctx.strokeStyle = line.fillStyle;
	options.ctx.moveTo(line.from.X,
		line.from.Y);

	// Plot the line
	options.ctx.lineTo(
		line.to.X,
		line.to.Y
	);

	options.ctx.stroke();
};

BaseMeter.prototype.createLine = function(fromX, fromY, toX, toY, fillStyle, lineWidth, alpha) {
	// Create a line object using Javascript object notation
	return {
		from: {
			X: fromX,
			Y: fromY
		},
		to:	{
			X: toX,
			Y: toY
		},
		fillStyle: fillStyle,
		lineWidth: lineWidth,
		alpha: alpha
	};
};

BaseMeter.prototype.drawOuterMetallicArc = function(options) {
	/* Draw the metallic border of the landmeter 
	 * Outer grey area
	 */
	options.ctx.beginPath();

	// Nice shade of grey
	options.ctx.fillStyle = "rgb(127,127,127)";

	// Draw the outer circle
	options.ctx.arc(options.center.X,
		options.center.Y,
		options.radius,
		this.ARC_START,
		this.ARC_STOP,
		true);

	// Fill the last object
	options.ctx.fill();
};

BaseMeter.prototype.drawInnerMetallicArc = function(options) {
	/* Draw the metallic border of the landmeter 
	 * Inner white area
	 */

	options.ctx.beginPath();

	// White
	options.ctx.fillStyle = "rgb(255,255,255)";

	// Outer circle (subtle edge in the grey)
	options.ctx.arc(options.center.X,
					options.center.Y,
					(options.radius / 100) * 90,
					this.ARC_START,
					this.ARC_STOP,
					true);

	options.ctx.fill();
};

BaseMeter.prototype.drawMetallicArc = function(options) {
	/* Draw the metallic border of the landmeter
	 * by drawing two semi-circles, one over lapping
	 * the other with a bot of alpha transparency
	 */

	this.drawOuterMetallicArc(options);
	this.drawInnerMetallicArc(options);
};

BaseMeter.prototype.drawBackground = function(options) {
	/* Black background with alphs transparency to
	 * blend the edges of the metallic edge and
	 * black background
	 */
    var i = 0;

	options.ctx.globalAlpha = 0.2;
	options.ctx.fillStyle = "rgb(0,0,0)";

	// Draw semi-transparent circles
	for (i = this.SEMI_TRANSPARENT_LOW; i < this.SEMI_TRANSPARENT_TOP; i++) {
		options.ctx.beginPath();

		options.ctx.arc(options.center.X,
			options.center.Y,
			i,
			this.ARC_START,
			this.ARC_STOP,
			true);

		options.ctx.fill();
	}
};

BaseMeter.prototype.applyDefaultContextSettings = function(options) {
	/* Helper function to revert to gauges
	 * default settings
	 */

	options.ctx.lineWidth = 2;
	options.ctx.globalAlpha = 0.5;
	options.ctx.strokeStyle = "rgb(255, 255, 255)";
	options.ctx.fillStyle = 'rgb(255,255,255)';
};

BaseMeter.prototype.convertMeasureToAngle = function(options) {
	/* Helper function to convert a speed to the 
	* equivelant angle.
	*/
//	var measureAsAngle = (options.measure/this.MAX_MEASURE)*this.MAX_PRESENTATION_DEGREE;
        //measureAngle=this.MIN_PRESENTATION_ANGLE+(this.MAX_PRESENTATION_DEGREE-this.MIN_PRESENTATION_DEGREE)/(this.MAX_MEASURE-this.MIN_MEASURE)*(options.measure-this.MIN_MEASURE)
	var measureAsAngle = this.MIN_PRESENTATION_DEGREE+this.SCALE_FACTOR*(options.measure-this.MIN_MEASURE);
	measureAsAngle = this.degToRad(measureAsAngle);
	return measureAsAngle;
};


BaseMeter.prototype.buildOptionsAsJSON = function() {
	/* Setting for the landmeter 
	* Alter these to modify its look and feel
	*/
	return {
		ctx: this.canvas.getContext('2d'),
		measure: this.iCurrentMeasure,
		center:	{
			X: this.CENTER_X,
			Y: this.CENTER_Y
		},
		levelRadius: this.RADIUS - this.LEVEL_RADIUS_DIFF ,
		gaugeOptions: {
			center:	{
				X: this.CENTER_X,
				Y: this.CENTER_Y
			},
			radius: this.RADIUS
		},
		radius: this.OUTER_RADIUS
	};
};

BaseMeter.prototype.writeText = function(options) {
	options.ctx.font = 'italic '+this.FONT_POINT+'pt Calibri';
    options.ctx.fillText(options.measure+'%', options.center.X-this.FONT_X_DIFF, this.FONT_Y);
};

BaseMeter.prototype.clearCanvas = function(options) {
	options.ctx.clearRect(0, 0, this.canvasWidth, this.canvasEight);
	this.applyDefaultContextSettings(options);
};



BaseMeter.prototype.drawMeasure = function(options) {
  //to be adapted
}

BaseMeter.prototype.draw = function() {
	/* Main entry point for drawing the landmeter
	* If canvas is not support alert the user.
	*/
	
        if (this.consoleEnable){
          console.log('Target: ' + this.iTargetMeasure);
          console.log('Current: ' + this.iCurrentMeasure);
        }
	 
	var    options = null;

	// Canvas good?
	if (this.canvas !== null && this.canvas.getContext) {
		options = this.buildOptionsAsJSON();

	    // Clear this.canvas
	    this.clearCanvas(options);

		// Draw the metallic styled edge
		this.drawMetallicArc(options);

		// Draw thw background
		this.drawBackground(options);

		// Draw the measure
		this.drawMeasure(options);

		
	} else {
		alert("Canvas not supported by your browser!");
	}
	
	if(this.iTargetMeasure == this.iCurrentMeasure) {
		clearTimeout(this.job);
		return;
	} else if(this.iTargetMeasure < this.iCurrentMeasure) {
		this.bDecrement = true;
	} else if(this.iTargetMeasure > this.iCurrentMeasure) {
		this.bDecrement = false;
	}
	
	if(this.bDecrement) {
		// if(this.iCurrentMeasure  -10 < this.iTargetMeasure)
		// 	this.iCurrentMeasure = this.iCurrentMeasure - 1;
		// else
                if (this.iCurrentMeasure - this.DELTA_INERZIALE < this.iTargetMeasure) {
			this.iCurrentMeasure = this.iTargetMeasure;
                      }
                      else {
			this.iCurrentMeasure = this.iCurrentMeasure - this.DELTA_INERZIALE;
                      }
	} else {
	
		// if(this.iCurrentMeasure +10  > this.iTargetMeasure)
		// 	this.iCurrentMeasure = this.iCurrentMeasure + 1;
		// else
                if (this.iCurrentMeasure + this.DELTA_INERZIALE > this.iTargetMeasure) {
			this.iCurrentMeasure = this.iTargetMeasure;
                      }
                      else {
			this.iCurrentMeasure = this.iCurrentMeasure + this.DELTA_INERZIALE;
                      }
	}
//in alternativa due livelli di inerzia
/*
	if(bDecrement) {
		if(iCurrentSpeed - 10 < iTargetSpeed)
			iCurrentSpeed = iCurrentSpeed - 1;
		else
			iCurrentSpeed = iCurrentSpeed - 5;
	} else {
	
		if(iCurrentSpeed + 10 > iTargetSpeed)
			iCurrentSpeed = iCurrentSpeed + 1;
		else
			iCurrentSpeed = iCurrentSpeed + 5;
	}
*/
	
//	this.job = setTimeout("this.draw()", 5);
        if (this.jobEnable){
          this.job = setTimeout("goobleControl.view.speedometer.draw()", this.jobTimeout);
        }

};

BaseMeter.prototype.drawWithInputValue = function(myMeasure) {

	//var txtSpeed = document.getElementById('txtSpeed');

//	myMeasure = Math.floor(myMeasure);
	myMeasure = Math.round(myMeasure);

	// if(myMeasure>100){
	// 	myMeasure = 1000;
	// }
	// else if(myMeasure<-100){
	// 	myMeasure = -100;
	// }

	if (myMeasure !== null) {

        this.iTargetMeasure = myMeasure;

		// Sanity checks
		if (isNaN(this.iTargetMeasure)) {
			this.iTargetMeasure = 0;
		} else if (this.iTargetMeasure < this.MIN_MEASURE) {
			this.iTargetMeasure = this.MIN_MEASURE;
		} else if (this.iTargetMeasure > this.MAX_MEASURE) {
			this.iTargetMeasure = this.MAX_MEASURE;
        }
//        this.job = setTimeout("this.draw()", 5);
        if (this.jobEnable){
          this.job = setTimeout("goobleControl.view.speedometer.draw()", this.jobTimeout);
        }
        this.draw();
//alert("drow?");
 
    }
};


