
var BaseCreepPlayer = require('./BaseCreepPlayer');
var Melee = require('./Behaviors/Melee');
var MoveCloser = require('./Behaviors/MoveWithFriendSmart');


/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function MeleePackPlayer(creepController) {
    this.cc = creepController;

    var melee = new Melee(this.cc);
    var move = new MoveCloser(this.cc);

    this.behaviors = [melee, move];
}

MeleePackPlayer.prototype = Object.create(BaseCreepPlayer.prototype);

module.exports = MeleePackPlayer;