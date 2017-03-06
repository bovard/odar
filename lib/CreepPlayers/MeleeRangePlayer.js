
var BaseCreepPlayer = require('./BaseCreepPlayer');
var Melee = require('./Behaviors/Melee');
var MoveCloser = require('./Behaviors/MoveCloserDumb');
var Range = require('./Behaviors/RangeAttack');
var Sleep = require('./Behaviors/BackToSleep');


/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function MeleeRangePlayer(creepController) {
    this.cc = creepController;

    var melee = new Melee(this.cc);
    var move = new MoveCloser(this.cc);
    var range = new Range(this.cc);
    var sleep = new Sleep(this.cc);

    this.behaviors = [sleep, melee, range, move];
}

MeleeRangePlayer.prototype = Object.create(BaseCreepPlayer.prototype);

module.exports = MeleeRangePlayer;