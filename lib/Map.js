var MapLocation = require('./GameObjects/MapLocation');
var TerrainType = require('./GameObjects/TerrainType');
var TileFactory = require('./TileFactory');
var Pathfinder = require('./Utils/Pathfinder');


function Map(height, width, start, exit, roundLimit, defaultTerrainType) {
    this.width = width;
    this.height = height;
    this.start = start;
    this.exit = exit;
    this.roundLimit = roundLimit || 2000;
    this.terrain = [];
    this.units = [];

    var defaultTile = TileFactory.createTile(defaultTerrainType);
    this.cssClass = defaultTile.cssClass;

    // create a very open map with a wall border
    var nulls = [];
    var open = [];
    for (var j = 0; j < this.width; j++) {
        nulls.push(null);
        open.push(defaultTile);
    }
    for (var i = 0; i < this.height; i++) {
        this.terrain.push(open.slice(0));
        this.units.push(nulls.slice(0));
    }

    this.upperLeft = new MapLocation(0, 0);
    this.upperRight = new MapLocation(this.width - 1, 0);
    this.bottomRight = new MapLocation(this.width - 1, this.height - 1);
    this.bottomLeft = new MapLocation(0, this.height - 1);

    // a list of places you can spawn units
    this.spawnList = [];
}

Map.prototype = {
    spawnListContains: function(loc) {
        for (var i = 0; i < this.spawnList.length; i++) {
            if (this.spawnList[i].loc.equals(loc)) {
                return true;
            }
        }
        return false;
    },
    isLegal: function() {
        return Pathfinder.doesPathExist(this, this.start, this.exit);
    },
    cleanUp: function(terrain) {
        this.clearLoc(this.start, terrain);
        this.clearLoc(this.exit, terrain);
    },
    fillWithTiles: function(terrain) {
        this.createTiles(this.upperLeft, this.bottomRight, terrain);
    },
    addToSpawnList: function(unitType, loc) {
        this.spawnList.push({
            "type": unitType,
            "loc": loc
        });
    },
    createTile: function(loc, terrain) {
        if (!this.isOnMap(loc)) {
            console.log("Not on the map!");
        } else {
            var tile = TileFactory.createTile(terrain);
            // Make sure we don't add a non-passable tile where there is already a unit.
            if (!tile.passable && this.getUnitAtLoc(loc) !== null) {
                console.log("Cannot create a non-passable tile where there is a unit!");
            }
            else {
                this.terrain[loc.y][loc.x] = tile;
            }
        }
    },
    clearLoc: function(loc, terrain) {
        if (!this.isOnMap(loc)) {
            console.log("Not on the map!");
        } else {
            this.createTile(loc, terrain);
        }
    },
    clearArea: function(start, end, terrain) {
        if (!this.isOnMap(start) || !this.isOnMap(end)) {
            console.log("Not on the map!");
        } else {
            var upLeft = new MapLocation(Math.min(start.x, end.x), Math.min(start.y, end.y));
            var botRight = new MapLocation(Math.max(start.x, end.x), Math.max(start.y, end.y));
            for (var i = upLeft.y; i<= botRight.y; i++) {
                for (var j = upLeft.x; j<= botRight.x; j++) {
                    this.createTile(new MapLocation(j, i), terrain);
                }
            }
        }
    },
    createTileBorder: function(terrain) {
        this.createTiles(this.upperLeft, this.upperRight, terrain);
        this.createTiles(this.upperRight, this.bottomRight, terrain);
        this.createTiles(this.bottomLeft, this.bottomRight, terrain);
        this.createTiles(this.upperLeft, this.bottomLeft, terrain);
    },
    createTiles: function(start, end, terrain, checkerboard) {
        if (!checkerboard) {
            checkerboard = false;
        }
        if (!this.isOnMap(start) || !this.isOnMap(end)) {
            console.log("Not on the map!");
        } else {
            var upLeft = new MapLocation(Math.min(start.x, end.x), Math.min(start.y, end.y));
            var botRight = new MapLocation(Math.max(start.x, end.x), Math.max(start.y, end.y));
            for (var i = upLeft.y; i <= botRight.y; i++) {
                for (var j = upLeft.x; j<= botRight.x; j++) {
                    if (checkerboard && (j + i) % 2 === 0) {
                        continue;
                    }
                    this.createTile(new MapLocation(j, i), terrain);
                }
            }
        }
    },
    isOnMap: function(loc) {
        if (loc.x < 0) {
            return false;
        }
        if (loc.x >= this.width) {
            return false;
        }
        if (loc.y < 0) {
            return false;
        }
        if (loc.y >= this.height) {
            return false;
        }
        return true;
    },
    isMoveSafe: function(loc) {
        if (!this.isOnMap(loc)) {
            return false;
        }
        return this.isPassable(loc) && this.units[loc.y][loc.x] === null;
    },
    getUnitAtLoc: function(loc) {
        if (!this.isOnMap(loc)) {
            return null;
        }
        return this.units[loc.y][loc.x];
    },
    getTerrainTypeAtLoc: function(loc) {
        if (!this.isOnMap(loc)) {
            return null;
        }
        return this.terrain[loc.y][loc.x].type;
    },
    getExitLoc: function() {
        return this.exit;
    },
    getStartLoc: function() {
        return this.start;
    },
    removeUnitAtLoc: function(loc) {
        if (this.units[loc.y][loc.x] === null) {
            throw Error("Nothing there to remove!");
        }
        if (!this.isOnMap(loc)) {
            throw Error(loc.toString() + " is not on the map!");
        }
        this.units[loc.y][loc.x] = null;
    },
    addUnit: function(unit) {
        var loc = unit.location;
        if (!this.isOnMap(loc)) {
            throw Error(loc.toString() + " is not on the map!");
        }
        if (this.units[loc.y][loc.x] !== null) {
            throw Error("Can't add unit there!");
        }
        this.units[loc.y][loc.x] = unit;
    },
    moveUnit: function(sourceLoc, destLoc) {
        if (!this.isOnMap(destLoc)) {
            throw Error(destLoc.toString() + " is not on the map!");
        }
        if (!this.isOnMap(sourceLoc)) {
            throw Error(sourceLoc.toString() + " is not on the map!");
        }
        if (this.units[destLoc.y][destLoc.x] !== null) {
            throw Error("can't move to that location something is already there!");
        }
        if (!this.terrain[destLoc.y][destLoc.x].passable) {
            throw Error("Can't move to target location, it is not empty!");
        }
        if (this.units[sourceLoc.y][sourceLoc.x] === null) {
            throw Error("There isn't a unit to move at that location!");
        }
        this.units[destLoc.y][destLoc.x] = this.units[sourceLoc.y][sourceLoc.x];
        this.units[sourceLoc.y][sourceLoc.x] = null;
    },
    isPassable: function(loc) {
        if (!this.isOnMap(loc)) {
            return true;
        }
        return this.terrain[loc.y][loc.x].passable;
    }
};

module.exports = Map;
