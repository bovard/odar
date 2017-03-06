
var MoveUtils = require('../../Utils/MoveUtils');
var Base = require('./Base');
var GameConstants = require('../../GameConstants');

/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function StayOutOfReach(creepController) {
    this.cc = creepController;
}

StayOutOfReach.prototype = Object.create(Base.prototype);

StayOutOfReach.prototype.act = function() {
    var toPlayer = this.cc.getDirectionToPlayer();
    var playerLoc = this.cc.getPlayerInfo().location;
    var ourLoc = this.cc.getCurrentLocation();
    var distSqToPlayer = ourLoc.distanceSquaredTo(playerLoc);

    //try to stay just out of range.
    if (distSqToPlayer > GameConstants.MAX_RANGED_ATTACK_RADIUS_SQUARED + 16) {
        // if they are too far away, try moving toward them!
        return MoveUtils.tryMoveAheadLeftRightSideways(this.cc, toPlayer);
    } else if (distSqToPlayer < GameConstants.MAX_RANGED_ATTACK_RADIUS_SQUARED) {
        // if they are too close, try moving away from them!
        return MoveUtils.tryMoveAheadLeftRightSideways(this.cc, toPlayer.opposite());
    }

    return false;
};

module.exports = StayOutOfReach;
