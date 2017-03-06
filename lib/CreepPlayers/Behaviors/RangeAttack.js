
var MoveUtils = require('../../Utils/MoveUtils');
var Base = require('./Base');

/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function RangeAttack(creepController) {
    this.cc = creepController;
}

RangeAttack.prototype = Object.create(Base.prototype);

RangeAttack.prototype.act = function() {
    var playerLoc = this.cc.getPlayerInfo().location;
    var ourLoc = this.cc.getCurrentLocation();
    var distSqToPlayer = ourLoc.distanceSquaredTo(playerLoc);

    if (this.cc.canRangedAttack(playerLoc)) {
        this.cc.rangedAttack(playerLoc);
        return true;
    }
    return false;
};

module.exports = RangeAttack;
