
var BaseCreepPlayer = require('./BaseCreepPlayer');
var RangeAttack = require('./Behaviors/RangeAttack');
var Melee = require('./Behaviors/Melee');
var Sleep = require('./Behaviors/BackToSleep');
var Kite = require('./Behaviors/KiteDumb');

function GenericRangedPlayer(creepController) {
    this.cc = creepController;

    var kite = new Kite(this.cc);
    var attack = new RangeAttack(this.cc);
    var melee = new Melee(this.cc);
    var sleep = new Sleep(this.cc);

    this.behaviors = [sleep, kite, attack, melee];
}

GenericRangedPlayer.prototype = Object.create(BaseCreepPlayer.prototype);

module.exports = GenericRangedPlayer;

