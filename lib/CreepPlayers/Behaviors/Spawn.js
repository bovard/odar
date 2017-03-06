
var MoveUtils = require('../../Utils/MoveUtils');
var Base = require('./Base');

/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function Spawn(creepController) {
    this.cc = creepController;
}

Spawn.prototype = Object.create(Base.prototype);

Spawn.prototype.act = function() {
    var playerLoc = this.cc.getPlayerInfo().location;
    var ourLoc = this.cc.getCurrentLocation();
    var toPlayer = ourLoc.directionTo(playerLoc);
    var distSqToPlayer = ourLoc.distanceSquaredTo(playerLoc);
    var unitType = this.cc.getSpawnUnitType();

    if (this.cc.getSpawnDelay() < 1) {
        if (this.cc.canSpawn(unitType, toPlayer)) {
            this.cc.spawnUnit(unitType, toPlayer);
            return true;
        } else if (this.cc.canSpawn(unitType, toPlayer.rotateLeft())) {
            this.cc.spawnUnit(unitType, toPlayer.rotateLeft());
            return true;
        } else if (this.cc.canSpawn(unitType, toPlayer.rotateRight())) {
            this.cc.spawnUnit(unitType, toPlayer.rotateRight());
            return true;
        }
    }

    return false;
};

module.exports = Spawn;
