module.exports = {
    FX_VIEWPORT_CANVAS_WIDTH: 1333, // 4:3 aspect ratio, needs to match canvas container div styling
    FX_VIEWPORT_CANVAS_HEIGHT: 1000, // 4:3 aspect ratio, needs to match canvas container div styling
    FX_VIEWPORT_MAX_ZOOM_FACTOR: 3.5,
    FX_VIEWPORT_MIN_ZOOM_FACTOR: 0.5,
    FX_VIEWPORT_DEFAULT_ZOOM_FACTOR: 1.5,
    FX_IMG_ROOT_DIR: "static/images/",
    FX_TEXTURES_ROOT_DIR: "static/images/textures/",
    // START TILE GRAPHICS
    FX_TILE_TEXTURE_FILE_LIST: "cement.png,dirt.png,grass.png,rock.png,sand.png,tree.png,wall.png,water.png",
    FX_TILE_WIDTH: 50, // px
    FX_TILE_HEIGHT: 50, // px
    FX_TILE_TEX_MAX_ALLOWED_LOAD_TIME_MILLI: 15000, // time in milliseconds we allow MapRenderer to stall while trying to load tile textures
    // END TILE GRAPHICS
    // START PLAYER GRAPHICS
    FX_PLAYER_FONT_CHARACTER: "@",
    FX_PLAYER_FONT_STYLE: "46px 'Courier New', sans-serif",
    FX_PLAYER_FONT_COLOR: "black",
    // END PLAYER GRAPHICS
    // START MAP GRAPHICS
    FX_MAP_EXIT_GLYPH: "/",
    FX_MAP_EXIT_GLYPH_STYLE: "46px 'Courier New', sans-serif",
    FX_MAP_EXIT_GLYPH_COLOR: "black",
    // END MAP GRAPHICS
    // START UNIT GRAPHICS
    FX_UNIT_GLYPH_STYLE: "46px 'Courier New', sans-serif",
    FX_UNIT_GLYPH_COLOR: "black",
    // END UNIT GRAPHICS
    // START PLAYER PROJECTILE GRAPHICS
    FX_PLAYER_PROJECTILE_RADIUS: 3,
    FX_PLAYER_PROJECTILE_COLOR: "black",
    // END PROJECTIVE GRAPHICS
    // START PLAYER MAGIC GRAPHICS
    FX_PLAYER_MAGIC_RADIUS: 25,
    FX_PLAYER_MAGIC_COLOR: "blue",
    // END PLAYER MAGIC GRAPHICS
    // START CREEP PROJECTILE GRAPHICS
    FX_CREEP_PROJECTILE_RADIUS: 3,
    FX_CREEP_PROJECTILE_COLOR: "black",
    // END CREEP PROJECTIVE GRAPHICS
    // START CREEP MAGIC GRAPHICS
    FX_CREEP_MAGIC_RADIUS: 25,
    FX_CREEP_MAGIC_COLOR: "blue"
    // END CREEP MAGIC GRAPHICS
};