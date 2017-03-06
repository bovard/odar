var GraphicsConstants = require('./GraphicsConstants');
var BoundingBox = require('./BoundingBox');
var Point = require('./Point');
var clone = require('clone');

function GraphicsLibrary(canvas){
	this._canvas = canvas;
	this._ctx = this._canvas.getContext("2d");
};

GraphicsLibrary.prototype.getCanvasWidth = function(){
	return this._canvas.width;
};

GraphicsLibrary.prototype.getCanvasHeight = function(){
	return this._canvas.height;
};

GraphicsLibrary.prototype.windowCoords2canvasPoint = function(windowX, windowY){
	var canvasBoundingRect = this._canvas.getBoundingClientRect();
	return new Point(
		windowX - canvasBoundingRect.left,
		windowY - canvasBoundingRect.top
	);
};

GraphicsLibrary.prototype.clearCanvas = function(){
	this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
};


GraphicsLibrary.prototype.fillCanvas = function(color){
	this._ctx.save();

	this._ctx.fillStyle = color;
	this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

	this._ctx.restore();
};

GraphicsLibrary.prototype.getCanvasAsImageData = function(){
	return this._ctx.getImageData(0, 0, this._canvas.width, this._canvas.height);
};

GraphicsLibrary.prototype.setCanvasFromImageData = function(imageData){
	this._ctx.putImageData(imageData, 0, 0);
};

/*
	settings = 
		{
			img: new Image(), // HTML Img node
			centerPoint: new Point(10,10), // center point of clipped image that governs placement, default is geometric center
			target: new Point(300, 200), // image rendered such that centerPoint of image aligns with target on canvas
			clippingRect: new BoundingBox( // The clipping rectangle to use to determine which part of the src image to draw, 
				new Point(10,10),		  // defualt is no clipping
				new Point(50,50)
			),
			scaleX: 1.2 // the factor to scale the image in the x-axis, default 1.0
			scaleY: 1.4, // the factor to scale the image in the y-axis, default 1.0
			alpha: 0.5 // the alpha setting, 0 - completely transparent, 1 - completely opaque. Default is 1. 
		}
*/
GraphicsLibrary.prototype.drawImage = function(settings){
	this._ctx.save();

	var clippingRect = settings.clippingRect ? 
			settings.clippingRect : 
			new BoundingBox(new Point(0,0), new Point(settings.img.width, settings.img.height)),
		imgWidth = clippingRect.bottomRight().x() - clippingRect.topLeft().x(),
		imgHeight = clippingRect.bottomRight().y() - clippingRect.topLeft().y(),
		centerPoint = settings.centerPoint ? settings.centerPoint : new Point(imgWidth / 2, imgHeight / 2),
		scaleX = settings.scaleX ? settings.scaleX : 1.0,
		scaleY = settings.scaleY ? settings.scaleY : 1.0,
		alpha = settings.alpha != null ? settings.alpha : 1.0;
	this._ctx.globalAlpha = alpha;
	this._ctx.drawImage(
		settings.img, 
		clippingRect.topLeft().x(), 
		clippingRect.topLeft().y(), 
		imgWidth, 
		imgHeight,
		settings.target.x() - centerPoint.x() * scaleX,
		settings.target.y() - centerPoint.y() * scaleY, 
		imgWidth * scaleX, 
		imgHeight * scaleY);

	this._ctx.restore();
};

/*
	settings = 
		{
			center: new Point(100,100), // center point of circle
			radius: 10, // radius of circle in px
			lineWidth: 2, // line width of circle
			lineStyle: "#FF0000" // line style of circle
		}
*/
GraphicsLibrary.prototype.drawCircle = function(settings){
	this._ctx.save();

	this._ctx.lineWidth = settings.lineWidth;
	this._ctx.strokeStyle = settings.lineStyle;

	this._ctx.beginPath();
	this._ctx.arc(settings.center.x(), settings.center.y(), settings.radius, 0, 2*Math.PI);
	this._ctx.stroke();

	this._ctx.restore();
};

/*
	settings =
		{
			topLeft: new Point(50,100), // top left point of grid
			width: 100, // grid width in px
			height: 100, // grid height in px
			cols: 10, // number of columns
			rows: 10, // number of rows
			lineWidth: 2, // grid line width in px
			lineStyle: "#FF0000" // grid line style
		}
*/
GraphicsLibrary.prototype.drawGrid = function(settings){
	this._ctx.save();

	var lineEnd = new Point(0,0);
	var colWidth = Math.floor(settings.width / settings.cols);
	var rowWidth = Math.floor(settings.height / settings.rows);

	// Draw grid perimeter
	this.drawRect({
		topLeft: settings.topLeft,
		width: settings.width,
		height: settings.height,
		lineWidth: settings.lineWidth,
		lineStyle: settings.lineStyle
	});

	// Draw column lines
	var lineStart = clone(settings.topLeft);
	lineStart.x(lineStart.x() + colWidth);
	lineEnd.x(lineStart.x());
	lineEnd.y(lineStart.y() + settings.height);
	for(var col = 2; col <= settings.cols; col++){
		this.drawLine({
			start: lineStart,
			end: lineEnd,
			width: settings.lineWidth,
			style: settings.lineStyle
		});

		lineStart.x(lineStart.x() + colWidth);
		lineEnd.x(lineStart.x());
	}

	// Draw row lines
	lineStart = clone(settings.topLeft);
	lineStart.y(lineStart.y() + rowWidth);
	lineEnd.x(lineStart.x() + settings.width);
	lineEnd.y(lineStart.y());
	for(var row = 2; row <= settings.rows; row++){
		this.drawLine({
			start: lineStart,
			end: lineEnd,
			width: settings.lineWidth,
			style: settings.lineStyle
		});

		lineStart.y(lineStart.y() + rowWidth);
		lineEnd.y(lineStart.y());
	}

	this._ctx.restore();
};

/*
	settings = 
		{
			topLeft: new Point(0,0), // top left point of rectangle
			width: 100, // width of rectangle in px
			height: 200, // height of rectangle in px
			lineWidth: 2, // line width in px
			lineStyle: "#FF0000" // rectangle line style
		}
*/
GraphicsLibrary.prototype.drawRect = function(settings){
	this._ctx.save();

	this._ctx.lineWidth = settings.lineWidth;
	this._ctx.strokeStyle = settings.lineStyle;

	this._ctx.beginPath();
	this._ctx.rect(
		settings.topLeft.x(), 
		settings.topLeft.y(), 
		settings.width, 
		settings.height);
	this._ctx.stroke();

	this._ctx.restore();
};

/*
	settings = 
		{
			start: new Point(0,0), // starting point of line
			end: new Point(10,10), // ending point of line
			width: 2, // width of line in px
			style: "#FF0000" // line style
		}
*/
GraphicsLibrary.prototype.drawLine = function(settings){
	this._ctx.save();

	this._ctx.lineWidth = settings.width;
	this._ctx.strokeStyle = settings.style;

	this._ctx.beginPath();
	this._ctx.moveTo(settings.start.x(), settings.start.y());
	this._ctx.lineTo(settings.end.x(), settings.end.y());
	this._ctx.stroke();

	this._ctx.restore();
};

/*
	settings = 
		{
			text: "sample text", // the text to draw
			pos: new Point(0,0), // the position to draw the text
			align: "center", // the alignment setting, options: center, topleft
							 // center will center text horizontally and vertically around pos, topleft 
							 // will align pos with the top left corner of the text em box, default is center
			fontStyle: "48px serif", // font size and style settings
			stroke: false, // whether to stroke text, default is false (meaning text will be filled),
			style: "black" // the style to use to fill or stroke the text
		}
*/
GraphicsLibrary.prototype.drawText = function(settings){
	this._ctx.save();

	var x = settings.pos.x(),
		y = settings.pos.y(),
		alignment = settings.align != null ? settings.align : "center";
	this._ctx.font = settings.fontStyle;
	this._ctx.textBaseline = "hanging";
	if(alignment === "center"){
		var textMetrics = this._ctx.measureText(settings.text);
		var textHalfWidth = textMetrics.width / 2,
			textHalfHeight = (this._ctx.measureText("w").width * (4/3)) / 2; // approx
		// If browser supports emHeightAscent and emHeightDescent, refine text half height measurment
		if(textMetrics.emHeightAscent && textMetrics.emHeightDescent){
			textHalfHeight = (textMetrics.emHeightAscent + textMetrics.emHeightDescent) / 2;
		}
		x = settings.pos.x() - textHalfWidth;
		y = settings.pos.y() - textHalfHeight;
	}

	if(settings.stroke){
		this._ctx.strokeStyle = settings.style;
		this._ctx.strokeText(settings.text, x, y);
	}else{
		this._ctx.fillStyle = settings.style;
		this._ctx.fillText(settings.text, x, y);
	}

	this._ctx.restore();
};

module.exports = GraphicsLibrary;