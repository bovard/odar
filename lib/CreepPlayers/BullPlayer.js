
var BaseCreepPlayer = require('./BaseCreepPlayer');
var Melee = require('./Behaviors/Melee');
var MoveCloser = require('./Behaviors/MoveCloserSmart');
var HealthFullCheck = require('./Behaviors/HealthFullCheck');


/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function BullPlayer(creepController) {
    this.cc = creepController;

    var melee = new Melee(this.cc);
    var move = new MoveCloser(this.cc);
    var health = new HealthFullCheck(this.cc);

    //if the health is full, we're not going to do anything else, otherwise we're going to destroy the player.
    this.behaviors = [health, melee, move];
}

BullPlayer.prototype = Object.create(BaseCreepPlayer.prototype);

module.exports = BullPlayer;