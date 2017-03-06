
var BaseCreepPlayer = require('./BaseCreepPlayer');
var Spawn = require('./Behaviors/Spawn');
var Melee = require('./Behaviors/Melee');
var Move = require('./Behaviors/MoveCloserSmart');


function BreederMeleePlayer(creepController) {
    this.cc = creepController;

    var spawn = new Spawn(this.cc);
    var melee = new Melee(this.cc);
    var move = new Move(this.cc);

    this.behaviors = [spawn, melee, move];
}

BreederMeleePlayer.prototype = Object.create(BaseCreepPlayer.prototype);

module.exports = BreederMeleePlayer;

