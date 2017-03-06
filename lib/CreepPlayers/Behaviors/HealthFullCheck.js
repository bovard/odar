
var MoveUtils = require('../../Utils/MoveUtils');
var Base = require('./Base');

/**
 *
 * @param creepController @type CreepController
 * @constructor
 */
function HealthFullCheck(creepController) {
    this.cc = creepController;
}

HealthFullCheck.prototype = Object.create(Base.prototype);

HealthFullCheck.prototype.act = function() {
    var health = this.cc.getSelfInfo().hp;
    var maxHealth = this.cc.getSelfInfo().maxHp;
    
    //If health is full, we're done, we are going to continue doing whatever we're doing.
    if (maxHealth == health) {
        return true;
    }
    //we've been hit, it's time to do some other action.
    else if (health < maxHealth) {
        return false;
    }
};

module.exports = HealthFullCheck;
