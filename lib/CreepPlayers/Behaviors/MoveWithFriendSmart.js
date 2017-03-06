
var MoveUtils = require('../../Utils/MoveUtils');
var Base = require('./Base');
var UnitType = require('../../UnitType');
var GameConstants = require('../../GameConstants');

/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function MoveWithFriendSmart(creepController) {
    this.cc = creepController;
}

MoveWithFriendSmart.prototype = Object.create(Base.prototype);

MoveWithFriendSmart.prototype.act = function() {
    var playerLoc = this.cc.getPlayerInfo().location;
    var ourLoc = this.cc.getCurrentLocation();
    var toPlayer = ourLoc.directionTo(playerLoc);
	var friends = this.cc.senseNearbyUnitsFromTeam(this.cc.getSelfInfo().team);
    var dir;

    //Let's see if there is a creep as close or closer than us, and approach at the same rate that it does.
    //Intended for pack animals.
    for (var i = 0; i < friends.length; i++) {
        var friend = friends[i];
        if (this.distToPlayer(friend.location) <= this.distToPlayer() - 16
            || this.distToPlayer(friend.location) <= 25
            || this.distToPlayer() <= 36
            || friend.hp < friend.maxHp
            || this.cc.getMyInfo().hp < this.cc.getMyInfo().maxHp) {

            dir = this.cc.smartNextDirectionTo(playerLoc);
            if (MoveUtils.tryMoveAheadLeftRight(this.cc, dir)) {
                return true;
            } else if (MoveUtils.tryMoveAheadLeftRightSideways(this.cc, dir)) {
                return true;
            }
        }
    }

    return false;
};

module.exports = MoveWithFriendSmart;
