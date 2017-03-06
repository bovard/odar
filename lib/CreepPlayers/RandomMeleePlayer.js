
var BaseCreepPlayer = require('./BaseCreepPlayer');
var Melee = require('./Behaviors/Melee');
var MoveRandom = require('./Behaviors/MoveRandom');


/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function RandomMeleePlayer(creepController) {
    this.cc = creepController;

    var melee = new Melee(this.cc);
    var move = new MoveRandom(this.cc);

    this.behaviors = [melee, move];
}

RandomMeleePlayer.prototype = Object.create(BaseCreepPlayer.prototype);

module.exports = RandomMeleePlayer;