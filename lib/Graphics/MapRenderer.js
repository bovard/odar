var GraphicsConstants = require('./GraphicsConstants');
var Point = require('./Point');
var ImageManager = require('./ImageManager');

function _renderEntireMap(renderGL, mapState){
	var tileHeight = GraphicsConstants.FX_TILE_WIDTH,
		tileWidth = GraphicsConstants.FX_TILE_HEIGHT; 
	for(var rowi = 0; rowi < mapState.height; rowi++){
		for(var coli = 0; coli < mapState.width; coli++){
			var tile = mapState.terrain[rowi][coli],
				tileX = coli * tileWidth,
				tileY = rowi * tileHeight,
				tileImg = this.tileTextureMgr.get(tile.name.toLowerCase());
			renderGL.drawImage({
				img: tileImg,
				centerPoint: new Point(0,0),
				target: new Point(tileX, tileY),
				alpha: 0.5
			});
		}
	}
}

function _renderVisibleTiles(renderGL, mapState, playerState, playerRenderer){
	var tileHeight = GraphicsConstants.FX_TILE_WIDTH,
		tileWidth = GraphicsConstants.FX_TILE_HEIGHT,
		playerSightLength = Math.sqrt(playerState.sensorRadiusSquared),
		startRow = Math.max(0, playerState.location.y - playerSightLength),
		endRow   = Math.min(mapState.height - 1, playerState.location.y + playerSightLength),
		startCol = Math.max(0, playerState.location.x - playerSightLength),
		endCol   = Math.min(mapState.width - 1, playerState.location.x + playerSightLength);
	for(var rowi = startRow; rowi <= endRow; rowi++){
		for(var coli = startCol; coli <= endCol; coli++){
			if(playerRenderer.isTileVisibleToPlayer(rowi, coli, playerState)){
				var tile = mapState.terrain[rowi][coli],
					tileX = coli * tileWidth,
					tileY = rowi * tileHeight,
					tileImg = this.tileTextureMgr.get(tile.name.toLowerCase());
				renderGL.drawImage({
					img: tileImg,
					centerPoint: new Point(0,0),
					target: new Point(tileX, tileY)
				});
			}
		}
	}
}

function _renderMapExit(renderGL, mapState){
	var exitPos = this.getCanvasPosFromMapPos(mapState.exit, mapState);
	renderGL.drawText({
		text: GraphicsConstants.FX_MAP_EXIT_GLYPH,
		pos: exitPos,
		fontStyle: GraphicsConstants.FX_MAP_EXIT_GLYPH_STYLE,
		style: GraphicsConstants.FX_MAP_EXIT_GLYPH_COLOR
	});
}

function MapRenderer(){
	// Build image metadata obj for tile textures to initialize new ImageManager instance with
	var tileTextureFileNames = GraphicsConstants.FX_TILE_TEXTURE_FILE_LIST.split(",");
	var tileTextureFileNamesWithoutExt = tileTextureFileNames.map(function(fileName){ return fileName.split(".")[0]; });
	var imageMetadata = [];
	for(var i = 0; i < tileTextureFileNames.length; i++){
		imageMetadata.push({
			name: tileTextureFileNamesWithoutExt[i],
			path: GraphicsConstants.FX_TEXTURES_ROOT_DIR + tileTextureFileNames[i]
		});
	}
	this.tileTextureMgr = new ImageManager(imageMetadata, true);

	this.cachedMapImage = null;
	this.lastRenderedMapID = null;
}

MapRenderer.prototype.render = function(renderGL, gameState, playerRenderer){
	// Block rendering until all tile texture images have been loaded or 
	// GraphicsConstants.FX_TILE_TEX_MAX_ALLOWED_LOAD_TIME_MILLI has elapsed, whichever comes first
	var then = (new Date()).getTime();
	while(
		!this.tileTextureMgr.allImagesLoaded() && (new Date()).getTime() - then < GraphicsConstants.FX_TILE_TEX_MAX_ALLOWED_LOAD_TIME_MILLI
	){
		// Stall while tile textures are loading
	}

	// Only render map as often as we need to, since it's relatively expensive. We cache it after the 
	// first render and subsequently just render it using the cached image.
	if(!this.cachedMapImage || this.lastRenderedMapID != gameState.id){
		_renderEntireMap.call(this, renderGL, gameState.map);
		// Only cache map once all tile textures have loaded
		if(this.tileTextureMgr.allImagesLoaded()){
			this.cachedMapImage = renderGL.getCanvasAsImageData();
		}
	}else{
		renderGL.setCanvasFromImageData(this.cachedMapImage);
	}
	// Explicitly render visible tiles on top of the cached map image
	_renderVisibleTiles.call(this, renderGL, gameState.map, gameState.player, playerRenderer);
	_renderMapExit.call(this, renderGL, gameState.map);

	this.lastRenderedMapID = gameState.id;
};

MapRenderer.prototype.getCanvasPosFromMapPos = function(mapPos){
	if(mapPos == null) return null;
	var tileHeight = GraphicsConstants.FX_TILE_HEIGHT,
		tileWidth = GraphicsConstants.FX_TILE_WIDTH,
		tileHalfHeight = tileHeight / 2,
		tileHalfWidth = tileWidth / 2;
	return new Point(mapPos.x * tileWidth + tileHalfWidth, mapPos.y * tileHeight + tileHalfHeight);
};

module.exports = MapRenderer;