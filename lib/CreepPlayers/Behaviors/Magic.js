
var MoveUtils = require('../../Utils/MoveUtils');
var Base = require('./Base');

/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function Magic(creepController) {
    this.cc = creepController;
}

Magic.prototype = Object.create(Base.prototype);

Magic.prototype.act = function() {
    var playerLoc = this.cc.getPlayerInfo().location;

    if (this.cc.canMagicAttack(playerLoc)) {
        // if we are adjacent to the player, attack them!
        this.cc.magicAttack(playerLoc);
        return true;
    } else {
        return false;
    }
};

module.exports = Magic;
