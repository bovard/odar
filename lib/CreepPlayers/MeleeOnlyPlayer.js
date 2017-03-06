
var BaseCreepPlayer = require('./BaseCreepPlayer');
var Melee = require('./Behaviors/Melee');


/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function MeleeOnlyPlayer(creepController) {
    this.cc = creepController;

    var melee = new Melee(this.cc);

    this.behaviors = [melee];
}

MeleeOnlyPlayer.prototype = Object.create(BaseCreepPlayer.prototype);

module.exports = MeleeOnlyPlayer;