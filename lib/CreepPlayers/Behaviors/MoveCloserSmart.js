
var MoveUtils = require('../../Utils/MoveUtils');
var Base = require('./Base');

/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function MoveCloserSmart(creepController) {
    this.cc = creepController;
}

MoveCloserSmart.prototype = Object.create(Base.prototype);

MoveCloserSmart.prototype.act = function() {
	var playerLoc = this.cc.getPlayerInfo().location;
    var toPlayer = this.cc.smartNextDirectionTo(playerLoc);
    return MoveUtils.tryMoveAheadLeftRightSideways(this.cc, toPlayer);
};

module.exports = MoveCloserSmart;
