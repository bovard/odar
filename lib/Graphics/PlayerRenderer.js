var GraphicsConstants = require('./GraphicsConstants');
var graphicsUtil = require('./GraphicsUtilities');

function PlayerRenderer(){
	this.currPlayerPos = null;
}

PlayerRenderer.prototype.render = function(renderGL, playerState, mapRenderer, currAnimationFrame, isPlayerTurn){
	var targetPos = mapRenderer.getCanvasPosFromMapPos(playerState.target),
		sourcePos = mapRenderer.getCanvasPosFromMapPos(playerState.source);
	this.currPlayerPos = mapRenderer.getCanvasPosFromMapPos(playerState.location);

	if(isPlayerTurn && currAnimationFrame != null){
		// Animate action
		switch(playerState.action){
			case "move":
				this.currPlayerPos = graphicsUtil.animateGlyphMove(
					renderGL, sourcePos, targetPos, currAnimationFrame, 
					GraphicsConstants.FX_PLAYER_FONT_CHARACTER, GraphicsConstants.FX_PLAYER_FONT_STYLE, GraphicsConstants.FX_PLAYER_FONT_COLOR);
				break;
			case "melee":
				graphicsUtil.animateGlyphMeleeAttack(
					renderGL, sourcePos, targetPos, currAnimationFrame,
					GraphicsConstants.FX_PLAYER_FONT_CHARACTER, GraphicsConstants.FX_UNIT_GLYPH_STYLE, GraphicsConstants.FX_UNIT_GLYPH_COLOR);
				break;
			case "ranged":
				graphicsUtil.animateGlyphRangedAttack(
					renderGL, sourcePos, targetPos, currAnimationFrame, GraphicsConstants.FX_PLAYER_PROJECTILE_RADIUS, GraphicsConstants.FX_PLAYER_PROJECTILE_COLOR
					);
				// Also draw glyph at current position
				graphicsUtil.drawGlyph(
					renderGL, this.currPlayerPos, GraphicsConstants.FX_PLAYER_FONT_CHARACTER, 
					GraphicsConstants.FX_PLAYER_FONT_STYLE, GraphicsConstants.FX_PLAYER_FONT_COLOR);
				break;
			case "magic":
				graphicsUtil.animateGlyphMagicAttack(
					renderGL, sourcePos, targetPos, currAnimationFrame, GraphicsConstants.FX_PLAYER_MAGIC_RADIUS, GraphicsConstants.FX_PLAYER_MAGIC_COLOR
					);
				// Also draw glyph at current position
				graphicsUtil.drawGlyph(
					renderGL, this.currPlayerPos, GraphicsConstants.FX_PLAYER_FONT_CHARACTER, 
					GraphicsConstants.FX_PLAYER_FONT_STYLE, GraphicsConstants.FX_PLAYER_FONT_COLOR);
				break;
			default:
				graphicsUtil.drawGlyph(
					renderGL, this.currPlayerPos, GraphicsConstants.FX_PLAYER_FONT_CHARACTER, 
					GraphicsConstants.FX_PLAYER_FONT_STYLE, GraphicsConstants.FX_PLAYER_FONT_COLOR);
		}
	}else{
		// Not player turn or not animating, so just draw glyph at current location
		graphicsUtil.drawGlyph(
			renderGL, this.currPlayerPos, GraphicsConstants.FX_PLAYER_FONT_CHARACTER, 
			GraphicsConstants.FX_PLAYER_FONT_STYLE, GraphicsConstants.FX_PLAYER_FONT_COLOR);
	}
};

PlayerRenderer.prototype.getPlayerLocInCanvas = function(){
	return this.currPlayerPos;
};

PlayerRenderer.prototype.isTileVisibleToPlayer = function(tileRow, tileCol, playerState){
	return Math.pow(tileRow - playerState.location.y, 2) + Math.pow(tileCol - playerState.location.x, 2) <= playerState.sensorRadiusSquared;
};

module.exports = PlayerRenderer;