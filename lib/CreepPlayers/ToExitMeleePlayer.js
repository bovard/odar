
var BaseCreepPlayer = require('./BaseCreepPlayer');
var Melee = require('./Behaviors/Melee');
var MoveToExitDumb = require('./Behaviors/MoveToExitDumb');


/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function MoveToExitPlayer(creepController) {
    this.cc = creepController;

    var melee = new Melee(this.cc);
    var move = new MoveToExitDumb(this.cc);

    this.behaviors = [melee, move];
}

MoveToExitPlayer.prototype = Object.create(BaseCreepPlayer.prototype);

module.exports = MoveToExitPlayer;