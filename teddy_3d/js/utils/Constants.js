// ===== Colors (Three.js hex) =====
export const COLORS = {
    // Scene
    BG_DARK:        0x2D1B4E,
    BG_MEDIUM:      0x3E2769,
    FOG:            0x1A0F2E,
    AMBIENT_LIGHT:  0x6644AA,
    DIR_LIGHT:      0xFFDDEE,

    // Teddy
    TEDDY_BODY:     0xA0522D,
    TEDDY_LIGHT:    0xCD853F,
    TEDDY_DARK:     0x6B3410,
    TEDDY_NOSE:     0x1A1A1A,
    TEDDY_EYE:      0x1A1A1A,
    TEDDY_EYE_SHINE:0xFFFFFF,
    TEDDY_MOUTH:    0xFF6B9D,
    TEDDY_BOWTIE:   0xFF4757,

    // Floor
    FLOOR_STONE:    0x4A3662,
    FLOOR_STONE_ALT:0x3E2D55,
    FLOOR_EDGE:     0x2D1B4E,

    // Walls
    WALL_MAIN:      0x3A2555,
    WALL_TRIM:      0x6B4C9A,

    // Decorations
    CANDLE_FLAME:   0xFF8C42,
    CANDLE_WAX:     0xFFF5F5,
    WEB_COLOR:      0xCCCCCC,
    PUMPKIN:        0xFF8C42,
    PUMPKIN_FACE:   0x1A1A1A,
    PORTRAIT_FRAME: 0x6B3410,
    CLOCK_FACE:     0x2A1810,
    CLOCK_HANDS:    0xC9A84C,
    CLOCK_RING:     0x6B3410,
    TORCH_BRACKET:  0x555555,
    TEDDY_BLUSH:    0xFF9EC6,

    // Heart Girl
    HG_SKIN:        0xFFDBC4,
    HG_HAIR:        0x6B3410,
    HG_DRESS:       0xCC2244,
    HG_CROWN:       0xFFD700,
    HG_HEART:       0xFF4466,
    HG_SHOE:        0x1A1A1A,
    HG_BLUSH:       0xFF9EC6,
    HG_EYE:         0x1A1A1A,
    HG_EYE_SHINE:   0xFFFFFF,
    HG_MOUTH:       0xFF6B9D,

    // Enemies
    MUMMY_WRAP:     0xE8DCC8,
    MUMMY_EYE:      0xFF4757,
    ZOMBIE_SKIN:    0x7B9F35,
    ZOMBIE_DARK:    0x4A6B1A,
    BAT_BODY:       0x2D1B4E,
    BAT_WING:       0x3E2769,
    BAT_EYE:        0xFF4757,
    GHOST_BODY:     0xCCDDFF,
    GHOST_EYE:      0x1A1A1A,
    SPIDER_BODY:    0x1A1A1A,
    SPIDER_LEG:     0x333333,
    SPIDER_EYE:     0xFF4757,
    SPIDER_WEB:     0xCCCCCC,

    // Skeleton
    SKELETON_BONE:  0xF5F0E0,
    SKELETON_DARK:  0xD4C9A8,
    SKELETON_EYE:   0xFF4757,
    BONE_PROJ:      0xF5F0E0,

    // Jack-o-Lantern
    JACKO_BODY:     0xFF8C42,
    JACKO_FACE:     0xFFE066,
    JACKO_STEM:     0x4A6B1A,
    FIRE_PROJ:      0xFF4422,
    FIRE_INNER:     0xFFCC00,

    // Finish
    FINISH_BANNER:  0x7ED957,
    FINISH_POLE:    0xCD853F,
};

// ===== Dimensions =====
export const DIMS = {
    // Lanes
    LANE_WIDTH:     2.5,
    LANE_COUNT:     3,       // -1, 0, 1
    LANE_POSITIONS: [-2.5, 0, 2.5],

    // Floor segments
    SEGMENT_LENGTH: 8,
    SEGMENT_WIDTH:  10,
    FLOOR_Y:        0,

    // Walls
    WALL_HEIGHT:    6,
    WALL_OFFSET:    5.5,     // distance from center

    // Ceiling
    CEILING_HEIGHT: 6,

    // Teddy
    TEDDY_BODY_RADIUS: 0.45,
    TEDDY_HEIGHT:  1.4,

    // Enemies
    ENEMY_SIZE:    0.8,

    // Chunks
    CHUNKS_AHEAD:  15,
    CHUNKS_BEHIND: 3,

    // Finish line distance (segments from start)
    STAGE_LENGTH:  60,

    // Enemy movement
    ENEMY_WALK_SPEED: 1.5,
    ENEMY_TRACK_SPEED: 1.2, // lateral homing speed toward Teddy
};

// ===== Physics =====
export const PHYSICS = {
    GRAVITY:          -25,
    JUMP_VELOCITY:     8,
    JUMP_HOLD_FORCE:   8,      // extra upward while holding
    JUMP_HOLD_TIME:    0.2,    // seconds you can hold for extra height
    MAX_JUMP_Y:        3.5,    // max height above GROUND_Y
    LANE_SWITCH_DURATION: 0.12, // seconds for smooth lane switch
    MOVE_SPEED:        8,       // continuous lateral speed (units/s)
    GROUND_Y:          0.7,    // Teddy's base Y on ground
};

// ===== Gameplay =====
export const GAMEPLAY = {
    MAX_HEARTS:        3,
    MAX_LIVES:         3,
    INVINCIBILITY_TIME:2.0,    // seconds after taking damage
    COUNTDOWN_SECONDS: 3,
    STAGE_COMPLETE_DELAY: 3.0, // seconds showing stage complete
    TOTAL_STAGES:      4,
};

// ===== Stage Configs (indexed 0-3) =====
export const STAGES = [
    {
        name: 'Stage 1 - The Entrance',
        speed: 8,
        enemyChance: 0.55,
        multiEnemyChance: 0.15,
        enemies: ['mummy', 'bat', 'jackolantern'],
        fogDensity: 0.04,
        fogColor: 0x1A0F2E,
    },
    {
        name: 'Stage 2 - The Hallways',
        speed: 10,
        enemyChance: 0.65,
        multiEnemyChance: 0.25,
        enemies: ['mummy', 'bat', 'zombie', 'ghost', 'jackolantern'],
        fogDensity: 0.045,
        fogColor: 0x1A1030,
    },
    {
        name: 'Stage 3 - The Dungeon',
        speed: 12,
        enemyChance: 0.75,
        multiEnemyChance: 0.35,
        enemies: ['mummy', 'bat', 'zombie', 'ghost', 'spider', 'skeleton', 'jackolantern'],
        fogDensity: 0.05,
        fogColor: 0x150D28,
    },
    {
        name: 'Stage 4 - The Escape',
        speed: 14,
        enemyChance: 0.85,
        multiEnemyChance: 0.45,
        enemies: ['mummy', 'bat', 'zombie', 'ghost', 'spider', 'skeleton', 'jackolantern'],
        fogDensity: 0.055,
        fogColor: 0x100A20,
    },
];
