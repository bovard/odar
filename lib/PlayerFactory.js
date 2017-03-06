var UnitType = require('./UnitType');

var GenericMeleePlayer = require('./CreepPlayers/GenericMeleePlayer');
var GenericRangedPlayer = require('./CreepPlayers/GenericRangedPlayer');
var NecromancerPlayer = require('./CreepPlayers/NecromancerPlayer');
var NecromancerHealPlayer = require('./CreepPlayers/NecromancerHealPlayer');
var RandomMeleePlayer = require('./CreepPlayers/RandomMeleePlayer');
var Bull = require('./CreepPlayers/BullPlayer');
var HideWhenActive = require('./CreepPlayers/HideWhenActivePlayer');
var MeleeRangePlayer = require('./CreepPlayers/MeleeRangePlayer');
var MeleeOnly = require('./CreepPlayers/MeleeOnlyPlayer');
var MeleePack = require('./CreepPlayers/MeleePackPlayer');
var BreederMeleePlayer = require('./CreepPlayers/BreederMeleePlayer');
var SpawnRun = require('./CreepPlayers/SpawnRunPlayer');
var RandomToExit = require('./CreepPlayers/RandomToExitMeleePlayer');
var ToExitMelee = require('./CreepPlayers/ToExitMeleePlayer');
var HideAlways = require('./CreepPlayers/HideAlwaysPlayer');
var ToExitRange = require('./CreepPlayers/ToExitRangePlayer');
var BlockHallMeleeRangePlayer = require('./CreepPlayers/BlockHallMeleeRangePlayer');
var MagicPlayer = require('./CreepPlayers/MagicPlayer');
var MagicMeleePlayer = require('./CreepPlayers/MagicMeleePlayer');
var MeleeRangeStationaryPlayer = require('./CreepPlayers/MeleeRangeStationaryPlayer');

function PlayerFactory() {

}

// static functions
PlayerFactory.createPlayerForUnit = function(unit, cc) {
    switch (unit.type) {
        case UnitType.AMBROSE:
            return new GenericMeleePlayer(cc);
        case UnitType.BOVARD:
            return new HideWhenActive(cc);
        case UnitType.CHRIS:
            return new HideAlways(cc);
        case UnitType.DRAGON:
            return new MeleeRangePlayer(cc);
        case UnitType.FLOATING_EYE:
            return new MeleeOnly(cc);
        case UnitType.GIANT_FROG:
            return new GenericMeleePlayer(cc);
        case UnitType.GNAT:
            return new GenericMeleePlayer(cc);
        case UnitType.HARPY:
            return new HideAlways(cc);
        case UnitType.ICKY_THING:
            return new RandomToExit(cc);
        case UnitType.JACKEL:
            return new MeleePack(cc);
        case UnitType.KOBOLD:
            return new GenericMeleePlayer(cc);
        case UnitType.GIANT_LOUSE:
            return new BreederMeleePlayer(cc);
        case UnitType.MOLD:
            return new MeleeOnly(cc);
        case UnitType.NECROMANCER:
            return new NecromancerPlayer(cc);
        case UnitType.ORC:
            return new MeleePack(cc);
        case UnitType.DRUNK_VIKING:
            return new RandomMeleePlayer(cc);
        case UnitType.QUILL_BOAR:
            return new GenericRangedPlayer(cc);
        case UnitType.RAPHAEL:
            return new SpawnRun(cc);
        case UnitType.SKELETON:
            return new GenericMeleePlayer(cc);
        case UnitType.GIANT_TICK:
            return new GenericMeleePlayer(cc);
        case UnitType.WORM:
            return new BreederMeleePlayer(cc);
        case UnitType.YEEK:
            return new ToExitRange(cc);
        case UnitType.ZOMBIE:
            return new BreederMeleePlayer(cc);
        case UnitType.GIANT_ANT_LION:
            return new BlockHallMeleeRangePlayer(cc);
        case UnitType.BULL:
            return new Bull(cc);
        case UnitType.GELATINOUS_CUBE:
            return new BlockHallMeleeRangePlayer(cc);
        case UnitType.ANCIENT_DRAGON:
            return new MeleeRangePlayer(cc);
        case UnitType.ELEMENTAL:
            return new MagicPlayer(cc);
        case UnitType.FLY:
            return new RandomMeleePlayer(cc);
        case UnitType.GHOST:
            return new MagicMeleePlayer(cc);
        case UnitType.HOBGOBLIN:
            return new GenericRangedPlayer(cc);
        case UnitType.JELLY:
            return new ToExitMelee(cc);
        case UnitType.KILLER_BEETLE:
            return new MeleePack(cc);
        case UnitType.LICH:
            return new MagicMeleePlayer(cc);
        case UnitType.MINOTAUR:
            return new GenericMeleePlayer(cc);
        case UnitType.OOZE:
            return new MeleeRangeStationaryPlayer(cc);
        case UnitType.GIANT:
            return new MeleeRangePlayer(cc);
        case UnitType.QUYLTHULG:
            return new SpawnRun(cc);
        case UnitType.REPTILE:
            return new GenericMeleePlayer(cc);
        case UnitType.SCORPION:
            return new Bull(cc);
        case UnitType.TROLL:
            return new BlockHallMeleeRangePlayer(cc);
        case UnitType.UMBER_HULK:
            return new BlockHallMeleeRangePlayer(cc);
        case UnitType.VAMPIRE:
            return new NecromancerHealPlayer(cc);
        case UnitType.WUMPUS:
            return new GenericMeleePlayer(cc);
        case UnitType.YETI:
            return new MeleeRangePlayer(cc);
        case UnitType.MUSHROOM:
            return new MeleeOnly(cc);
        case UnitType.ROCKS:
            return new BlockHallMeleeRangePlayer(cc);
        default:
            throw Error((unit && unit.type) + " not recognized!");
    }
};

module.exports = PlayerFactory;