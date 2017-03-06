
var GameConstants = require('../../GameConstants');
var MoveUtils = require('../../Utils/MoveUtils');
var Base = require('./Base');

/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function KiteDumb(creepController) {
    this.cc = creepController;
}

KiteDumb.prototype = Object.create(Base.prototype);

KiteDumb.prototype.act = function() {
    var playerLoc = this.cc.getPlayerInfo().location;
    var ourLoc = this.cc.getCurrentLocation();
    var toPlayer = ourLoc.directionTo(playerLoc);
    var distSqToPlayer = ourLoc.distanceSquaredTo(playerLoc);

    if (distSqToPlayer > GameConstants.MAX_RANGED_ATTACK_RADIUS_SQUARED) {
        // if they are too far away, try moving toward them!
        return MoveUtils.tryMoveAheadLeftRightSideways(this.cc, toPlayer);
    } else if (distSqToPlayer < GameConstants.MIN_RANGED_ATTACK_RADIUS_SQUARED) {
        // if they are too close, try moving away from them!
        return MoveUtils.tryMoveAheadLeftRightSideways(this.cc, toPlayer.opposite());
    } else {
        return false;
    }
};

module.exports = KiteDumb;
