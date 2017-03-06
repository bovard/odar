
var MoveUtils = require('../../Utils/MoveUtils');
var Base = require('./Base');

/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function MoveCloserDumb(creepController) {
    this.cc = creepController;
}

MoveCloserDumb.prototype = Object.create(Base.prototype);

MoveCloserDumb.prototype.act = function() {
    var toPlayer = this.cc.getDirectionToPlayer();

    return MoveUtils.tryMoveAheadLeftRightSideways(this.cc, toPlayer);
};

module.exports = MoveCloserDumb;
