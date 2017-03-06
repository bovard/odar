/**
 * UnitInfo is a way of conveying information to the player about a unit
 * without:
 *   1. giving them a way to mess with the unit (set hp, etc)
 *   2. get long-term tracking on location or hp
 * @param info
 * @constructor
 */
function UnitInfo(info) {
    this.name = info.name;
    this.type = info.type;
    this.description = info.description;
    this.hint = info.hint;
    this.team = info.team;
    this.hp = info.hp;
    this.maxHp = info.maxHp;
    this.canBeHealed = info.canBeHealed || false;
    this.defeatPoints = info.defeatPoints || 0;
    this.location = info.location;
    this.delay = info.delay;
    this.movementDelay = info.movementDelay;
    this.healPower = info.healPower || 0;
    this.healDelay = info.healDelay;
    this.active = info.active;
    this.meleeAttackPower = info.meleeAttackPower || 0;
    this.meleeAttackDelay = info.meleeAttackDelay;
    this.magicAttackPower = info.magicAttackPower || 0;
    this.magicAttackDelay = info.magicAttackDelay;
    this.rangedAttackPower = info.rangedAttackPower || 0;
    this.rangedAttackDelay = info.rangedAttackDelay || 0;
    this.sensorRadiusSquared = info.sensorRadiusSquared;
    this.alertRadiusSquared = info.alertRadiusSquared || 0;

    this.spawnDelay = info.spawnDelay || 0;
    this.currentSpawnDelay = info.currentSpawnDelay || 0;
    this.spawnedUnitType = info.spawnedUnitType || null;
}

module.exports = UnitInfo;
