
UnitType = require('../UnitType');

function getNumberOfEnemiesAtDifficulty(difficulty) {
    difficulty = difficulty % 4;
    switch(difficulty) {
        //[primary, secondary, swarm, rare, boss]
        case 0: return [15, 5, 1, 0, 0];
        case 1: return [15, 6, 2, 1, 0];
        case 2: return [15, 7, 3, 2, 1];
        case 3: return [15, 10, 6, 4, 2];
    }
}

function getMapSizeForDifficulty(difficulty) {
    difficulty = difficulty % 4;
    switch(difficulty) {
        case 0: return [21, 31];
        case 1: return [31, 46];
        case 2: return [41, 61];
        case 3: return [51, 76];

        case 4: return [31, 46];
        case 5: return [51, 76];
        case 6: return [71, 106];
        case 7: return [91, 136];
    }
}

function getEnemiesForLevel(level, difficulty) {
    if (difficulty < 3) {
        // EASY ENEMIES
        // up to level 30
        switch(level) {
            //[primary, secondary, swarm, rare, boss]
            // Forest Level
            case 1: return [UnitType.GIANT_TICK, UnitType.QUILL_BOAR, UnitType.GIANT_LOUSE, UnitType.AMBROSE, UnitType.WUMPUS];
            // Camp Level
            case 2: return [UnitType.ORC, UnitType.ORC, UnitType.ZOMBIE, UnitType.CHRIS, UnitType.GIANT];
            // Mountain Pass Level
            case 3: return [UnitType.ROCKS, UnitType.FLY, UnitType.ZOMBIE, UnitType.BULL, UnitType.YETI];
            // Cave Level
            case 4: return [UnitType.ICKY_THING, UnitType.KOBOLD, UnitType.WORM, UnitType.UMBER_HULK, UnitType.NECROMANCER];
            // Swamp Level
            case 5: return [UnitType.JACKEL, UnitType.GIANT_FROG, UnitType.QUYLTHULG, UnitType.TROLL, UnitType.WUMPUS];
            // Dessert level
            case 6: return [UnitType.SCORPION, UnitType.REPTILE, UnitType.JACKEL, UnitType.BOVARD, UnitType.GIANT];
            // Dessert Camp level
            case 7: return [UnitType.JACKEL, UnitType.BULL, UnitType.VAMPIRE, UnitType.LICH, UnitType.GIANT_LOUSE];
            // Deep Woods level
            case 8: return [UnitType.SKELETON, UnitType.GHOST, UnitType.NECROMANCER, UnitType.VAMPIRE, UnitType.NECROMANCER];
            // Sewer level
            case 9: return [UnitType.HOBGOBLIN, UnitType.KOBOLD, UnitType.WORM, UnitType.UMBER_HULK, UnitType.WUMPUS];
            // Maze level
                // (maze doesn't have primary, secondary or swam)
            case 0: return [false, false, false, UnitType.MINOTAUR, UnitType.CHRIS];
        }
    } else {
        // HARD ENEMIES
        // level 30 - 60
        switch(level) {
            //[primary, secondary, swarm, rare, boss]
            // Forest Level
            case 1: return [UnitType.JACKEL, UnitType.GELATINOUS_CUBE, UnitType.RAPHAEL, UnitType.ZOMBIE, UnitType.RAPHAEL];
            // Camp Level
            case 2: return [UnitType.KOBOLD, UnitType.SCORPION, UnitType.BOVARD, UnitType.NECROMANCER, UnitType.GIANT];
            // Mountain Pass Level
            case 3: return [UnitType.GHOST, UnitType.HOBGOBLIN, UnitType.NECROMANCER, UnitType.WUMPUS, UnitType.ANCIENT_DRAGON];
            // Cave Level
            case 4: return [UnitType.OOZE, UnitType.MUSHROOM, UnitType.VAMPIRE, UnitType.ROCKS, UnitType.QUYLTHULG];
            // Ocean Level
            case 5: return [UnitType.GIANT_ANT_LION, UnitType.MOLD, UnitType.QUYLTHULG, UnitType.NECROMANCER, UnitType.ELEMENTAL];
            // Dessert level
            case 6: return [UnitType.ORC, UnitType.SKELETON, UnitType.WORM, UnitType.HOBGOBLIN, UnitType.AMBROSE];
            // Dessert Camp level
            case 7: return [UnitType.DRUNK_VIKING, UnitType.ORC, UnitType.GIANT_LOUSE, UnitType.SCORPION, UnitType.GIANT];
            // Deep Woods level
            case 8: return [UnitType.KOBOLD, UnitType.SKELETON, UnitType.VAMPIRE, UnitType.DRAGON, UnitType.LICH];
            // Sewer level
            case 9: return [UnitType.REPTILE, UnitType.UMBER_HULK, UnitType.ZOMBIE, UnitType.AMBROSE, UnitType.TROLL];
            // Maze level
                // (maze doesn't have primary, secondary or swam)
            case 0: return [false, false, false, UnitType.TROLL, UnitType.ANCIENT_DRAGON];
        }
    }
}

module.exports = {
    "getNumberOfEnemiesAtDifficulty": getNumberOfEnemiesAtDifficulty,
    "getMapSizeForDifficulty": getMapSizeForDifficulty,
    "getEnemiesForLevel": getEnemiesForLevel
};