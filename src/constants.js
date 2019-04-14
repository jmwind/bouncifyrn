export const Constants = {
    // Collision detection
    NO_COLISION: 0,
    SIDE: 1,
    TOP_BOTTOM: 2,
    LAST_ROW: 11,

    // Sizings
    RADIUS: 7,
    SCOREBOARD_HEIGHT: 90,
    BOX_TILE_SIZE: 40,
    BOX_TILE_SPACE: 6,
    FLOOR_HEIGHT: 640,

    // Game modes
    MODE_LINES: 100,
    MODE_BRICKS: 200,

    // Ball and game states
    MOVING: 100,
    STOPPED: 200, 
    STARTED: 300
};

export const COLORS = [
    "#DFB44F", // yellow 1-10
    "#8CB453", // green 11-20
    "#EA225E", // red 21-30,
    "#59B9F9", // light blue 31-50,
    "#265BF6", // darker blue 51-99,
    "#7112F5", // purple 100-150 
    "#449b8e", // dull green 151+
];