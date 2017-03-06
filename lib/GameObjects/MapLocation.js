var Direction = require('./Direction');

function MapLocation(x, y) {
    if (parseInt(x) !== x || parseInt(y) !== y) {
        throw Error("MapLocation must be made with integers, not " + x + ", " + y);
    }
    // make these read-only
    Object.defineProperties(this, {
        "x": {
            value: x,
            writeable: false
        },
        "y": {
            value: y,
            writeable: false
        }
    });
}

MapLocation.prototype = {
    equals: function(loc) {
        if (!loc) {
            return false;
        }
        return this.x === loc.x && this.y === loc.y;
    },
    directionTo: function(loc) {
        if (!loc) {
            throw Error("Error, cannot find directionTo " + loc);
        }
        var xDiff = loc.x - this.x;
        var yDiff = loc.y - this.y;
        var dir;
        if (xDiff === 0 && yDiff === 0) {
            dir = Direction.OMNI;
        } else if (Math.abs(xDiff) > 2 * Math.abs(yDiff)) {
            if (xDiff < 0) {
                dir = Direction.WEST;
            } else {
                dir = Direction.EAST;
            }
        } else if (Math.abs(yDiff) > 2 * Math.abs(xDiff)) {
            if (yDiff < 0) {
                dir = Direction.NORTH;
            } else {
                dir = Direction.SOUTH;
            }
        } else if (yDiff < 0) {
            if (xDiff < 0) {
                dir = Direction.NORTH_WEST;
            } else {
                dir = Direction.NORTH_EAST;
            }
        } else if (yDiff > 0) {
            if (xDiff < 0) {
                dir = Direction.SOUTH_WEST;
            } else {
                dir = Direction.SOUTH_EAST;
            }
        } else {
            throw Error("Error finding directionTo " + loc.x + ", " + loc.y + " from " + this.x + ", " + this.y);
        }
        return dir;
    },
    add: function(dir, n) {
        if (!Direction.isValidDirection(dir)) {
            throw Error("Error, cannot add direction " + dir);
        }
        if (!n || n < 1) {
            n = 1;
        }
        var destX = this.x;
        var destY = this.y;
        for (var i = 0; i < n; i++) {
            destX += dir.x;
            destY += dir.y;
        }
        return new MapLocation(destX, destY);
    },
    distanceSquaredTo: function(loc) {
        if (!loc) {
            throw Error("Error, cannot find distancedSquaredTo " + loc);
        }
        return Math.pow(this.x - loc.x, 2) + Math.pow(this.y - loc.y, 2);
    },
    isAdjacentTo: function(loc) {
        if (!loc) {
            throw Error("Error, non-valid location " + loc);
        }
        return Math.abs(this.x - loc.x) <= 1 && Math.abs(this.y - loc.y) <= 1;
    },
    toString: function() {
        return "(x:" + this.x + ", y:" + this.y + ")";
    }
};

module.exports = MapLocation;