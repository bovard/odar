
var BaseCreepPlayer = require('./BaseCreepPlayer');
var Attack = require('./Behaviors/Magic');
var MoveCloser = require('./Behaviors/MoveCloserDumb');
var Sleep = require('./Behaviors/BackToSleep');


/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function MagicOnlyPlayer(creepController) {
    this.cc = creepController;

    var magic = new Attack(this.cc);
    var move = new MoveCloser(this.cc);
    var sleep = new Sleep(this.cc);

    this.behaviors = [sleep, magic, move];
}

MagicOnlyPlayer.prototype = Object.create(BaseCreepPlayer.prototype);

module.exports = MagicOnlyPlayer;