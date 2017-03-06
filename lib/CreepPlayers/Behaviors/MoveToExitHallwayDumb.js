
var MoveUtils = require('../../Utils/MoveUtils');
var Base = require('./Base');
var Direction = require('../../GameObjects/Direction');

/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function MoveToExitDumb(creepController) {
    this.cc = creepController;
}

MoveToExitDumb.prototype = Object.create(Base.prototype);

MoveToExitDumb.prototype.act = function() {
    var toExit = this.cc.senseDirectionToExit();
    var toPlayer = this.cc.getDirectionToPlayer();

    if (this.cc.getMyInfo().hp < this.cc.getMyInfo().maxHp && MoveUtils.tryMoveAheadLeftRight(this.cc, toPlayer)) {
        return true;
    }

    var blocking = false;
    if (!this.cc.canMove(Direction.NORTH) && !this.cc.canMove(Direction.SOUTH) &&
        this.cc.canMove(Direction.WEST) && this.cc.canMove(Direction.EAST)) {
        blocking = true;
    } else if (!this.cc.canMove(Direction.WEST) && !this.cc.canMove(Direction.EAST) &&
        this.cc.canMove(Direction.NORTH) && this.cc.canMove(Direction.SOUTH)) {
        blocking = true;
    }

    //we have a wall on either side, but the direction to the exit is clear.
    //WE should be blocking the hallway now, waiting for whoever to come through.
    if (blocking && this.cc.canMove(toExit)) {
        return false;
    } else {
        return MoveUtils.tryMoveAheadLeftRightSideways(this.cc, toExit);
    }
};

module.exports = MoveToExitDumb;
