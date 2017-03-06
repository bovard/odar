
var BaseCreepPlayer = require('./BaseCreepPlayer');
var Melee = require('./Behaviors/Melee');
var MoveCloser = require('./Behaviors/MoveCloserDumb');
var Sleep = require('./Behaviors/BackToSleep');


/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function GenericMeleePlayer(creepController) {
    this.cc = creepController;

    var melee = new Melee(this.cc);
    var move = new MoveCloser(this.cc);
    var sleep = new Sleep(this.cc);

    this.behaviors = [sleep, melee, move];
}

GenericMeleePlayer.prototype = Object.create(BaseCreepPlayer.prototype);

module.exports = GenericMeleePlayer;