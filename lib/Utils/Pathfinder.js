var PF = require('pathfinding');
var Direction = require('../GameObjects/Direction');

/**
 * Creates a path Array from a start and end MapLocation
 *
 * @param {Map} Map on which to search.
 * @param {MapLocation} start The start location for the path.
 * @param {MapLocation} end The end location for the path.
 *
 * @return {Array} path An Array of X,Y coordinates leading from start to end or an empty Array.
 *
 * @see https://github.com/qiao/PathFinding.js/blob/master/docs/user-guide/diagonal-movement.md re: diagonalMovement
 */
function findPath(map, start, end) {
    var grid = new PF.Grid(terrainToPFArray(map.terrain));
    var finder = new PF.DijkstraFinder({diagonalMovement: PF.DiagonalMovement.Always});
    return finder.findPath(start.x, start.y, end.x, end.y, grid);
}

/**
 * Simply determines whether or not any path exists at all.
 *
 * @param {Map} Map on which to search.
 * @param {MapLocation} start The start location for the path.
 * @param {MapLocation} end The end location for the path.
 *
 * @return {Boolean}
 */
function doesPathExist(map, start, end) {
    var path = findPath(map, start, end);
    return path.length >= 1;
}

/**
 * Determines what direction to take next to get from start to end.
 *
 * @param {Map} Map on which to search.
 * @param {MapLocation} start The start location for the path.
 * @param {MapLocation} end The end location for the path.
 *
 * @return {Direction|null} A Direction object indicating the appropriate direction or null if invalid.
 */
function nextDirTo(map, start, end) {
    var path = findPath(map, start, end);
    var moveX = path[1][0] - start.x;
    var moveY = path[1][1] - start.y;

    if (moveX > -2 && moveX < 2 && moveY > -2 && moveX < 2) {
        return new Direction(moveX, moveY);
    }

    return null;
}

/**
 * Turns a regular map terrain array (with lots of information) in to a simpler array that pathfinding can work with.
 *
 * @param {Array} terrain The map's terrain information.
 *
 * @return {Array} A basic array of terrain information.
 */
function terrainToPFArray(terrain) {
    var pfArray = [];
    for (var i in terrain) {
        pfArray[i] = [];
        for (var j in terrain[i]) {
            if (terrain[i][j].passable) {
                pfArray[i][j] = 0;
            }
            else {
                pfArray[i][j] = 1;
            }
        }
    }
    return pfArray;
}

module.exports = {
    findPath: findPath,
    doesPathExist: doesPathExist,
    nextDirTo: nextDirTo,
    terrainToPFArray: terrainToPFArray
};