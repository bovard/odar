

function Direction(x, y) {
    if (x !== -1 && x !== 0 && x !== 1) {
        throw Error("Direction can only be invoked with values [-1, 0, 1] received " + x + ", " + y);
    }
    if (y !== -1 && y !== 0 && y !== 1) {
        throw Error("Direction can only be invoked with values [-1, 0, 1] received " + x + ", " + y);
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

Direction.randomDirection = function() {
    switch(Math.floor(Math.random() * 8)) {
        case 0:
            return Direction.NORTH;
        case 1:
            return Direction.NORTH_EAST;
        case 2:
            return Direction.EAST;
        case 3:
            return Direction.SOUTH_EAST;
        case 4:
            return Direction.SOUTH;
        case 5:
            return Direction.SOUTH_WEST;
        case 6:
            return Direction.WEST;
        case 7:
            return Direction.NORTH_WEST;
    }
    return Direction.NORTH;
};



Direction.isValidDirection = function(dir) {
    if (!dir) {
        return false;
    }
    return !(
        [
            Direction.NORTH, Direction.NORTH_EAST, Direction.NORTH_WEST,
            Direction.SOUTH, Direction.SOUTH_EAST, Direction.SOUTH_WEST,
            Direction.EAST, Direction.WEST, Direction.OMNI
        ].every(function (x) { return !x.equals(dir);})
    );
};

Direction.prototype = {
    equals: function(dir) {
        return this.x === dir.x && this.y === dir.y;
    },
    rotateLeft: function() {
        if (this.equals(Direction.NORTH)) {
            return Direction.NORTH_WEST;
        } else if (this.equals(Direction.NORTH_WEST)) {
            return Direction.WEST;
        } else if (this.equals(Direction.WEST)) {
            return Direction.SOUTH_WEST;
        } else if (this.equals(Direction.SOUTH_WEST)) {
            return Direction.SOUTH;
        } else if (this.equals(Direction.SOUTH)) {
            return Direction.SOUTH_EAST;
        } else if (this.equals(Direction.SOUTH_EAST)) {
            return Direction.EAST;
        } else if (this.equals(Direction.EAST)) {
            return Direction.NORTH_EAST;
        } else if (this.equals(Direction.NORTH_EAST)) {
            return Direction.NORTH;
        } else if (this.equals(Direction.OMNI)) {
            return Direction.OMNI;
        } else {
            throw Error("Tried to rotate a not valid direction " + this.x + ", " + this.y);
        }
    },
    rotateRight: function() {
        if (this.equals(Direction.NORTH)) {
            return Direction.NORTH_EAST;
        } else if (this.equals(Direction.NORTH_WEST)) {
            return Direction.NORTH;
        } else if (this.equals(Direction.WEST)) {
            return Direction.NORTH_WEST;
        } else if (this.equals(Direction.SOUTH_WEST)) {
            return Direction.WEST;
        } else if (this.equals(Direction.SOUTH)) {
            return Direction.SOUTH_WEST;
        } else if (this.equals(Direction.SOUTH_EAST)) {
            return Direction.SOUTH;
        } else if (this.equals(Direction.EAST)) {
            return Direction.SOUTH_EAST;
        } else if (this.equals(Direction.NORTH_EAST)) {
            return Direction.EAST;
        } else if (this.equals(Direction.OMNI)) {
            return Direction.OMNI;
        } else {
            throw Error("Tried to rotate a not valid direction " + this.x + ", " + this.y);
        }
    },
    opposite: function() {
        if (this.equals(Direction.NORTH)) {
            return Direction.SOUTH;
        } else if (this.equals(Direction.NORTH_WEST)) {
            return Direction.SOUTH_EAST;
        } else if (this.equals(Direction.WEST)) {
            return Direction.EAST;
        } else if (this.equals(Direction.SOUTH_WEST)) {
            return Direction.NORTH_EAST;
        } else if (this.equals(Direction.SOUTH)) {
            return Direction.NORTH;
        } else if (this.equals(Direction.SOUTH_EAST)) {
            return Direction.NORTH_WEST;
        } else if (this.equals(Direction.EAST)) {
            return Direction.WEST;
        } else if (this.equals(Direction.NORTH_EAST)) {
            return Direction.SOUTH_WEST;
        } else if (this.equals(Direction.OMNI)) {
            return Direction.OMNI;
        } else {
            throw Error("Tried to rotate a not valid direction " + this.x + ", " + this.y);
        }
    },
    isDiagonal: function() {
        if (this.equals(Direction.NORTH_WEST)) {
            return true;
        } else if (this.equals(Direction.SOUTH_WEST)) {
            return true;
        } else if (this.equals(Direction.SOUTH_EAST)) {
            return true;
        } else if (this.equals(Direction.NORTH_EAST)) {
            return true;
        }
        return false;
    },
    toString: function() {
        if (this.equals(Direction.NORTH)) {
            return "NORTH";
        } else if (this.equals(Direction.NORTH_WEST)) {
            return "NORTH_WEST";
        } else if (this.equals(Direction.WEST)) {
            return "WEST";
        } else if (this.equals(Direction.SOUTH_WEST)) {
            return "SOUTH_WEST";
        } else if (this.equals(Direction.SOUTH)) {
            return "SOUTH";
        } else if (this.equals(Direction.SOUTH_EAST)) {
            return "SOUTH_EAST";
        } else if (this.equals(Direction.EAST)) {
            return "EAST";
        } else if (this.equals(Direction.NORTH_EAST)) {
            return "NORTH_EAST";
        } else if (this.equals(Direction.OMNI)) {
            return "OMNI";
        }
    }
};



// make all direction read-only (imagine the chaos of someone overwrote these!
Object.defineProperties(Direction, {
    "NORTH": {
        value: new Direction(0, -1),
        writeable: false
    },
    "NORTH_EAST": {
        value: new Direction(1, -1),
        writeable: false
    },
    "NORTH_WEST": {
        value: new Direction(-1, -1),
        writeable: false
    },
    "SOUTH": {
        value: new Direction(0, 1),
        writeable: false
    },
    "SOUTH_EAST": {
        value: new Direction(1, 1),
        writeable: false
    },
    "SOUTH_WEST": {
        value: new Direction(-1, 1),
        writeable: false
    },
    "EAST": {
        value: new Direction(1, 0),
        writeable: false
    },
    "WEST": {
        value: new Direction(-1, 0),
        writeable: false
    },
    "OMNI": {
        value: new Direction(0, 0),
        writeable: false
    }
});


module.exports = Direction;