var Actions = require('./Actions');
var Map = require('./Map');
var UnitManager = require('./UnitManager');
var GameController = require('./GameController');
var GameContants = require('./GameConstants');
var MapLocation = require('./GameObjects/MapLocation');
var Direction = require('./GameObjects/Direction');
var Unit = require('./GameObjects/Unit');
var UnitType = require('./UnitType');
var UnitFactory = require('./UnitFactory');
var PlayerFactory = require('./PlayerFactory');
var Team = require('./Team');
var CreepController = require('./CreepController');
var PlayerController = require('./PlayerController');
var TutorialMapFactory = require('./MapCreator/TutorialMapFactory');
var AdventureMapFactory = require('./MapCreator/AdventureMapFactory');

function Game(playerCreator, level, tutorial) {
    if (tutorial) {
        this.map = TutorialMapFactory.createTutorialMap(level);
    } else {
        this.map = AdventureMapFactory.createAdventureMap(level);
    }
    this.unitManager = new UnitManager();

    this.id = new Date().getTime() % 10000;


    GameController.setMap(this.map);
    GameController.setUnitManager(this.unitManager);

    // add in the player
    var playerStats = {
        "type": UnitType.PLAYER,
        "name": "you!",
        "description": "A questing adventurer",
        "team": Team.A,
        "maxHp": 100,
        "canBeHealed": true,
        "location": location,
        "movementDelay": GameContants.PLAYER_MOVE_DELAY,
        "healPower": GameContants.PLAYER_HEAL_POWER,
        "healDelay": GameContants.PLAYER_HEAL_DELAY,
        "meleeAttackPower": GameContants.PLAYER_MELEE_POWER,
        "meleeAttackDelay": GameContants.PLAYER_MELEE_DELAY,
        "magicAttackPower": GameContants.PLAYER_MAGIC_POWER,
        "magicAttackDelay": GameContants.PLAYER_MAGIC_DELAY,
        "rangedAttackPower": GameContants.PLAYER_RANGED_POWER,
        "rangedAttackDelay": GameContants.PLAYER_RANGED_DELAY,
        "sensorRadiusSquared": 64,
        "alertRadiusSquared": 0,
        "spawnDelay": 0,
        "spawnedUnitType": null
    };
    this.player = new Unit(playerStats);
    this.player.location = this.map.start;
    this.player.active = true;
    this.unitManager.addPlayer(this.player);
    this.map.addUnit(this.player);

    this.player.player = playerCreator(new PlayerController(this.player.id));

    // add the creeps
    for (var i = 0; i < this.map.spawnList.length; i++) {
        this.addNewUnitAtLoc(this.map.spawnList[i].type, this.map.spawnList[i].loc);
    }

    this.round = 0;
    GameController.setRound(0);

}

Game.prototype = {
    removeDeadUnits: function() {
        var i;
        // remove dead units
        var toRemove = this.unitManager.units.filter(function(unit) { return unit.hp <= 0; });

        for (i = 0; i < toRemove.length; i++) {
            var unit = toRemove[i];
            GameController.alertAllies(unit.id);
            this.unitManager.removeUnit(unit.id);
            this.map.removeUnitAtLoc(unit.location);
        }

        // Send this value back for GameRunner scoring
        return toRemove;
    },
    upkeep: function() {
        var i;
        this.round++;
        GameController.setRound(this.round);
        this.removeDeadUnits();

        // decrement cooldowns
        this.unitManager.getPlayer().decrementCooldowns();
        this.unitManager.units.forEach(function(unit) {unit.decrementCooldowns();});
    },
    executePlayerTurn: function() {
        var player = this.unitManager.getPlayer();
        if (player.delay < 1) {
            player.player.act();
        }
    },
    getPlayerAction: function() {
        return this.unitManager.getPlayer().getAction();
    },
    executeCreepTurns: function() {
        var unit, i;
        // see if we should wake anyone up
        for (i = 0; i < this.unitManager.units.length; i++) {
            unit = this.unitManager.units[i];
            if (unit.location.distanceSquaredTo(this.player.location) <= unit.sensorRadiusSquared) {
                unit.active = true;
            }
        }

        var action;
        for (i = 0; i < this.unitManager.units.length; i++) {
            unit = this.unitManager.units[i];
            if (unit.delay < 1 && unit.hp > 0 && unit.active) {
                unit.player.alertAllies();
                unit.player.act();
                action = unit.getAction();
                if (action.action ===  Actions.SPAWN) {
                    this.addNewUnitAtLoc(unit.spawnedUnitType, action.target);
                }
            }
        }

    },
    getCreepActions: function() {
        this.unitManager.units.map(function(unit) {return unit.getAction();}).filter(function (action) { return action.action !== null;});
    },
    getRound: function() {
        return this.round;
    },
    addNewUnitAtLoc: function(unitType, loc) {
        if (!this.map.isPassable(loc)) {
            console.log("Unit cannot be added there. Location not passable!");
        } else {
            var spawned = UnitFactory.createUnit(unitType, loc);
            this.unitManager.addUnit(spawned);
            this.map.addUnit(spawned);
            spawned.delay += 2;
            spawned.setPlayer(PlayerFactory.createPlayerForUnit(spawned, new CreepController(spawned.id)));
        }
    },
    gameOver: function() {
        return this.player.hp <= 0 || this.player.location.equals(this.map.exit) || this.round > this.map.roundLimit;
    },
    won: function() {
        return this.player.hp > 0 && this.player.location.equals(this.map.exit);
    }
};

module.exports = Game;