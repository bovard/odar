
var MoveUtils = require('../../Utils/MoveUtils');
var Base = require('./Base');

/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function RunDumb(creepController) {
    this.cc = creepController;
}

RunDumb.prototype = Object.create(Base.prototype);

RunDumb.prototype.act = function() {
    var toPlayer = this.cc.getDirectionToPlayer();

	if (MoveUtils.tryMoveAheadLeftRight(this.cc, toPlayer.opposite())) {
		return true;
	}
	else {
		return MoveUtils.tryMoveAheadLeftRightSideways(this.cc, toPlayer.opposite());
	}
};

module.exports = RunDumb;
