
var BaseCreepPlayer = require('./BaseCreepPlayer');
var Spawn = require('./Behaviors/Spawn');
var Run = require('./Behaviors/RunDumb');
var KiteWithFriend = require('./Behaviors/KiteWithFriendDumb');
var Heal = require('./Behaviors/Heal');


function NecromancerPlayer(creepController) {
    this.cc = creepController;

    var spawn = new Spawn(this.cc);
    var run = new Run(this.cc);
    var heal = new Heal(this.cc);
    var kite = new KiteWithFriend(this.cc);

    this.behaviors = [spawn, heal, kite, run];
}

NecromancerPlayer.prototype = Object.create(BaseCreepPlayer.prototype);

module.exports = NecromancerPlayer;

