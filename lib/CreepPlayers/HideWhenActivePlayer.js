
var BaseCreepPlayer = require('./BaseCreepPlayer');
var RunWhenActive = require('./Behaviors/RunWhenActiveDumb');
var Melee = require('./Behaviors/Melee');
var MoveCloser = require('./Behaviors/MoveCloserDumb');



/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function HideWhenActivePlayer(creepController) {
    this.cc = creepController;

    var run = new RunWhenActive(this.cc);
    var melee = new Melee(this.cc);
    var moveCloser = new MoveCloser(this.cc);

    this.behaviors = [run, melee, moveCloser];
}

HideWhenActivePlayer.prototype = Object.create(BaseCreepPlayer.prototype);

module.exports = HideWhenActivePlayer;