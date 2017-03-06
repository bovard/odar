
function BehaviorBase(creepController) {
    this.cc = creepController;
}

//Behaviors can ben chained together in any way. Each behavior should have one or
//more things it wants to do, and if the conditions are right to do them, should perform
//their designed action and return true.
//Otherwise they should return false so that the next behavior can be tried.
BehaviorBase.prototype = {
    act: function() {
        return false;
    },
    distToPlayer: function(loc) {
        if (!loc) {
            loc = this.cc.getCurrentLocation();
        }
        var playerLoc = this.cc.getPlayerInfo().location;
        return loc.distanceSquaredTo(playerLoc);
    }
};

module.exports = BehaviorBase;
