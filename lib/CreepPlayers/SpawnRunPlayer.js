
var BaseCreepPlayer = require('./BaseCreepPlayer');
var Spawn = require('./Behaviors/Spawn');
var Run = require('./Behaviors/RunDumb');


function NecromancerPlayer(creepController) {
    this.cc = creepController;

    var spawn = new Spawn(this.cc);
    var run = new Run(this.cc);

    this.behaviors = [spawn, run];
}

NecromancerPlayer.prototype = Object.create(BaseCreepPlayer.prototype);

module.exports = NecromancerPlayer;

