var clone = require('clone');

function _validateBoundaryPoints(topLeft, bottomRight){
	if(
		topLeft.x() > bottomRight.x() ||
		topLeft.y() > bottomRight.y()
	){
		throw "Invalid boundary points";
	}
}

/***************/
/* Constructor */
/***************/
function BoundingBox(topLeft, bottomRight){
	_validateBoundaryPoints.call(this, topLeft, bottomRight);
	this._topLeft = topLeft;
	this._bottomRight = bottomRight;
};

// Getters / Setters
BoundingBox.prototype.topLeft = function(newTopLeft){ if(!!newTopLeft){ this._topLeft = newTopLeft; }else{ return clone(this._topLeft); }};
BoundingBox.prototype.bottomRight = function(newBottomRight) { if(!!newBottomRight){ this._bottomRight = newBottomRight; }else{ return clone(this._bottomRight); }};

BoundingBox.prototype.width = function(){ return this._bottomRight.x() - this._topLeft.x(); };
BoundingBox.prototype.height = function(){ return this._bottomRight.y() - this._topLeft.y(); };

BoundingBox.prototype.toString = function(){ return "Top Left: " + this._topLeft.toString() + " Bottom Right: " + this._bottomRight.toString(); };

module.exports = BoundingBox;