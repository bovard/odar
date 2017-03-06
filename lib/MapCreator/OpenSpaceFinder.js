var Direction = require('../GameObjects/Direction');
var MapLocation = require('../GameObjects/MapLocation');
var MapUtils = require('../Utils/MapUtils');

function arrayContainsLoc(arr, loc) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].equals(loc)) {
            return true;
        }
    }
    return false;
}


function arrayContainsCloseLoc(arr, loc, radius) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].distanceSquaredTo(loc) <= radius * radius) {
            return true;
        }
    }
    return false;
}


function findOpenSpaces(map) {
    var resolution = 3;
    var i, j, k, sumX, sumY, count, x, y, loc, center, done, radius, dir;
    var centers = [];
    for (i = resolution; i < map.height - resolution; i+= resolution) {
        for (j = resolution; j < map.width - resolution; j+= resolution) {
            loc = new MapLocation(j, i);
            if (map.isPassable(loc)) {
                centers.push(loc);
            }
        }
    }

    var completeCenters = [];
    var maxLoops = 9;
    for (i = 0; i < maxLoops + 1; i++) {
        var movedCenters = [];
        for (j = 0; j < centers.length; j++) {
            center = centers[j];
            sumX = 0;
            sumY = 0;
            count = 0;
            done = false;
            radius = 0;
            while (!done && radius < 10) {
                radius += 1;
                for (x = -radius; x <= radius; x++) {
                    for (y = -radius; y <= radius; y++) {
                        loc = new MapLocation(center.x + x, center.y + y);
                        if (center.distanceSquaredTo(loc) > radius * radius) {
                            continue;
                        }
                        if (!map.isOnMap(loc) || !map.isPassable(loc)) {
                            count += 1;
                            done = true;
                            sumX += x;
                            sumY += y;
                        }
                    }
                }
            }
            dir = MapUtils.getDirectionFromDiff(sumX, sumY);
            if (dir.equals(Direction.OMNI) || i === maxLoops) {
                if (!arrayContainsCloseLoc(completeCenters.map(function(e) {return e.center;}), center, resolution)) {
                    completeCenters.push({
                        "center": center,
                        "radius": radius - 1
                    });
                }
            } else {
                loc = center.add(dir.opposite());
                if (!arrayContainsCloseLoc(movedCenters, loc) && map.isOnMap(loc), resolution) {
                    movedCenters.push(loc);
                }
            }


        }

        //console.log("============");
        //console.log("Loop #", i);
        //console.log("start", centers.length);
        //console.log("complete", completeCenters.length);
        //console.log("end", movedCenters.length);
        centers = movedCenters;
    }
    completeCenters = completeCenters.sort(function(a, b) { return b.radius - a.radius; });
    //completeCenters.forEach(function (f) {console.log(f.center.toString(), f.radius)});
    return completeCenters;
}

module.exports = {
    "findOpenSpaces": findOpenSpaces
};