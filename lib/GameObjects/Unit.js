var UnitInfo = require('./UnitInfo');

// people generally shouldn't have access to the unit class
function Unit(stats) {
    this.name = stats.name;
    this.type = stats.type;
    this.description = stats.description;
    this.hint = stats.hint;
    this.team = stats.team;
    this.maxHp = stats.maxHp;
    this.hp = this.maxHp;
    this.canBeHealed = stats.canBeHealed || false;
    this.defeatPoints = stats.defeatPoints || 0;
    this.delay = 0;
    this.location = stats.location;
    this.movementDelay = stats.movementDelay;
    this.healPower = stats.healPower || 0;
    this.healDelay = stats.healDelay || 0;
    this.meleeAttackPower = stats.meleeAttackPower || 0;
    this.meleeAttackDelay = stats.meleeAttackDelay || 0;
    this.magicAttackPower = stats.magicAttackPower || 0;
    this.magicAttackDelay = stats.magicAttackDelay || 0;
    this.rangedAttackPower = stats.rangedAttackPower || 0;
    this.rangedAttackDelay = stats.rangedAttackDelay || 0;
    this.sensorRadiusSquared = stats.sensorRadiusSquared;
    this.alertRadiusSquared = stats.alertRadiusSquared || 0;
    this.spawnDelay = stats.spawnDelay || 0;
    this.currentSpawnDelay = this.spawnDelay;
    this.spawnedUnitType = stats.spawnedUnitType || null;
    this.lazy = stats.lazy || false;
    this.active = false;

    this.action = null;
    this.source = null;
    this.target = null;

    //let's calculate some defeat points!
    var dp = this.maxHp / Math.min(100, this.movementDelay);
    if (this.healPower) {
        dp = dp * this.healPower;
    }
    if (this.meleeAttackPower > 0) {
        dp = dp * this.meleeAttackPower;
    }
    if (this.magicAttackPower > 0) {
        dp = dp * this.magicAttackPower;
    }
    if (this.rangedAttackPower > 0) {
        dp = dp * this.rangedAttackPower;
    }
    if (this.spawnedUnitType) {
        dp = dp * 10;
    }

    if (this.meleeAttackDelay > 0) {
        dp = dp / this.meleeAttackDelay;
    }
    if (this.magicAttackDelay > 0) {
        dp = dp / this.magicAttackDelay;
    }
    if (this.rangedAttackDelay > 0) {
        dp = dp / this.rangedAttackDelay;
    }
    if (this.spawnDelay > 0) {
        dp = dp / this.spawnDelay;
    }

    this.defeatPoints = dp;
}


Unit.prototype = {
    decrementCooldowns: function() {
        this.delay = Math.max(0, this.delay - 1);
        this.currentSpawnDelay = Math.max(0, this.currentSpawnDelay - 1);
        this.action = null;
        this.source = null;
        this.target = null;

        // add regen in here for certain unit types
    },
    setPlayer: function(player) {
        this.player = player;
    },
    canActThrow: function() {
        if (this.hp <= 0) {
            throw Error("Unit with hp <= 0 cannot act");
        }
        if (this.delay >= 1) {
            throw Error("Unit with delay >= 1 cannot act");
        }
    },
    canAct: function() {
        if (this.hp < 0) {
            return false;
        }
        if (this.delay >= 1) {
            return false;
        }
        return true;
    },
    getUnitInfo: function() {
        return new UnitInfo(this);
    },
    getAction: function() {
        return {
            "action": this.action,
            "source": this.source,
            "target": this.target
        };
    },
    activate: function() {
        if (!this.active) {
            this.active = true;
            console.log(this.name + " woke up! \n" + this.hint);
        }
    },
    deactivate: function() {
        if (this.active === true) {
            this.active = false;
            console.log(this.name + " doesn't care about you anymore.");
        }
    }
};

module.exports = Unit;