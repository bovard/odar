
var BaseCreepPlayer = require('./BaseCreepPlayer');
var Melee = require('./Behaviors/Melee');
var Range = require('./Behaviors/RangeAttack');


/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function MeleeRangePlayer(creepController) {
    this.cc = creepController;

    var melee = new Melee(this.cc);
    var range = new Range(this.cc);

    this.behaviors = [melee, range];
}

MeleeRangePlayer.prototype = Object.create(BaseCreepPlayer.prototype);

module.exports = MeleeRangePlayer;