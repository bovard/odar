
var BaseCreepPlayer = require('./BaseCreepPlayer');
var Melee = require('./Behaviors/Melee');
var Move = require('./Behaviors/MoveToExitHallwayDumb');
var Range = require('./Behaviors/RangeAttack');


/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function Player(creepController) {
    this.cc = creepController;

    var melee = new Melee(this.cc);
    var move = new Move(this.cc);
    var range = new Range(this.cc);

    this.behaviors = [melee, range, move];
}

Player.prototype = Object.create(BaseCreepPlayer.prototype);

module.exports = Player;