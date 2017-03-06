
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

    return MoveUtils.tryMoveAheadLeftRightSideways(this.cc, toExit);
};

module.exports = MoveToExitDumb;
