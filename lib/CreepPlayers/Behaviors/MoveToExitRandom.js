
var MoveUtils = require('../../Utils/MoveUtils');
var Base = require('./Base');
var Direction = require('../../GameObjects/Direction');

/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function MoveToExitRandom(creepController) {
    this.cc = creepController;
}

MoveToExitRandom.prototype = Object.create(Base.prototype);

MoveToExitRandom.prototype.act = function() {
    var toExit = this.cc.senseDirectionToExit();
    var toPlayer = this.cc.getDirectionToPlayer();

    var r = Math.floor((Math.random() * 4));

    if (this.cc.getMyInfo().hp < this.cc.getMyInfo().maxHp && MoveUtils.tryMoveAheadLeftRight(this.cc, toPlayer)) {
        return true;
    }

    //give slightly more weight on moving towards the player.
    if (r === 0) {
        return MoveUtils.tryMoveAheadLeftRightSideways(this.cc, toExit);
    } else {
        //we didn't randomly see the player and try to go for him, so let's move in a random direction.
        var didMove = false;
        var idx = 0;

        while (!didMove && idx < 15) {
            var d = Direction.randomDirection();
            if (this.cc.canMove(d)) {
                this.cc.move(d);
                didMove = true;
                return true;
            }
            idx++;
        }

    }
    
};

module.exports = MoveToExitRandom;
