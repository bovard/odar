var GameConstants = require('../GameConstants');

module.exports = {
	linearlyInterpolate: function(startPoint, endPoint, step, totalSteps){
		var offset = endPoint.subtract(startPoint),
			fraction = step/totalSteps;
		offset.x(offset.x() * fraction);
		offset.y(offset.y() * fraction);
		return startPoint.add(offset);
	},
	drawGlyph: function(renderGL, position, glyph, fontStyle, color){
		renderGL.drawText({
			text: glyph,
			pos: position,
			fontStyle: fontStyle,
			style: color
		});
	},
	animateGlyphMove: function(renderGL, startPoint, endPoint, currAnimationFrame, glyph, fontStyle, color){
		var glyphAnimatedPos = this.linearlyInterpolate(startPoint, endPoint, currAnimationFrame, GameConstants.GAMERUNNER_ANIMATION_FRAME_CNT);
		this.drawGlyph(renderGL, glyphAnimatedPos, glyph, fontStyle, color);
		return glyphAnimatedPos;
	},
	animateGlyphMeleeAttack: function(renderGL, attackerPos, targetPos, currAnimationFrame, glyph, fontStyle, color){
		// First one third of animation frames, have unit charge forward to targetPos. For later two thirds of animation frames,
		// have unit retreat to attackerPos.
		var oneThirdFrameCnt = Math.floor(GameConstants.GAMERUNNER_ANIMATION_FRAME_CNT / 3),
			twoThirdsFrameCnt = Math.floor(2 * GameConstants.GAMERUNNER_ANIMATION_FRAME_CNT / 3);
		if(currAnimationFrame <= oneThirdFrameCnt){
			var glyphAnimatedPos = this.linearlyInterpolate(attackerPos, targetPos, currAnimationFrame, oneThirdFrameCnt);
		}else{
			var glyphAnimatedPos = this.linearlyInterpolate(targetPos, attackerPos, currAnimationFrame - oneThirdFrameCnt, twoThirdsFrameCnt);
		}
		this.drawGlyph(renderGL, glyphAnimatedPos, glyph, fontStyle, color);
	},
	animateGlyphRangedAttack: function(renderGL, attackerPos, targetPos, currAnimationFrame, radius, color){
		var projectileAnimatedPos = this.linearlyInterpolate(attackerPos, targetPos, currAnimationFrame, GameConstants.GAMERUNNER_ANIMATION_FRAME_CNT);
		renderGL.drawCircle(
			{
				center: projectileAnimatedPos,
				radius: radius,
				lineWidth: 2,
				lineStyle: color
			}
		);
	},
	animateGlyphMagicAttack: function(renderGL, attackerPos, targetPos, currAnimationFrame, radius, color){
		var projectileAnimatedPos = this.linearlyInterpolate(attackerPos, targetPos, currAnimationFrame, GameConstants.GAMERUNNER_ANIMATION_FRAME_CNT),
			animPercentComplete = currAnimationFrame / GameConstants.GAMERUNNER_ANIMATION_FRAME_CNT;
		renderGL.drawCircle(
			{
				center: projectileAnimatedPos,
				radius: radius * animPercentComplete,
				lineWidth: 20,
				lineStyle: color
			}
		);
	}
};