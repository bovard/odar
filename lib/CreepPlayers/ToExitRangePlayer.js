
var BaseCreepPlayer = require('./BaseCreepPlayer');
var Attack = require('./Behaviors/RangeAttack');
var MoveToExitDumb = require('./Behaviors/MoveToExitDumb');


/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function MoveToExitPlayer(creepController) {
    this.cc = creepController;

    var attack = new Attack(this.cc);
    var move = new MoveToExitDumb(this.cc);

    this.behaviors = [attack, move];
}

MoveToExitPlayer.prototype = Object.create(BaseCreepPlayer.prototype);

module.exports = MoveToExitPlayer;