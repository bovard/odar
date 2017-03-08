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


function GameRendererHexi(width, height, setupCallback) {
	this.height = height;
	this.width = width;
	if (setupCallback) {
		this.setupCallback = setupCallback;
	}
	this.g = hexi(this.width, this.height, this.setup, this.load);
	// this.g.scaleToWindow();
	this.g.start();
	this.gameScene = this.g.group();
	this.state = null;
};

GameRendererHexi.prototype = {
	setup: function() {
		this.state = this.play;
		//any additional stuff that needs to happen outside here.
		if (this.setupCallback) {
			this.setupCallback();
		}
	},
	showLoader: function() {
		this.g.loadingBar();
	},
	play: function() {
		//waiting for clicks and whatnot.
	},
	load: function() {
		this.g.loadingBar();
	},
	render: function(gamestate) {
		// Find out the required pixel dimensions for the canvas based on the map row
		// and column count. If it differs from the current render canvas, recreate it
		// to satisfy the new requirements. Then instantiate a new GraphicsLibrary to 
		// draw to it.
		var reqRenderDim = this.getReqRenderCanvasDimsFromMapState(gameState.map);
		if(
			this.g.width != reqRenderDim.width ||
			this.g.height != reqRenderDim.height
		){
			this.g.width = reqRenderDim.width;
			this.g.height = reqRenderDim.height;
		}

		//
		// Render game state to render canvas.
		//

		this.renderGL.clearCanvas();
		this.mapRenderer.render(
			this.renderGL, 
			gameState, 
			this.playerRenderer);
		this.playerRenderer.render(
			this.renderGL,
			gameState.player, 
			this.mapRenderer, 
			gameState.currAnimationFrame,
			gameState.turn === 'p');
		this.unitRenderer.render(
			this.renderGL, 
			gameState.unitManager.units, 
			this.mapRenderer,
			gameState.player,
			this.playerRenderer,
			gameState.currAnimationFrame);

		// Now that we've rendered the game state to the render canvas, we need to map a section of that canvas
		// to the viewport canvas via the viewportGL. We'll center that section around the player's location.
		var playerLocInRenderCanvas = this.playerRenderer.getPlayerLocInCanvas(),
			viewportCenter = new Point(this.viewportCanvas.width/2, this.viewportCanvas.height/2);
		this.viewportGL.fillCanvas("black");
		this.viewportGL.drawImage(
			{
				img: this.renderCanvas,
				centerPoint: playerLocInRenderCanvas,
				target: viewportCenter,
				scaleX: this.zoomFactor,
				scaleY: this.zoomFactor
			}
		);
	},
	getReqRenderCanvasDimsFromMapState: function(mapState){
		return {
			width: mapState.width * GraphicsConstants.FX_TILE_WIDTH,
			height: mapState.height * GraphicsConstants.FX_TILE_HEIGHT
		};
	},
	drawImage = function(img, centerPoint, target, alpha) {
        var sprite = this.g.sprite(img);
        sprite.setPosition(target.x, target.y);
        this.gameScene.addChild(sprite);
        return sprite;
	}
};

module.exports = GameRendererHexi;