
var GameConstants = {};

Object.defineProperties(GameConstants, {
    /* Attack constants */
    MIN_RANGED_ATTACK_RADIUS_SQUARED: {value: 16, writeable: false},
    MAX_RANGED_ATTACK_RADIUS_SQUARED: {value: 49, writeable: false},
    MAX_MAGIC_ATTACK_RADIUS_SQUARED: {value: 25, writeable: false},
    MAGIC_ATTACK_SPLASH_PERCENTAGE: {value: 0.75, writeable: false},
    MAX_MELEE_ATTACK_RADIUS_SQUARED: {value: 2, writeable: false},

    /* Sense constants */
    SENSE_EXIT_THRESHOLD: {value: 144, writeable: false},

    /* Player constants */
    PLAYER_MOVE_DELAY: {value: 2, writeable: false},
    PLAYER_HEAL_POWER: {value: 50, writeable: false},
    PLAYER_HEAL_DELAY: {value: 20, writeable: false},
    PLAYER_MELEE_POWER: {value: 20, writeable: false},
    PLAYER_MELEE_DELAY: {value: 2, writeable: false},
    PLAYER_MAGIC_POWER: {value: 8, writeable: false},
    PLAYER_MAGIC_DELAY: {value: 4, writeable: false},
    PLAYER_RANGED_POWER: {value:18, writeable: false},
    PLAYER_RANGED_DELAY: {value: 3, writeable: false},

    /* Score constants */
    SCORE_MAP_CLEAR: {value: 100, writeable: false},
    SCORE_ROUNDS_LEFT_MODIFIER: {value: 0.5, writeable: false},
    SCORE_HP_LEFT_MODIFIER: {value: 2, writeable: false},

    /* GameRunner constants */
    GAMERUNNER_ANIMATION_FRAME_CNT: {value: 24, writeable: false},

    /* Render Constants */
    RENDER_WITH_CANVAS: {value: true, writeable: false}

});


module.exports = GameConstants;
