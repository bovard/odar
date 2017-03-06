
var MoveUtils = require('../../Utils/MoveUtils');
var Base = require('./Base');

/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function Melee(creepController) {
    this.cc = creepController;
}

Melee.prototype = Object.create(Base.prototype);

Melee.prototype.act = function() {
    var playerLoc = this.cc.getPlayerInfo().location;
    var ourLoc = this.cc.getCurrentLocation();

    if (playerLoc.isAdjacentTo(ourLoc)) {
        // if we are adjacent to the player, attack them!
        this.cc.meleeAttack(playerLoc);
        return true;
    } else {
        return false;
    }
};

module.exports = Melee;
