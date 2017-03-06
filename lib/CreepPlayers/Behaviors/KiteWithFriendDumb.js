
var MoveUtils = require('../../Utils/MoveUtils');
var Base = require('./Base');
var UnitType = require('../../UnitType');
var GameConstants = require('../../GameConstants');

/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function KiteWithFriendDumb(creepController) {
    this.cc = creepController;
}

KiteWithFriendDumb.prototype = Object.create(Base.prototype);

KiteWithFriendDumb.prototype.act = function() {
    var playerLoc = this.cc.getPlayerInfo().location;
    var ourLoc = this.cc.getCurrentLocation();
    var toPlayer = ourLoc.directionTo(playerLoc);
    var distSqToPlayer = ourLoc.distanceSquaredTo(playerLoc);

    var friendNearby = this.cc.senseNearbyUnitsFromTeam(this.cc.getSelfInfo().team).length > 0;

    if (friendNearby) {
        if (this.cc.getSelfInfo().rangedAttackPower > 0) {
            if (this.cc.canRangedAttack(playerLoc)) {
                this.cc.rangedAttack(playerLoc);
                return true;
            }
            if (distSqToPlayer < GameConstants.MIN_RANGED_ATTACK_RADIUS_SQUARED) {
                return MoveUtils.tryMoveAheadLeftRightSideways(this.cc, toPlayer.opposite());
            } else {
                return MoveUtils.tryMoveAheadLeftRightSideways(this.cc, toPlayer);
            }
        }
        if (this.cc.getSelfInfo().meleeAttackPower > 0) {
            if (this.cc.canMeleeAttack(playerLoc)) {
                this.cc.meleeAttack(playerLoc);
                return true;
            }
            return MoveUtils.tryMoveAheadLeftRightSideways(this.cc, toPlayer);
        }

    }
};

module.exports = KiteWithFriendDumb;
