var ScoreEvent = require("./ScoreEvent");
var GameConstants = require('./GameConstants');


function ScoreManager() {
    this.log = [];
    this.score = 0;
}

ScoreManager.prototype = {
    // @todo More serious checks here for fraudulent score update attempts.
    requestIsValid: function() {
        return !!(this.params.event && this.params.state);
    },

    getScore: function() {
        return this.score;
    },

    updateScore: function(params) {
        this.params = params;
        if (!this.requestIsValid()) {
            return null;
        }

        switch (params.event) {
            case ScoreEvent.MAP_CLEARED:
                this.scoreMapClear();
                break;
            case ScoreEvent.DEFEAT_ENEMY:
                this.scoreDefeatEnemy();
                break;
        }
    },

    reset: function() {
        this.log = [];
        this.score = 0;
    },

    /**
     * Score clearing a map
     *
     * Updates this.score with following points:
     *   - Base: value of GameConstants.SCORE_MAP_CLEAR
     *   - Bonus: number of rounds left * GameConstants.SCORE_ROUNDS_LEFT_MODIFIER
     *   - Bonus: amount of HP left * GameConstants.SCORE_HP_LEFT_MODIFIER
     */
    scoreMapClear: function() {
        var state = this.params.state;
        var addPoints = GameConstants.SCORE_MAP_CLEAR;
        addPoints += state.game.map.roundLimit - state.game.round * GameConstants.SCORE_ROUNDS_LEFT_MODIFIER;
        addPoints += state.game.player.hp * GameConstants.SCORE_HP_LEFT_MODIFIER;
        this.score += addPoints;
        this.log.push({
            event: this.params.event,
            points: addPoints,
            variables: {
                finalRound: state.game.round,
                mapRoundLimit: state.game.map.roundLimit,
                playerHp: state.game.player.hp
            }
        });
    },

    /**
     * Score defeating an enemy
     *
     * Updates this.score with following points:
     *   - Base: points for killing the enemy derived from enemy unit stats
     */
    scoreDefeatEnemy: function() {
        if (this.params.units) {
            for (var i in this.params.units) {
                if (this.params.units[i].defeatPoints) {
                    this.score += this.params.units[i].defeatPoints;
                    this.log.push({
                        event: this.params.event,
                        points: this.params.units[i].defeatPoints,
                        variables: {unitType: this.params.units[i].type}
                    });
                }
            }
        }
    }
};

module.exports = ScoreManager;