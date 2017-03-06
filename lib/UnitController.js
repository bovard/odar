var Direction = require('./GameObjects/Direction');
var GameController = require('./GameController');


function UnitController(id) {
    // make this read only
    // the game controller uses the unit ID to figure out which unit to move
    Object.defineProperties(this, {
        "id": {
            value: id,
            writeable: false
        }
    });
    this.gc = GameController;
}

UnitController.prototype = {
    canMove: function(dir) {
        if (!Direction.isValidDirection(dir)) {
            throw Error("Can't move in direction " + dir);
        }
        return this.gc.canMove(this.id, dir);
    },
    move: function(dir) {
        if (!Direction.isValidDirection(dir)) {
            throw Error("Can't move in direction " + dir);
        }
        if (Direction.OMNI.equals(dir)) {
            throw Error("Can't move in direction OMNI (no direction)");
        }
        this.gc.tryMove(this.id, dir);
    },
    canHeal: function() {
        return this.gc.canHeal(this.id);
    },
    heal: function(dir) {
        this.gc.tryHeal(this.id);
    },
    canMeleeAttack: function(loc) {
        if (!loc) {
            throw Error("Must attack valid loc, not " + loc);
        }
        return this.gc.canMeleeAttack(this.id, loc);
    },
    meleeAttack: function(loc) {
        if (!loc) {
            throw Error("Must attack valid loc, not " + loc);
        }
        this.gc.tryMeleeAttack(this.id, loc);
    },
    canMagicAttack: function(loc) {
        if (!loc) {
            throw Error("Must attack valid loc, not " + loc);
        }
        return this.gc.canMagicAttack(this.id, loc);
    },
    magicAttack: function(loc) {
        if (!loc) {
            throw Error("Must attack valid loc, not " + loc);
        }
        this.gc.tryMagicAttack(this.id, loc);
    },
    canRangedAttack: function(loc) {
        if (!loc) {
            throw Error("Must attack valid loc, not " + loc);
        }
        return this.gc.canRangedAttack(this.id, loc);

    },
    rangedAttack: function(loc) {
        if (!loc) {
            throw Error("Must attack valid loc, not " + loc);
        }
        this.gc.tryRangedAttack(this.id, loc);
    },
    senseNearbyUnits: function(options) {
        return this.gc.senseNearbyUnits(this.id, options);
    },
    senseNearbyUnitsFromTeam: function(team) {
        return this.gc.senseNearbyUnits(this.id, {"team": team});
    },
    senseNearbyEnemies: function() {
        return this.gc.senseNearbyUnits(this.id, {enemiesOnly: true});
    },
    senseNearbyTraps: function() {
        return this.gc.senseNearbyTraps(this.id);
    },
    canSense: function(loc) {
        if (!loc) {
            throw Error("Must sense valid loc, not " + loc);
        }
        return this.gc.canSense(this.id, loc);
    },
    senseIfPassable: function(loc) {
        if (!loc) {
            throw Error("Must sense valid loc, not " + loc);
        }
        if (!this.canSense(loc)) {
            throw Error("Can't sense that location! " + loc);
        }
        return this.gc.trySenseIsPassable(this.id, loc);
    },
    senseUnitAtLocation: function(loc) {
        if (!loc) {
            throw Error("Must sense valid loc, not " + loc);
        }
        if (!this.canSense(loc)) {
            throw Error("Can't sense that location! " + loc);
        }
        return this.gc.trySenseUnitAtLoc(this.id, loc);
    },
    getDelay: function() {
        return this.gc.getDelay(this.id);
    },
    getGameRound: function() {
        return this.gc.getRound();
    },
    getGameRoundLimit: function() {
        return this.gc.getRoundLimit();
    },
    getHp: function() {
        return this.gc.getHp(this.id);
    },
    getCurrentLocation: function() {
        return this.gc.getCurrentLocation(this.id);
    },
    getMyInfo: function() {
        return this.gc.getMyInfo(this.id);
    }
};


module.exports = UnitController;
