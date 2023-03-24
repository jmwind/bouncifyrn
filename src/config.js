export var Config = {
  // Collision detection
  NO_COLISION: 0,
  SIDE: 1,
  TOP_BOTTOM: 2,
  ROWS: 10,
  COLUMS: 8,

  // Sizings
  RADIUS: 7,
  SCOREBOARD_HEIGHT: 90,
  BOX_TILE_SIZE: 40,
  BOX_TILE_SPACE: 6,
  FLOOR_HEIGHT: 640,
  FLOOR_HEIGHT_SIZE: 172,
  // 8x9 on most screens, but have to check

  // Game modes
  MODE_LINES: 100,
  MODE_BRICKS: 200,

  // Ball and game states
  MOVING: 100,
  STOPPED: 200,
  STARTED: 300,
};

export const COLORS = [
  '#DFB44F', // yellow 1-10
  '#8CB453', // green 11-20
  '#EA225E', // red 21-30,
  '#59B9F9', // light blue 31-50,
  '#265BF6', // darker blue 51-99,
  '#7112F5', // purple 100-150
  '#449b8e', // dull green 151+
];

export const FLOOR_BOX_POSITION =
  Config.FLOOR_HEIGHT - Config.BOX_TILE_SIZE + 10;
