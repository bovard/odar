var Direction = require('../GameObjects/Direction');
var Map = require('../Map');
var MapLocation = require('../GameObjects/MapLocation');
var MapUtils = require('../Utils/MapUtils');
var MapOptions = require('./MapOptions');
var OpenSpaceFinder = require('./OpenSpaceFinder');
var TerrainType = require('../GameObjects/TerrainType');


function camp(height, width, mapOptions) {
    var start, exit, map, i, j, x, y, center;
    var primaryEnemy = mapOptions[MapOptions.PRIMARY_ENEMY];
    var numPrimaryEnemy = mapOptions[MapOptions.NUM_PRIMARY_ENEMIES] || 0;
    var secondaryEnemy = mapOptions[MapOptions.SECONDARY_ENEMY];
    var numSecondaryEnemy = mapOptions[MapOptions.NUM_SECONDARY_ENEMIES] || 0;
    var swarmEnemy = mapOptions[MapOptions.SWARM_ENEMY];
    var numSwarmEnemy = mapOptions[MapOptions.NUM_SWARM_ENEMIES] || 0;
    var rareEnemy = mapOptions[MapOptions.RARE_ENEMY];
    var numRareEnemy = mapOptions[MapOptions.NUM_RARE_ENEMIES] || 0;
    var boss = mapOptions[MapOptions.BOSS_ENEMY];
    var numBoss = mapOptions[MapOptions.NUM_BOSS_ENEMIES] || 0;
    var roundLimit = mapOptions[MapOptions.ROUND_LIMIT] || 1000;
    var fill = mapOptions[MapOptions.TERRAIN_FILL] || 0.5;

    var primaryOpenTerrain = mapOptions[MapOptions.PRIMARY_OPEN_TERRAIN] || TerrainType.GRASS;
    var secondaryOpenTerrain = mapOptions[MapOptions.SECONDARY_OPEN_TERRAIN] || TerrainType.DIRT;

    var primaryImpassibleTerrain = mapOptions[MapOptions.PRIMARY_IMPASSIBLE_TERRAIN] || TerrainType.WALL;
    var secondaryImpassibleTerrain = mapOptions[MapOptions.SECONDARY_IMPASSIBLE_TERRAIN] || TerrainType.TREE;


    start = new MapLocation(1, height - 2);
    exit = new MapLocation(width - 2, 1);

    // how dense the forest is [0,1]
    map = new Map(height, width, start, exit, roundLimit, primaryOpenTerrain);

    var centers = MapUtils.createSpacedOutLocations(width, height, fill, 64, start, exit);


    for (i = 2; i < centers.length; i++) {
        center = centers[i];
        var halfWidth  = Math.round(Math.random()/1.75) + 2;
        var halfHeight  = Math.round(Math.random()/1.75) + 2;
        var upLeft = new MapLocation(center.x - halfWidth, center.y - halfHeight);
        var botRight = new MapLocation(center.x + halfWidth, center.y + halfHeight);
        map.createTiles(upLeft, botRight, secondaryOpenTerrain, false);
        MapUtils.drawBox(map, upLeft, botRight, primaryImpassibleTerrain, true);
    }

    [
        [primaryEnemy, numPrimaryEnemy],
        [secondaryEnemy, numSecondaryEnemy],
        [boss, numBoss],
        [rareEnemy, numRareEnemy]
    ].forEach(function (pair) {
        var type = pair[0];
        var count = pair[1];
        if (!type) {
            return;
        }
        idx = 0;
        spawned = 0;
        while (type && idx < 200 && spawned < count) {
            idx++;
            for (i = 2; i < centers.length; i++) {
                center = centers[i];
                loc = center.add(Direction.randomDirection());
                if (type === boss || type === rareEnemy) {
                    loc = center;
                }
                if (map.isPassable(loc) && !map.spawnListContains(loc) && spawned < count) {
                    map.addToSpawnList(type, loc);
                    spawned++;
                }
            }
        }
    });




    // place swarm
    var circles = OpenSpaceFinder.findOpenSpaces(map);
    spawned = 0;
    idx = 0;
    i = 0;
    while (swarmEnemy && spawned < numSwarmEnemy && idx < 100 && i < circles.length) {
        idx++;
        center = circles[i].center;
        radius = circles[i].radius;
        if (map.getTerrainTypeAtLoc(center) === secondaryOpenTerrain) {
            i++;
            continue;
        }
        r = Math.min(radius, 2);
        for(x = -r; x <= r; x++) {
            for (y = -r; y <= r; y++) {
                loc = new MapLocation(center.x + x, center.y + y);
                if (center.distanceSquaredTo(loc) > r * r) {
                    continue;
                }
                if (!map.spawnListContains(loc) && map.isPassable(loc) && spawned < numSwarmEnemy) {
                    if (Math.random() < 0.75) {
                        map.addToSpawnList(swarmEnemy, loc);
                        spawned++;
                    }
                }
            }
        }
        i++;
    }


    // place some trees
    idx = 0;
    var placed = 0;
    while(idx < 100 && placed < 0.1 * width * height) {
        idx++;
        x = Math.round(Math.random() * width);
        y = Math.round(Math.random() * height);
        loc = new MapLocation(x, y);
        var type = map.getTerrainTypeAtLoc(loc);
        if (type === primaryOpenTerrain && !loc.equals(start) && !loc.equals(exit) && !map.spawnListContains(loc)) {
            map.createTile(loc, secondaryImpassibleTerrain);
            placed++;
        }
    }


    map.cleanUp(primaryOpenTerrain);

    return map;
}


module.exports = {
    "create": camp
};