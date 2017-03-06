
var BaseCreepPlayer = require('./BaseCreepPlayer');
var Run = require('./Behaviors/StayOutOfReach');
var Melee = require('./Behaviors/Melee');




/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function HideAlwaysPlayer(creepController) {
    this.cc = creepController;

    var run = new Run(this.cc);
    var melee = new Melee(this.cc);

    this.behaviors = [melee, run];
}

HideAlwaysPlayer.prototype = Object.create(BaseCreepPlayer.prototype);

module.exports = HideAlwaysPlayer;