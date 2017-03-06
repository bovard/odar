var GraphicsConstants = require('./GraphicsConstants');
var graphicsUtil = require('./GraphicsUtilities');

function UnitRenderer(){

}

UnitRenderer.prototype.render = function(renderGL, units, mapRenderer, playerState, playerRenderer, currAnimationFrame){
	for(var i = 0; i < units.length; i++){
		var unit = units[i];
		if(playerRenderer.isTileVisibleToPlayer(unit.location.y, unit.location.x, playerState)){
			var targetPos = mapRenderer.getCanvasPosFromMapPos(unit.target),
				sourcePos = mapRenderer.getCanvasPosFromMapPos(unit.source),
				currUnitPos = mapRenderer.getCanvasPosFromMapPos(unit.location);
			if(currAnimationFrame != null){
				switch(unit.action){
					case "move":
						graphicsUtil.animateGlyphMove(
							renderGL, sourcePos, targetPos, currAnimationFrame, 
							unit.type, GraphicsConstants.FX_UNIT_GLYPH_STYLE, GraphicsConstants.FX_UNIT_GLYPH_COLOR);
						break;
					case "melee":
						graphicsUtil.animateGlyphMeleeAttack(
							renderGL, sourcePos, targetPos, currAnimationFrame,
							unit.type, GraphicsConstants.FX_UNIT_GLYPH_STYLE, GraphicsConstants.FX_UNIT_GLYPH_COLOR);
						break;
					case "ranged":
						graphicsUtil.animateGlyphRangedAttack(
							renderGL, sourcePos, targetPos, currAnimationFrame, GraphicsConstants.FX_CREEP_PROJECTILE_RADIUS, GraphicsConstants.FX_CREEP_PROJECTILE_COLOR
							);
						// Also draw glyph at current position
						graphicsUtil.drawGlyph(
							renderGL, currUnitPos, unit.type,
							GraphicsConstants.FX_UNIT_GLYPH_STYLE, GraphicsConstants.FX_UNIT_GLYPH_COLOR);
						break;
					case "magic":
						graphicsUtil.animateGlyphMagicAttack(
							renderGL, sourcePos, targetPos, currAnimationFrame, GraphicsConstants.FX_CREEP_MAGIC_RADIUS, GraphicsConstants.FX_CREEP_MAGIC_COLOR
							);
						// Also draw glyph at current position
						graphicsUtil.drawGlyph(
							renderGL, currUnitPos, unit.type,
							GraphicsConstants.FX_UNIT_GLYPH_STYLE, GraphicsConstants.FX_UNIT_GLYPH_COLOR);
						break;
					default:
						graphicsUtil.drawGlyph(
							renderGL, currUnitPos, unit.type,
							GraphicsConstants.FX_UNIT_GLYPH_STYLE, GraphicsConstants.FX_UNIT_GLYPH_COLOR);
				}
			}else{
				// Not animating, just draw unit at current location
				graphicsUtil.drawGlyph(
					renderGL, currUnitPos, unit.type,
					GraphicsConstants.FX_UNIT_GLYPH_STYLE, GraphicsConstants.FX_UNIT_GLYPH_COLOR);
			}
		}
	}
};

module.exports = UnitRenderer;