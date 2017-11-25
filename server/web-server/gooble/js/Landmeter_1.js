/* $Id: GooblePath.js 133 2013-09-24 13:32:34Z ragno $ */

// dimensionamento presentazione
var MAX_INCLINATION_DEGREE=30;
var MAX_PRESENTATION_DEGREE=45;//in presentazione MAX_INCLINATION_DEGREE viene mostrato con MAX_PRESENTATION_DEGREE
var DELTA_INERZIALE=2; //in presentazione le variazioni si muovono di questo delta ad ogni refresh

// dimensionamento immagine
var CANVAS_WIDTH=200;
var CANVAS_HEIGHT=50;
var CENTER_X=95;
var CENTER_Y=24+10;
var RADIUS=64;
var SEMI_TRANSPARENT_LOW=77;
var SEMI_TRANSPARENT_TOP=82;
var OUTER_RADIUS=91;
var LEVEL_RADIUS_DIFF=5;
var OPTION_RADIUS_DIFF=15;
var FONT_POINT=16;
var FONT_X_DIFF=24;
var FONT_Y=15+8;

//var CANVAS_WIDTH=440;
//var CANVAS_HEIGHT=440;
//var CENTER_X=210;
//var CENTER_Y=210;
//var RADIUS=140;
//var OUTER_RADIUS=200;
//var LEVEL_RADIUS_DIFF=10;
//var OPTION_RADIUS_DIFF=32;
//var FONT_POINT=40;
//var FONT_X_DIFF=48;
//var FONT_Y=130;

//var CANVAS_WIDTH=150;
//var CANVAS_HEIGHT=50;
//var CENTER_X=72;
//var CENTER_Y=24;
//var RADIUS=48;
//var OUTER_RADIUS=68;
//var LEVEL_RADIUS_DIFF=3;
//var OPTION_RADIUS_DIFF=11;
//var FONT_POINT=14;
//var FONT_X_DIFF=16;
//var FONT_Y=15;

//var CANVAS_WIDTH=100;
//var CANVAS_HEIGHT=50;
//var CENTER_X=48;
//var CENTER_Y=24;
//var RADIUS=32;
//var OUTER_RADIUS=45;
//var LEVEL_RADIUS_DIFF=2;
//var OPTION_RADIUS_DIFF=7;
//var FONT_POINT=10;
//var FONT_X_DIFF=11;
//var FONT_Y=15;

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


function Landmeter() {
  this.iCurrentInclination = 0,
  this.iTargetInclination = 0,
  this.bDecrement = null,
  this.job = null;
   
}



Landmeter.prototype.degToRad = function(angle) {
	// Degrees to radians
	return ((angle * Math.PI) / 180);
};

Landmeter.prototype.radToDeg = function(angle) {
	// Radians to degree
	return ((angle * 180) / Math.PI);
};

Landmeter.prototype.drawLine = function(options, line) {
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
}

Landmeter.prototype.createLine = function(fromX, fromY, toX, toY, fillStyle, lineWidth, alpha) {
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
}

Landmeter.prototype.drawOuterMetallicArc = function(options) {
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
		0,
		2*2*Math.PI,
		true);

	// Fill the last object
	options.ctx.fill();
}

Landmeter.prototype.drawInnerMetallicArc = function(options) {
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
					0,
					2*Math.PI,
					true);

	options.ctx.fill();
}

Landmeter.prototype.drawMetallicArc = function(options) {
	/* Draw the metallic border of the landmeter
	 * by drawing two semi-circles, one over lapping
	 * the other with a bot of alpha transparency
	 */

	this.drawOuterMetallicArc(options);
	this.drawInnerMetallicArc(options);
}

Landmeter.prototype.drawBackground = function(options) {
	/* Black background with alphs transparency to
	 * blend the edges of the metallic edge and
	 * black background
	 */
    var i = 0;

	options.ctx.globalAlpha = 0.2;
	options.ctx.fillStyle = "rgb(0,0,0)";

	// Draw semi-transparent circles
	for (i = SEMI_TRANSPARENT_LOW; i < SEMI_TRANSPARENT_TOP; i++) {
		options.ctx.beginPath();

		options.ctx.arc(options.center.X,
			options.center.Y,
			i,
			0,
			2*Math.PI,
			true);

		options.ctx.fill();
	}
}

Landmeter.prototype.applyDefaultContextSettings = function(options) {
	/* Helper function to revert to gauges
	 * default settings
	 */

	options.ctx.lineWidth = 2;
	options.ctx.globalAlpha = 0.5;
	options.ctx.strokeStyle = "rgb(255, 255, 255)";
	options.ctx.fillStyle = 'rgb(255,255,255)';
}




Landmeter.prototype.convertInclinationToAngle = function(options) {
	/* Helper function to convert a speed to the 
	* equivelant angle.
	*/
	var inclinationAsAngle = (options.inclination/MAX_INCLINATION_DEGREE)*MAX_PRESENTATION_DEGREE;
	inclinationAsAngle = this.degToRad(inclinationAsAngle);
	return inclinationAsAngle;
}

Landmeter.prototype.drawLand = function(options) {
	options.ctx.beginPath();

	// 80% transparency
	options.ctx.globalAlpha = 0.8;
	// orange
	options.ctx.fillStyle = "rgb(255,159,56)";

	// Draw the outer circle
	options.ctx.arc(options.center.X,
		options.center.Y,
		options.radius-OPTION_RADIUS_DIFF,
		Math.PI+this.convertInclinationToAngle(options),
		this.convertInclinationToAngle(options),
		true);

	// Fill the last object
	options.ctx.fill();

}

// 

Landmeter.prototype.buildOptionsAsJSON = function(canvas, myInclination) {
	/* Setting for the landmeter 
	* Alter these to modify its look and feel
	*/

	var centerX = CENTER_X ,
	    centerY = CENTER_Y ,
        radius = RADIUS ,
        outerRadius = OUTER_RADIUS ;

	
	return {
		ctx: canvas.getContext('2d'),
		inclination: myInclination,
		center:	{
			X: centerX,
			Y: centerY
		},
		levelRadius: radius - LEVEL_RADIUS_DIFF ,
		gaugeOptions: {
			center:	{
				X: centerX,
				Y: centerY
			},
			radius: radius
		},
		radius: outerRadius
	};
}

Landmeter.prototype.writeText = function(options) {
	options.ctx.font = 'italic '+FONT_POINT+'pt Calibri';
    options.ctx.fillText(options.inclination+'%', options.center.X-FONT_X_DIFF, FONT_Y);
}

Landmeter.prototype.clearCanvas = function(options) {
	options.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	this.applyDefaultContextSettings(options);
}

Landmeter.prototype.draw = function() {
	/* Main entry point for drawing the landmeter
	* If canvas is not support alert the user.
	*/
		
	console.log('Target: ' + this.iTargetInclination);
	console.log('Current: ' + this.iCurrentInclination);
	
	var canvas = document.getElementById('canvas_pendenza'),
	    options = null;

	// Canvas good?
	if (canvas !== null && canvas.getContext) {
		options = this.buildOptionsAsJSON(canvas, this.iCurrentInclination);

	    // Clear canvas
	    this.clearCanvas(options);

		// Draw the metallic styled edge
		this.drawMetallicArc(options);

		// Draw thw background
		this.drawBackground(options);

		//draw the land
		this.drawLand(options);

		//write text
		this.writeText(options);
		
	} else {
		alert("Canvas not supported by your browser!");
	}
	
	if(this.iTargetInclination == this.iCurrentInclination) {
		clearTimeout(this.job);
		return;
	} else if(this.iTargetInclination < this.iCurrentInclination) {
		this.bDecrement = true;
	} else if(this.iTargetInclination > this.iCurrentInclination) {
		this.bDecrement = false;
	}
	
	if(this.bDecrement) {
		// if(this.iCurrentInclination  -10 < this.iTargetInclination)
		// 	this.iCurrentInclination = this.iCurrentInclination - 1;
		// else
                if (this.iCurrentInclination - DELTA_INERZIALE < this.iTargetInclination) {
			this.iCurrentInclination = this.iTargetInclination;
                      }
                      else {
			this.iCurrentInclination = this.iCurrentInclination - DELTA_INERZIALE;
                      }
	} else {
	
		// if(this.iCurrentInclination +10  > this.iTargetInclination)
		// 	this.iCurrentInclination = this.iCurrentInclination + 1;
		// else
                if (this.iCurrentInclination + DELTA_INERZIALE > this.iTargetInclination) {
			this.iCurrentInclination = this.iTargetInclination;
                      }
                      else {
			this.iCurrentInclination = this.iCurrentInclination + DELTA_INERZIALE;
                      }
	}
	
//	this.job = setTimeout("this.draw()", 5);
}

Landmeter.prototype.drawWithInputValue = function(myInclination) {

	//var txtSpeed = document.getElementById('txtSpeed');

//	myInclination = Math.floor(myInclination);
	myInclination = Math.round(myInclination);

	// if(myInclination>100){
	// 	myInclination = 1000;
	// }
	// else if(myInclination<-100){
	// 	myInclination = -100;
	// }

	if (myInclination !== null) {

        this.iTargetInclination = myInclination;

		// Sanity checks
		if (isNaN(this.iTargetInclination)) {
			this.iTargetInclination = 0;
		} else if (this.iTargetInclination < -MAX_INCLINATION_DEGREE) {
			this.iTargetInclination = -MAX_INCLINATION_DEGREE;
		} else if (this.iTargetInclination > MAX_INCLINATION_DEGREE) {
			this.iTargetInclination = MAX_INCLINATION_DEGREE;
        }
//        this.job = setTimeout("this.draw()", 5);
        this.draw();
//alert("drow?");
 
    }
}