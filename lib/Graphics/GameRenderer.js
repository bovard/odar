var MapRenderer = require('./MapRenderer');
var PlayerRenderer = require('./PlayerRenderer');
var UnitRenderer = require('./UnitRenderer');
var GraphicsLibrary = require('./GraphicsLibrary');
var GraphicsConstants = require('./GraphicsConstants');
var Point = require('./Point');

function GameRenderer(viewportCanvas){
	this.viewportCanvas = viewportCanvas;
	this.viewportGL = new GraphicsLibrary(viewportCanvas);
	this.renderCanvas = null;
	this.renderGL = null;

	this.zoomFactor = 1.5;

	this.mapRenderer = new MapRenderer();
	this.playerRenderer = new PlayerRenderer();
	this.unitRenderer = new UnitRenderer();
}

GameRenderer.prototype.render = function(gameState){
	// Find out the required pixel dimensions for the canvas based on the map row
	// and column count. If it differs from the current render canvas, recreate it
	// to satisfy the new requirements. Then instantiate a new GraphicsLibrary to 
	// draw to it.
	var reqRenderDim = this.getReqRenderCanvasDimsFromMapState(gameState.map);
	if(
		!this.renderCanvas || 
		this.renderCanvas.width != reqRenderDim.width ||
		this.renderCanvas.height != reqRenderDim.height
	){
		this.renderCanvas = document.createElement('canvas');
		this.renderCanvas.width = reqRenderDim.width;
		this.renderCanvas.height = reqRenderDim.height;
		this.renderGL = new GraphicsLibrary(this.renderCanvas);
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
};

GameRenderer.prototype.getReqRenderCanvasDimsFromMapState = function(mapState){
	return {
		width: mapState.width * GraphicsConstants.FX_TILE_WIDTH,
		height: mapState.height * GraphicsConstants.FX_TILE_HEIGHT
	};
};

GameRenderer.prototype.setZoom = function(zoomFactor){
	this.zoomFactor = zoomFactor;
};

module.exports = GameRenderer;