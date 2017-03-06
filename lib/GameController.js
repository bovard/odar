var Actions = require('./Actions');
var GameConstants = require('./GameConstants');
var MapLocation = require('./GameObjects/MapLocation');
var Team = require('./Team');


// hide these in the scope to make it harder for haxxorz
var map = null;
var unitManager = null;
var round = 0;

function GameController() {

}

// static functions
GameController.setMap = function(m) {
    map = m;
};

GameController.getMap = function(m) {
    return map;
};

GameController.setUnitManager = function(u) {
    unitManager = u;
};

GameController.canMove = function(id, dir) {
    var unit = unitManager.getById(id);
    if (!unit) {
        throw Error("non-existent unit trying to move!");
    }
    if (!unit.canAct()) {
        return false;
    }
    return map.isMoveSafe(unit.location.add(dir));
};

GameController.alertAllies = function(id) {
    var unit = unitManager.getById(id);
    if (!unit) {
        throw Error("non-existent unit trying to alert Allies!");
    }
    //if the unit can't see the player, don't alert anyone. Otherwise in a couple
    //turns every unit on the map that isn't separated by more than the alert radius
    //will be active.
    var playerLoc = this.getPlayerInfo().location;
    var distanceToPlayerSquared = unit.location.distanceSquaredTo(playerLoc);
    if (distanceToPlayerSquared > unit.sensorRadiusSquared && unit.hp > 0) {
        return;
    }
    var radius = Math.round(Math.sqrt(unit.alertRadiusSquared));
    for (var i = -radius; i <= radius; i++) {
        for (var j = -radius; j <= radius; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            var loc = new MapLocation(unit.location.x + i, unit.location.y + j);
            if (loc.distanceSquaredTo(unit.location) <= unit.alertRadiusSquared) {
                var target = map.getUnitAtLoc(loc);
                if (target) {
                    if (unit.alertRadiusSquared === 1000 || target.type === unit.type || target.type === unit.spawnedUnitType) {
                        target.activate();
                    }
                }
            }
        }

    }
};

GameController.setInactive = function(id) {
    var unit = unitManager.getById(id);
    unit.deactivate();
};

GameController.tryMove = function(id, dir) {
    if (!GameController.canMove(id, dir)) {
        unitManager.getById(id).canActThrow();
        throw Error("That unit can't move that way!");
    }
    var unit = unitManager.getById(id);

    if (dir.isDiagonal()) {
        // slight penalty for moving diagonal
        unit.delay += 1.4 * unit.movementDelay;
    } else {
        unit.delay += unit.movementDelay;
    }
    unit.action = Actions.MOVE;
    unit.source = unit.location;
    unit.target = unit.location.add(dir);
    unit.location = unit.target;

    map.moveUnit(unit.source, unit.location);
};

GameController.canHeal = function(id) {
    var unit = unitManager.getById(id);
    if (!unit) {
        throw Error("non-existent unit trying to heal!");
    }
    if (unit.healPower === 0) {
        return false;
    }
    return unit.canAct();
};

GameController.tryHeal = function(id) {
    if (!GameController.canHeal(id)) {
        unitManager.getById(id).canActThrow();
        throw Error("That unit can't heal!");
    }
    var unit = unitManager.getById(id);

    unit.delay += unit.healDelay;
    unit.action = Actions.HEAL;
    unit.source = unit.location;
    unit.target = unit.location;

    var target = map.getUnitAtLoc(unit.target);
    if (target) {
        if (target.canBeHealed) {
            target.hp += unit.healPower;
            if (target.hp > target.maxHp) {
                target.hp = target.maxHp;
            }
            target.activate();
        }
        else {
            console.log("That unit cannot be healed, doctor!");
        }
    } else {
        console.log("There is no unit to heal there, doctor!");
    }
};

GameController.canMeleeAttack = function(id, loc) {
    var unit = unitManager.getById(id);
    if (!unit) {
        throw Error("non-existent unit trying to melee attack!");
    }
    if (!loc) {
        throw Error("cannot try to attack loc "+ loc);
    }
    if (!unit.canAct() || unit.meleeAttackPower === 0) {
        return false;
    }
    return unit.location.distanceSquaredTo(loc) <= GameConstants.MAX_MELEE_ATTACK_RADIUS_SQUARED;
};

GameController.tryMeleeAttack = function(id, loc) {
    if (!GameController.canMeleeAttack(id, loc)) {
        unitManager.getById(id).canActThrow();
        throw Error("That unit can't melee attack!");
    }
    var unit = unitManager.getById(id);

    unit.delay += unit.meleeAttackDelay;
    unit.action = Actions.MELEE;
    unit.source = unit.location;
    unit.target = loc;

    var target = map.getUnitAtLoc(unit.target);
    if (target) {
        target.hp -= unit.meleeAttackPower;
        target.activate();
    } else {
        console.log("Swing and a miss, lol!");
    }
};

GameController.canMagicAttack = function(id, loc) {
    var unit = unitManager.getById(id);
    if (!unit) {
        throw Error("non-existent unit trying to magic attack!");
    }
    if (!loc) {
        throw Error("cannot try to attack loc "+ loc);
    }
    if (!unit.canAct()) {
        return false;
    }
    if (unit.magicAttackPower === 0) {
        return false;
    }
    return unit.location.distanceSquaredTo(loc) < GameConstants.MAX_MAGIC_ATTACK_RADIUS_SQUARED;
};

GameController.tryMagicAttack = function(id, loc) {
    if (!GameController.canMagicAttack(id, loc)) {
        unitManager.getById(id).canActThrow();
        throw Error("This unit can't magic attack that loc!");
    }

    var unit = unitManager.getById(id);

    unit.delay += unit.magicAttackDelay;
    unit.action = Actions.MAGIC;
    unit.source = unit.location;
    unit.target = loc;

    var target = map.getUnitAtLoc(loc);
    if (target) {
        target.hp -= unit.magicAttackPower;
        target.activate();
    } else {
        console.log('magic attack empty square!');
    }
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            if (i !== 0 || j !== 0) {
                target = map.getUnitAtLoc(new MapLocation(loc.x + i, loc.y + j));
                if (target) {
                    target.hp -= unit.magicAttackPower * GameConstants.MAGIC_ATTACK_SPLASH_PERCENTAGE;
                    target.activate();
                }
            }
        }
    }
};

GameController.canRangedAttack = function(id, loc) {
    var unit = unitManager.getById(id);
    if (!unit) {
        throw Error("non-existent unit trying to ranged attack!");
    }
    if (!loc) {
        throw Error("cannot try to attack loc "+ loc);
    }
    if (!unit.canAct()) {
        return false;
    }
    if (unit.rangedAttackPower === 0) {
        return false;
    }
    if (unit.location.distanceSquaredTo(loc) > GameConstants.MAX_RANGED_ATTACK_RADIUS_SQUARED) {
        return false;
    }
    if (unit.location.distanceSquaredTo(loc) < GameConstants.MIN_RANGED_ATTACK_RADIUS_SQUARED) {
        return false;
    }
    return true;
};

GameController.tryRangedAttack = function(id, loc) {
    if (!GameController.canRangedAttack(id, loc)) {
        unitManager.getById(id).canActThrow();
        throw Error("This unit can't ranged attack that loc!");
    }

    var unit = unitManager.getById(id);

    unit.delay += unit.rangedAttackDelay;
    unit.action = Actions.RANGED;
    unit.source = unit.location;
    unit.target = loc;

    var target = map.getUnitAtLoc(loc);
    if (target) {
        target.hp -= unit.rangedAttackPower;
        target.activate();
    } else {
        console.log('ranged attack empty square!');
    }

};

GameController.senseNearbyUnits = function(id, options) {
    var unit = unitManager.getById(id);
    if (!unit) {
        throw Error("non-existent unit tried to sense!");
    }
    var radius = Math.floor(Math.sqrt(unit.sensorRadiusSquared));

    var result = [];
    for (var i = -radius; i <= radius; i++) {
        for (var j = -radius; j <= radius; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            var loc = new MapLocation(unit.location.x + i, unit.location.y + j);
            if (loc.distanceSquaredTo(unit.location) <= unit.sensorRadiusSquared) {
                var target = map.getUnitAtLoc(loc);
                if (target) {
                    if (!options ||
                        (options.team && target.team == options.team) ||
                        (options.enemiesOnly && target.team != Team.NEUTRAL && target.team != unit.team)) {

                        result.push(target.getUnitInfo());
                    }
                }
            }

        }
    }
    return result;
};

GameController.canSense = function(id, loc) {
    var unit = unitManager.getById(id);
    if (!unit) {
        throw Error("non-existent unit tried to sense!");
    }
    if (!loc) {
        throw Error("Can't sense location "+ loc);
    }
    return unit.location.distanceSquaredTo(loc) <= unit.sensorRadiusSquared;
};

GameController.trySenseUnitAtLoc = function(id, loc) {
    if (!GameController.canSense(id, loc)) {
        throw Error("Cannot sense location " + loc);
    }
    var unit = map.getUnitAtLoc(loc);
    if (unit) {
        return unit.getUnitInfo();
    } else {
        return null;
    }
};

GameController.getDelay = function(id) {
    var unit = unitManager.getById(id);
    if (!unit) {
        throw Error("non-existent unit tried to getDelay!");
    }
    return unit.delay;
};

GameController.setRound = function(rnd) {
    round = rnd;
};

GameController.getRound = function(id) {
    return round;
};

GameController.getRoundLimit = function(id) {
    return map.roundLimit;
};

GameController.getHp = function(id) {
    var unit = unitManager.getById(id);
    if (!unit) {
        throw Error("non-existent unit tried to getHp!");
    }
    return unit.hp;
};

GameController.getCurrentLocation = function(id) {
    var unit = unitManager.getById(id);
    if (!unit) {
        throw Error("non-existent unit tried to getCurrentLocation!");
    }
    return unit.location;
};

GameController.senseDirectionToExit = function(id) {
    var exit = map.getExitLoc();
    var unit = unitManager.getById(id);
    if (!unit) {
        throw Error("non-existent unit tried to getDirectionToExit!");
    }
    return unit.location.directionTo(exit);
};

GameController.senseExitIfClose = function(id) {
    var exit = map.getExitLoc();
    var unit = unitManager.getById(id);
    if (!unit) {
        throw Error("non-existent unit tried to getDirectionToExit!");
    }
    if (unit.location.distanceSquaredTo(exit) <= GameConstants.SENSE_EXIT_THRESHOLD) {
        return exit;
    } else {
        return null;
    }

};

GameController.trySenseIsPassable = function(id, loc) {
    if(!GameController.canSense(id, loc)) {
        throw Error("can't sense that location");
    }
    return map.isOnMap(loc) && map.isPassable(loc);
};

GameController.getPlayerInfo = function(id) {
    if (id) {
        var unit = unitManager.getById(id);
        if (!unit) {
            throw Error("There isn't a unit with this id!");
        }
        return unit.getUnitInfo();
    }

    var player = unitManager.getPlayer();
    if (!player) {
        throw Error("We don't have a player!");
    }
    return player.getUnitInfo();
};

GameController.isCreepActive = function(id) {
    var creep = unitManager.getById(id);
    if (!creep) {
        throw Error("There isn't a unit with this id!");
    }
    return creep.active;
};

GameController.getSpawnDelay = function(id) {
    var unit = unitManager.getById(id);
    if (!unit) {
        throw Error("There isn't a unit with this id!");
    }
    return unit.currentSpawnDelay;
};

GameController.canSpawn = function(id, unitType, dir) {
    var unit = unitManager.getById(id);
    if (!unit) {
        throw Error("There isn't a unit with this id!");
    }
    if (!unit.canAct()) {
        return false;
    }
    if (unit.currentSpawnDelay >= 1) {
        return false;
    }
    if (unit.spawnedUnitType !== unitType) {
        return false;
    }
    if (!GameController.canMove(id, dir)) {
        return false;
    }
    return true;
};

GameController.getSpawnUnitType = function(id) {
    var unit = unitManager.getById(id);
    if (!unit) {
        throw Error("There isn't a unit with this id!");
    }
    return unit.spawnedUnitType;
};

GameController.trySpawn = function(id, unitType, dir) {
    var spawner = unitManager.getById(id);
    if (!GameController.canSpawn(id, unitType, dir)) {
        spawner.canActThrow();
        throw Error("Can't spawn "+ unitType +" in " + (dir && dir.toString()));
    }
    spawner.action = Actions.SPAWN;
    spawner.source = spawner.location;
    spawner.target = spawner.location.add(dir);
    spawner.currentSpawnDelay += spawner.spawnDelay;
    spawner.delay += 3;
};


GameController.getMyInfo = function(id) {
    var unit = unitManager.getById(id);
    if (!unit) {
        throw Error("There isn't a unit with this id!");
    }
    return unit.getUnitInfo();
};



module.exports = GameController;