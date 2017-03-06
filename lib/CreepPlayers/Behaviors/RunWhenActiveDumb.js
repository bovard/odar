
var MoveUtils = require('../../Utils/MoveUtils');
var Base = require('./Base');
var GameConstants = require('../../GameConstants');

/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function RunWhenActiveDumb(creepController) {
    this.cc = creepController;
}

RunWhenActiveDumb.prototype = Object.create(Base.prototype);

RunWhenActiveDumb.prototype.act = function() {
    var playerDelay = this.cc.getPlayerInfo().delay;
    var toPlayer = this.cc.getDirectionToPlayer();

    var playerLoc = this.cc.getPlayerInfo().location;
    var ourLoc = this.cc.getCurrentLocation();
    var distSqToPlayer = ourLoc.distanceSquaredTo(playerLoc);

    //try to stay just out of range.
    if (playerDelay < 8) {
        if (distSqToPlayer > GameConstants.MAX_RANGED_ATTACK_RADIUS_SQUARED + 16) {
            // if they are too far away, try moving toward them!
            return MoveUtils.tryMoveAheadLeftRightSideways(this.cc, toPlayer);
        } else if (distSqToPlayer < GameConstants.MAX_RANGED_ATTACK_RADIUS_SQUARED) {
            // if they are too close, try moving away from them!
            return MoveUtils.tryMoveAheadLeftRightSideways(this.cc, toPlayer.opposite());
        }

        //don't go on to the next action, we want to stay away if the player is active.
        return true;
    }

    return false;
};

module.exports = RunWhenActiveDumb;
