var Direction = require('../GameObjects/Direction');
var Map = require('../Map');
var MapLocation = require('../GameObjects/MapLocation');
var MapOptions = require('./MapOptions');
var MapUtils = require('../Utils/MapUtils');
var TerrainType = require('../GameObjects/TerrainType');

function sewer(height, width, mapOptions) {
    var start, exit, map, center, i, j, x, y;
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

    var primaryOpenTerrain = mapOptions[MapOptions.PRIMARY_OPEN_TERRAIN] || TerrainType.CEMENT;

    var primaryImpassibleTerrain = mapOptions[MapOptions.PRIMARY_IMPASSIBLE_TERRAIN] || TerrainType.WATER;

    start = new MapLocation(1, 1);
    exit = new MapLocation(width - 2, height - 2);
    // approximately the % of open space, must be in [.1,.6]
    map = new Map(height, width, start, exit, roundLimit, primaryImpassibleTerrain);
    map.fillWithTiles(primaryImpassibleTerrain);

    var centers = MapUtils.createSpacedOutLocations(width, height, fill, 49, start, exit);

    var rooms = [];
    // grow rooms randomly around centers
    centers.forEach(function(center) {
        var box = MapUtils.createBoxAroundLocation(map, center, 2, 5, 2, 5, primaryOpenTerrain);

        if (center.equals(start) || center.equals(exit)) {
            return;
        }
        rooms.push(box);
    });

    MapUtils.elbowConnectLocationList(map, centers, 1, primaryOpenTerrain, {});

    var startRooms = 0;
    var room, spawned;
    var idx = 0;
    spawned = 0;
    while (swarmEnemy && spawned < numSwarmEnemy && idx < 100 && startRooms < rooms.length) {
        idx++;
        room = rooms[startRooms];
        startRooms++;
        for (x = room[0].x; x <= room[1].x; x++) {
            for (y = room[0].y; y<= room[1].y; y++) {
                loc = new MapLocation(x, y);
                if(map.isPassable(loc) && spawned < numSwarmEnemy && !map.spawnListContains(loc)) {
                    if (Math.random() < 0.75) {
                        map.addToSpawnList(swarmEnemy, loc);
                        spawned++;
                    }
                }
            }
        }

    }

    [
        [primaryEnemy, numPrimaryEnemy],
        [secondaryEnemy, numSecondaryEnemy],
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
            for (i = startRooms; i < rooms.length; i++) {
                room = rooms[i];
                x = MapUtils.getRandomFromRange(room[0].x, room[1].x);
                y = MapUtils.getRandomFromRange(room[0].y, room[1].y);
                loc = new MapLocation(x, y);
                if(map.isPassable(loc) && spawned < count && !map.spawnListContains(loc)) {
                    if (Math.random() < 0.75) {
                        map.addToSpawnList(type, loc);
                        spawned++;
                    }
                }
                if (map.isPassable(loc) && !map.spawnListContains(loc) && spawned < count) {
                    map.addToSpawnList(type, loc);
                    spawned++;
                }
            }
        }
    });

    // spawn the boss at the exit
    if (boss && numBoss > 0) {
        map.addToSpawnList(boss, exit.add(Direction.NORTH_WEST));
    }

    map.cleanUp(primaryOpenTerrain);

    return map;
}

module.exports = {
    "create": sewer
};