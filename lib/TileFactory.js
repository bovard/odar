var Tile = require('./GameObjects/Tile');
var TerrainType = require('./GameObjects/TerrainType');

function TileFactory() {

}

TileFactory.createTile = function(terrain) {
    var props;

    switch(terrain) {
        case TerrainType.GRASS:
            props = {
                "name": "Grass",
                "type": TerrainType.GRASS,
                "passable": true,
                "cssClass": "grass"
            };
            break;
        case TerrainType.DIRT:
            props = {
                "name": "Dirt",
                "type": TerrainType.DIRT,
                "passable": true,
                "cssClass": "dirt"
            };
            break;
        case TerrainType.SAND:
            props = {
                "name": "Sand",
                "type": TerrainType.SAND,
                "passable": true,
                "cssClass": "sand"
            };
            break;
        case TerrainType.CEMENT:
            props = {
                "name": "Cement",
                "type": TerrainType.CEMENT,
                "passable": true,
                "cssClass": "cement"
            };
            break;
        case TerrainType.WALL:
            props = {
                "name": "Wall",
                "type": TerrainType.WALL,
                "passable": false,
                "cssClass": "wall"
            };
            break;
        case TerrainType.TREE:
            props = {
                "name": "Tree",
                "type": TerrainType.TREE,
                "passable": false,
                "cssClass": "tree"
            };
            break;
        case TerrainType.WATER:
            props = {
                "name": "Water",
                "type": TerrainType.WATER,
                "passable": false,
                "cssClass": "water"
            };
            break;
        case TerrainType.ROCK:
            props = {
                "name": "Rock",
                "type": TerrainType.ROCK,
                "passable": false,
                "cssClass": "rock"
            };
            break;
        default:
            throw Error(terrain + " not recognized!");
    }

    return new Tile(props);

};

module.exports = TileFactory;