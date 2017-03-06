
var BaseCreepPlayer = require('./BaseCreepPlayer');
var Magic = require('./Behaviors/Magic');
var Attack = require('./Behaviors/Melee');
var MoveCloser = require('./Behaviors/MoveCloserDumb');


/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function MagicMeleePlayer(creepController) {
    this.cc = creepController;

    var melee = new Attack(this.cc);
    var magic = new Magic(this.cc);
    var move = new MoveCloser(this.cc);

    this.behaviors = [magic, melee, move];
}

MagicMeleePlayer.prototype = Object.create(BaseCreepPlayer.prototype);

module.exports = MagicMeleePlayer;