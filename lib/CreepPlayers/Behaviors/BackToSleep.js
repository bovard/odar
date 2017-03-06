
var MoveUtils = require('../../Utils/MoveUtils');
var Base = require('./Base');

/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function BackToSleep(creepController) {
    this.cc = creepController;
}

BackToSleep.prototype = Object.create(Base.prototype);

BackToSleep.prototype.act = function() {
    var playerLoc = this.cc.getPlayerInfo().location;
    var ourLoc = this.cc.getCurrentLocation();
    var distSqToPlayer = ourLoc.distanceSquaredTo(playerLoc);

    if (distSqToPlayer > 144) {
        this.cc.setInactive();
        return true;
    }
    return false;
};

module.exports = BackToSleep;
