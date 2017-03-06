function Point(x, y){
		this._x = x;
		this._y = y;
	};

// Getters / Setters
Point.prototype.x = function(newX){ if(!!newX){ this._x = newX; }else{ return this._x; }};
Point.prototype.y = function(newY){ if(!!newY){ this._y = newY; }else{ return this._y; }};

Point.prototype.toString = function(){ return "<" + this._x + "," + this._y + ">"; };
Point.prototype.add = function(otherPoint){ return new Point(this._x + otherPoint._x, this._y + otherPoint._y); };
Point.prototype.subtract = function(otherPoint){ return new Point(this._x - otherPoint._x, this._y - otherPoint._y); };
Point.prototype.equals = function(otherPoint){ return this._x === otherPoint._x && this._y === otherPoint._y; };
Point.prototype.approxEquals = function(otherPoint){ return Math.abs(this._x - otherPoint._x) < 1 && Math.abs(this._y - otherPoint._y) < 1; };

module.exports = Point;