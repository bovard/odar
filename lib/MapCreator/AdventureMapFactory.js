var Map = require('../Map');
var UnitType = require('../UnitType');
var MapOptions = require('./MapOptions');
var TerrainType = require('../GameObjects/TerrainType');
var DifficultyCalculator = require('./DifficultyCalculator');

var CaveCreator = require('./CaveCreator');
var CampCreator = require('./CampCreator');
var ForestCreator = require('./ForestCreator');
var MazeCreator = require('./MazeCreator');
var SewerCreator = require('./SewerCreator');
var WalkCreator = require('./WalkCreator');

function AdventureMapFactory() {

}

function createLegalMap(mapCreationFunction, height, width, primaryEnemy, secondaryEnemy, rareEnemy, boss, options) {
    var i = 0;
    var map;
    do {
        map = mapCreationFunction(height, width, primaryEnemy, secondaryEnemy, rareEnemy, boss, options);
        i++;
    } while (!map.isLegal() && i < 100);

    if (i == 100) {
        throw Error("Error generating legal map!");
    }
    return map;
}

// static functions
AdventureMapFactory.createAdventureMap = function(level) {
    var mapOptions;

    var difficulty = Math.floor(level / 10);
    level = level % 10;
    var types = DifficultyCalculator.getEnemiesForLevel(level, difficulty);
    var counts = DifficultyCalculator.getNumberOfEnemiesAtDifficulty(difficulty);
    var size = DifficultyCalculator.getMapSizeForDifficulty(difficulty);
    var height = size[0] + level;
    var width = size[1] + level;
    mapOptions = {};
    mapOptions[MapOptions.PRIMARY_ENEMY] = types[0];
    mapOptions[MapOptions.NUM_PRIMARY_ENEMIES] = counts[0];
    mapOptions[MapOptions.SECONDARY_ENEMY] = types[1];
    mapOptions[MapOptions.NUM_SECONDARY_ENEMIES] = counts[1];
    mapOptions[MapOptions.SWARM_ENEMY] = types[2];
    mapOptions[MapOptions.NUM_SWARM_ENEMIES] = counts[2];
    mapOptions[MapOptions.RARE_ENEMY] = types[3];
    mapOptions[MapOptions.NUM_RARE_ENEMIES] = counts[3];
    mapOptions[MapOptions.BOSS_ENEMY] = types[4];
    mapOptions[MapOptions.NUM_BOSS_ENEMIES] = counts[4];
    /*
    CaveCreator
    CampCreator
    ForestCreator I
    SewerCreator
    WalkCreator I
    MazeCreator
    */

    switch(level) {
        case 1:
            // forest level
            mapOptions[MapOptions.TERRAIN_FILL] = Math.min(0.4 + 2*difficulty/10, 1);
            mapOptions[MapOptions.TERRAIN_DENSITY] = Math.min(0.4 + 2*difficulty/10, 1);

            mapOptions[MapOptions.PRIMARY_OPEN_TERRAIN] = false;
            mapOptions[MapOptions.SECONDARY_OPEN_TERRAIN] = false;
            mapOptions[MapOptions.PRIMARY_IMPASSIBLE_TERRAIN] = false;
            mapOptions[MapOptions.SECONDARY_IMPASSIBLE_TERRAIN] = false;
            return createLegalMap(ForestCreator.create, height, width, mapOptions);
        case 2:
            // camp level
            mapOptions[MapOptions.TERRAIN_FILL] = Math.max(1 - 2*difficulty/10, 0.4);

            mapOptions[MapOptions.PRIMARY_OPEN_TERRAIN] = false;
            mapOptions[MapOptions.SECONDARY_OPEN_TERRAIN] = false;
            mapOptions[MapOptions.PRIMARY_IMPASSIBLE_TERRAIN] = false;
            mapOptions[MapOptions.SECONDARY_IMPASSIBLE_TERRAIN] = false;
            return createLegalMap(CampCreator.create, height, width, mapOptions);

        case 3:
            // mountain pass level
            mapOptions[MapOptions.TERRAIN_FILL] = Math.min(0.4 + 2*difficulty/10, 1);
            mapOptions[MapOptions.TERRAIN_DENSITY] = Math.min(0.4 + 2*difficulty/10, 1);

            mapOptions[MapOptions.PRIMARY_OPEN_TERRAIN] = false;
            mapOptions[MapOptions.SECONDARY_OPEN_TERRAIN] = false;
            mapOptions[MapOptions.PRIMARY_IMPASSIBLE_TERRAIN] = TerrainType.ROCK;
            mapOptions[MapOptions.SECONDARY_IMPASSIBLE_TERRAIN] = false;
            return createLegalMap(WalkCreator.create, height, width, mapOptions);

        case 4:
            // cave level
            mapOptions[MapOptions.TERRAIN_FILL] = Math.max(1 - 2*difficulty/10, 0.4);

            mapOptions[MapOptions.PRIMARY_OPEN_TERRAIN] = false;
            mapOptions[MapOptions.SECONDARY_OPEN_TERRAIN] = false;
            mapOptions[MapOptions.PRIMARY_IMPASSIBLE_TERRAIN] = false;
            mapOptions[MapOptions.SECONDARY_IMPASSIBLE_TERRAIN] = false;
            return createLegalMap(CaveCreator.create, height, width, mapOptions);

        case 5:
            // swamp level
            mapOptions[MapOptions.TERRAIN_FILL] = Math.min(0.4 + 2*difficulty/10, 1);
            mapOptions[MapOptions.TERRAIN_DENSITY] = Math.min(0.4 + 2*difficulty/10, 1);

            mapOptions[MapOptions.PRIMARY_OPEN_TERRAIN] = TerrainType.DIRT;
            mapOptions[MapOptions.SECONDARY_OPEN_TERRAIN] = TerrainType.SAND;
            mapOptions[MapOptions.PRIMARY_IMPASSIBLE_TERRAIN] = TerrainType.WATER;
            mapOptions[MapOptions.SECONDARY_IMPASSIBLE_TERRAIN] = TerrainType.ROCK;
            return createLegalMap(WalkCreator.create, height, width, mapOptions);

        case 6:
            // dessert level
            mapOptions[MapOptions.TERRAIN_FILL] = Math.min(0.4 + 2*difficulty/10, 1);
            mapOptions[MapOptions.TERRAIN_DENSITY] = Math.min(0.4 + 2*difficulty/10, 1);

            mapOptions[MapOptions.PRIMARY_OPEN_TERRAIN] = TerrainType.SAND;
            mapOptions[MapOptions.SECONDARY_OPEN_TERRAIN] = TerrainType.DIRT;
            mapOptions[MapOptions.PRIMARY_IMPASSIBLE_TERRAIN] = TerrainType.ROCK;
            mapOptions[MapOptions.SECONDARY_IMPASSIBLE_TERRAIN] = TerrainType.WALL;
            return createLegalMap(ForestCreator.create, height, width, mapOptions);

        case 7:

            // dessert camp level
            mapOptions[MapOptions.TERRAIN_FILL] = Math.max(1 - 2*difficulty/10, 0.4);

            mapOptions[MapOptions.PRIMARY_OPEN_TERRAIN] = TerrainType.SAND;
            mapOptions[MapOptions.SECONDARY_OPEN_TERRAIN] = TerrainType.CEMENT;
            mapOptions[MapOptions.PRIMARY_IMPASSIBLE_TERRAIN] = TerrainType.WALL;
            mapOptions[MapOptions.SECONDARY_IMPASSIBLE_TERRAIN] = TerrainType.ROCK;
            return createLegalMap(CampCreator.create, height, width, mapOptions);

        case 8:
            // deep woods level
            mapOptions[MapOptions.TERRAIN_FILL] = Math.max(1 - 2*difficulty/10, 0.4);

            mapOptions[MapOptions.PRIMARY_OPEN_TERRAIN] = TerrainType.GRASS;
            mapOptions[MapOptions.SECONDARY_OPEN_TERRAIN] = TerrainType.DIRT;
            mapOptions[MapOptions.PRIMARY_IMPASSIBLE_TERRAIN] = TerrainType.TREE;
            mapOptions[MapOptions.SECONDARY_IMPASSIBLE_TERRAIN] = TerrainType.ROCK;
            return createLegalMap(CaveCreator.create, height, width, mapOptions);

        case 9:
            // sewer level
            mapOptions[MapOptions.TERRAIN_FILL] = 1 - 2*difficulty/10;
            return createLegalMap(SewerCreator.create, height, width, mapOptions);

        case 0:
            // maze level
            mapOptions[MapOptions.NUM_PRIMARY_ENEMIES] = 0;
            mapOptions[MapOptions.NUM_SECONDARY_ENEMIES] = 0;
            mapOptions[MapOptions.NUM_SWARM_ENEMIES] = 0;
            mapOptions[MapOptions.NUM_RARE_ENEMIES] = Math.ceil(counts[3] / 5);
            mapOptions[MapOptions.NUM_BOSS_ENEMIES] = counts[4];
            return createLegalMap(MazeCreator.create, Math.round(height/2), Math.round(width/2), mapOptions);

        default:
            throw Error("no adventure level "+ level);
    }
};

module.exports = AdventureMapFactory;