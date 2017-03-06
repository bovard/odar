var Direction = require('./GameObjects/Direction');
var MapLocation = require('./GameObjects/MapLocation');
var Team = require('./Team');
var GameConstants = require('./GameConstants');

function getPlayerFromCode(playerCode) {
    eval(playerCode);

    function createPlayer(playerController) {
        return new RaidPlayer(playerController);
    }

    return createPlayer;
}

module.exports = getPlayerFromCode;
