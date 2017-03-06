var Game = require('./Game');
var ScoreManager = require('./ScoreManager');
var ScoreEvent = require('./ScoreEvent');
var GameConstants = require('./GameConstants');

var PLAYER = 'p';
var CREEPS = 'c';

// Polyfill for window.requestAnimationFrame
(function(){
    var lastTime = 0;

    function requestAnimPolyfill(func) {
        var currTime = (new Date()).getTime();
        var timeToWait = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { func(currTime + timeToWait); }, timeToWait);
        lastTime = currTime + timeToWait;
        return id;
    }

    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimPolyfill;
})();

function GameRunner(requestRenderUI, requestRenderGame) {
    this.requestRenderUI = requestRenderUI;
    this.requestRenderGame = requestRenderGame;
    this.lastTurn = CREEPS;
    this.loopSpeed = 300;
    this.paused = false;
    this.playerCreator = null;
    this.scoreManager = new ScoreManager();
    this.lastTurnStartTimestamp = null;
    this.animatingTurn = false;
    this.animationFrameStep = 1;
    this.lastAnimatedMapID = null;
}

GameRunner.prototype = {
    createNewGame: function(level, tutorial) {
        this.game = new Game(this.playerCreator, level, tutorial);
    },
    setPlayerCreator: function(playerCreator) {
        this.playerCreator = playerCreator;
    },
    play: function() {
        this.paused = false;
        this.lastTurnStartTimestamp = null;
        this._runLogicLoop();
    },
    pause: function() {
        this.paused = true;
        this.requestRenderUI(this.game);
    },
    setSpeed: function(speed) {
        this.loopSpeed = speed;
        this.animationFrameStep = Math.max(Math.floor(300/speed), 1);
    },
    _runLogicLoop: function(){
        if(this.paused) return;
        if(
            !this.animatingTurn && 
            (
                !this.lastTurnStartTimestamp || (new Date()).getTime() - this.lastTurnStartTimestamp > this.loopSpeed
            )
        ){
            this.lastTurnStartTimestamp = (new Date()).getTime();
            if (this.gameOver()) {
                this.paused = true;
                return;
            }
            this.takeTurn();
            this.requestRenderUI(this.game);
            this._animateTurn();
        }
        window.requestAnimationFrame(function(timestamp) {
                this._runLogicLoop();
        }.bind(this));
    },
    step: function() {
        if(!this.animatingTurn){
            this.takeTurn();
            this.requestRenderUI(this.game);
            this._animateTurn();
        }
    },
    takeTurn: function() {
        if (this.lastTurn === CREEPS) {
            this.game.upkeep();
            this.game.executePlayerTurn();
            var removedUnits = this.game.removeDeadUnits();
            if (removedUnits.length > 0) {
                this.scoreManager.updateScore({event: ScoreEvent.DEFEAT_ENEMY, state: this, units: removedUnits});
            }
            this.lastTurn = PLAYER;
        }  else {
            try {
                this.game.executeCreepTurns();
            } catch (e) {
                console.log(e);
            }
            this.lastTurn = CREEPS;
        }
    },
    getScore: function() {
        return this.scoreManager.getScore();
    },
    updateScore: function(params) {
        this.scoreManager.updateScore(params);
    },
    won: function() {
        return this.game.won();
    },
    gameOver: function() {
        return this.game.gameOver();
    },
    _animateTurn: function(){
        // this.requestRenderGame will be null if rendering with table is enabled
        if(!this.requestRenderGame) return;

        // Verify we have at least 1 player action or 1 unit action to animate.
        // Skip this check if this is the first call to animate for this map.
        if(!!this.lastAnimatedMapID && this.lastAnimatedMapID === this.game.id){
            var actionCount = 0,
                units = this.game.unitManager.units;
            if(this.game.player.action !== null) actionCount++;
            for(var i = 0; i < units.length; i++){
                if(units[i].action !== null){
                    actionCount++;
                    break;
                }
            }
            // No actions to animate, bail out
            if(actionCount === 0) return;
        }
        this.lastAnimatedMapID = this.game.id;

        this.animatingTurn = true;
        this.game.currAnimationFrame = 1;
        this.game.turn = this.lastTurn;
        this._animateTurnAux();
    },
    _animateTurnAux: function(){
        this.requestRenderGame(this.game);
        this.game.currAnimationFrame += this.animationFrameStep;
        if(this.game.currAnimationFrame <= GameConstants.GAMERUNNER_ANIMATION_FRAME_CNT){
            window.requestAnimationFrame(function(timestamp) {
                    this._animateTurnAux();
            }.bind(this));
        }else{
            this.animatingTurn = false;
            this.game.currAnimationFrame = null;
        }
    }
};

module.exports = GameRunner;