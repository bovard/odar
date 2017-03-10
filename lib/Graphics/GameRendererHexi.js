var MapRenderer = require('./MapRenderer');
var PlayerRenderer = require('./PlayerRenderer');
var UnitRenderer = require('./UnitRenderer');
var GraphicsLibrary = require('./GraphicsLibrary');
var GraphicsConstants = require('./GraphicsConstants');
var Point = require('./Point');

var BG_TERRAIN_ATLAS = GraphicsConstants.FX_ATLAS_ROOT_DIR + "terrain.json";
var OBJECTS_ATLAS = GraphicsConstants.FX_ATLAS_ROOT_DIR + "objects.json";
var loadStuff = [BG_TERRAIN_ATLAS, OBJECTS_ATLAS];

var CEMENT = "cement",
    DIRT = "dirt",
    ROCK = "rock",
    SAND = "sand",
    WALL = "wall";

//our instance of the game renderer.
var g = null;
var all_sprites = [];
var tiles = [];
var player = null;
var monsters = [];
var camera = null;

//these need to be somewhere besides attached to GameRenderer instances
//so that when things get passed around to hexi they are still visible and
//not part of a class that they can't get to.
var externalSetupCallback;
var setup = function() {
    //do stuff that needs to be done here after setup.
    this.scaleToWindow();

    //Create some keyboard objects
    leftArrow = g.keyboard(37);
    upArrow = g.keyboard(38);
    rightArrow = g.keyboard(39);
    downArrow = g.keyboard(40);

    //Assign key `press` and release methods that
    //show and play the elf's different states
    leftArrow.release = function () {
        if (player) {
            player.setPosition(player.x - GraphicsConstants.FX_TILE_WIDTH, player.y);
            camera.follow(player);
        }
    };
    upArrow.release = function () {
        if (player) {
            player.setPosition(player.x, player.y - GraphicsConstants.FX_TILE_HEIGHT);
            camera.follow(player);
        }
    };
    rightArrow.release = function () {
        if (player) {
            player.setPosition(player.x + GraphicsConstants.FX_TILE_WIDTH, player.y);
            camera.follow(player);
        }
    };
    downArrow.release = function () {
        if (player) {
            player.setPosition(player.x , player.y + GraphicsConstants.FX_TILE_HEIGHT);
            camera.follow(player);
        }
    };
  
    if (externalSetupCallback) {
        externalSetupCallback();
    }
}


function GameRendererHexi(width, height, setupCallback) {
    this.height = height;
    this.width = width;
    if (setupCallback) {
        externalSetupCallback = setupCallback;
    }

    this.mapRenderer = new MapRenderer();
    this.playerRenderer = new PlayerRenderer();
    this.unitRenderer = new UnitRenderer();

    g = hexi(this.width, this.height, setup, loadStuff);
    g.backgroundColor = "black";
    g.start();
    this.gameScene = g.group();
    this.state = null;
};

GameRendererHexi.prototype = {
    showLoader: function() {
        g.loadingBar();
    },
    play: function() {
        //waiting for clicks and whatnot.
        // g.move(all_sprites);
    },
    load: function() {
        g.loadingBar();
    },
    render: function(gameState) {
        // Find out the required pixel dimensions for the canvas based on the map row
        // and column count. If it differs from the current render canvas, recreate it
        // to satisfy the new requirements. Then instantiate a new GraphicsLibrary to 
        // draw to it.
        g.state = this.play;
        var reqRenderDim = this.getReqRenderCanvasDimsFromMapState(gameState.map);
        if(
            g.width != reqRenderDim.width ||
            g.height != reqRenderDim.height
        ){
            g.width = reqRenderDim.width;
            g.height = reqRenderDim.height;
        }

        //set up this camera so we can automatically follow our player character around as it
        //moves.
        camera = g.worldCamera(g.stage, reqRenderDim.width, reqRenderDim.height);

        //
        // Render game state to render canvas.
        //

        // this.renderGL.clearCanvas();
        this.mapRenderer.render(
            this, 
            gameState, 
            this.playerRenderer);
        this.playerRenderer.render(
            this,
            gameState.player, 
            this.mapRenderer, 
            gameState.currAnimationFrame,
            gameState.turn === 'p');
        this.unitRenderer.render(
            this, 
            gameState.unitManager.units, 
            this.mapRenderer,
            gameState.player,
            this.playerRenderer,
            gameState.currAnimationFrame);
    },
    getReqRenderCanvasDimsFromMapState: function(mapState){
        return {
            width: mapState.width * GraphicsConstants.FX_TILE_WIDTH,
            height: mapState.height * GraphicsConstants.FX_TILE_HEIGHT
        };
    },
    drawImage: function(img, centerPoint, target, alpha) {
        var sprite = g.sprite(img);
        sprite.setPosition(target.x(), target.y());
        this.gameScene.addChild(sprite);
        
        //returns hexi sprite
        return sprite;
    },
    drawMapImage: function(img, centerPoint, target, alpha) {
        var tile = this.drawImage(img, centerPoint, target, alpha);
        tiles.push(tile);
    },
    drawText: function(text, pos, fontStyle, color) {
        var text = g.text(text, fontStyle, color, pos.x(), pos.y());
        this.gameScene.addChild(text);
        var tileHeight = GraphicsConstants.FX_TILE_HEIGHT,
            tileWidth = GraphicsConstants.FX_TILE_WIDTH;

        //let's make sure the sprite is centered in it's square.
        text.setPosition(text.x + (tileWidth - text.width)/2, text.y);

        //returns a hexi sprite.
        return text;
    },
    drawPlayer: function(text, pos, fontStyle, color) {
        //If we already have a sprite for the player, let's just set it to the new
        //location, otherwise we can make one.
        if (!player) {
            var p = this.drawText(text, pos, fontStyle, color);
            player = p;

            //now make sure we're going to keep the view centered on the player.
            camera.centerOver(player);
            camera.follow(player);
        } else {
            player.setPosition(pos.x(), pos.y());
        }
    }
};

module.exports = GameRendererHexi;