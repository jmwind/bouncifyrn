import {Ball, AimLine, BoxTile, BallPowerUp} from './renderers';
import Utils from './utils';
import Levels from './brick_levels';
import {Config} from './config';

function speedUpBalls(entities, speed_multiplier) {
  Object.keys(entities).forEach(ballId => {
    let ball = entities[ballId];
    if (!ballId.startsWith('ball')) {
      return;
    }
    if (ball.state === Config.STOPPED) {
      return;
    }
    ball.speed.x *= speed_multiplier;
    ball.speed.y *= speed_multiplier;
  });
}

function collidesWithBox(entities, ball) {
  let boxes = Object.keys(entities).filter(key => key.startsWith('box'));
  for (var boxId in boxes) {
    let box = entities[boxes[boxId]];
    if (box.explode) {
      continue;
    }

    let box_y = Utils.rowToTopPosition(box.row) - Config.BOX_TILE_SPACE;
    let box_x = Utils.colToLeftPosition(box.col) - Config.BOX_TILE_SPACE;
    let box_size = Config.BOX_TILE_SIZE + Config.BOX_TILE_SPACE + 2;
    let next_position = Utils.newPosition(
      ball.position.x + (ball.speed.x + 5) * ball.direction.x,
      ball.position.y + (ball.speed.y + 5) * ball.direction.y,
    );
    let collision = Config.NO_COLISION;
    if (
      next_position.x >= box_x &&
      next_position.x <= box_x + box_size &&
      ball.position.y >= box_y &&
      ball.position.y <= box_y + box_size
    ) {
      collision = Config.SIDE;
    } else if (
      ball.position.x >= box_x &&
      ball.position.x <= box_x + box_size &&
      next_position.y >= box_y &&
      next_position.y <= box_y + box_size
    ) {
      collision = Config.TOP_BOTTOM;
    }

    if (collision !== Config.NO_COLISION) {
      if (box.type && box.type === 'powerup') {
        collision = Config.NO_COLISION;
        if (!box.falling) {
          entities.scorebar.new_balls++;
          box.falling = true;
        }
      } else {
        box.hits--;
        entities.floor.current_hits++;
        if (box.hits <= 0) {
          box.explode = true;
        }
        return collision;
      }
    }
  }

  return Config.NO_COLISION;
}

function moveToNextLevelWithDelay(entities, dispatch) {
  let delay = 100;
  if (entities.scorebar.new_balls > 0) {
    // if powerups are on the floor, wait a bit longer for animation
    // before going to next level
    delay = 750;
    animateFallenPowerups(entities);
  }
  setTimeout(() => {
    moveToNextLevel(entities, dispatch);
  }, delay);
}

export function moveToNextLevel(entities, dispatch) {
  const {scorebar, ball, speedbutton} = entities;
  let boxes = Object.keys(entities).filter(key => key.startsWith('box'));
  let max_row = 0;

  // clean-up and reset
  scorebar.state = Config.STOPPED;
  speedbutton.available = false;
  speedbutton.speed = 1;
  scorebar.balls_in_play = 0;
  scorebar.balls += entities.scorebar.new_balls;
  scorebar.new_balls = 0;
  // save next start position to ball trail
  ball.start = Utils.clonePosition(ball.position);
  deleteFallenBallPowerups(entities);

  // advance boxes still in the game
  let dead_boxes = [];
  for (var boxId in boxes) {
    let box = entities[boxes[boxId]];
    if (box) {
      if (box.explode) {
        dead_boxes.push(boxes[boxId]);
      } else {
        if (scorebar.mode === Config.MODE_LINES && ++box.row > max_row) {
          max_row = box.row;
        }
      }
    }
  }
  dead_boxes.forEach(id => {
    delete entities[id];
  });
  // recalculate the boxes that are left
  boxes = Object.keys(entities).filter(key => key.startsWith('box'));

  let gameover = false;
  if (scorebar.mode === Config.MODE_LINES && max_row > Config.ROWS) {
    gameover = true;
  } else if (scorebar.mode === Config.MODE_BRICKS && boxes.length > 10) {
    gameover = true;
  }
  if (gameover) {
    cleanUpAfterGame(entities);
    dispatch({type: 'game-over', score: scorebar.level});
    return;
  }

  // Keep going to next level
  scorebar.level++;
  if (scorebar.mode === Config.MODE_BRICKS) {
    // clear all boxes and add entire new level
    for (var boxId in boxes) {
      delete entities[boxes[boxId]];
    }
    // each new box level will show a new pattern and give the player
    // more balls but with the caveat that each box tile will have
    // more hits required.
    scorebar.balls += 25;
    let level = Levels[Utils.randomValueRounded(0, Levels.length - 1)];
    for (let j = 0; j < Config.ROWS - 1; j++) {
      for (let i = 0; i < Config.COLUMS; i++) {
        if (level[j][i] === 0) {
          continue;
        }
        let key = Utils.randomKey();
        let new_hits = Utils.randomValueRounded(3, scorebar.balls / 2);
        entities['box' + key] = {
          row: j + 1,
          col: i,
          explode: false,
          explosionComplete: false,
          hits: new_hits,
          renderer: BoxTile,
        };
      }
    }
  } else {
    // create new row of boxes and power-ups
    let powerup = false;
    let cols = Config.COLUMS;
    for (let i = 0; i < cols; i++) {
      let key = Utils.randomKey();
      let col = i;
      let new_hits = Utils.randomValueRounded(
        scorebar.balls,
        scorebar.balls * 3,
      );
      if (Utils.randomRoll(70)) {
        if (!powerup && (Utils.randomRoll(50) || i === cols - 1)) {
          entities['box' + key] = {
            row: 1,
            col: col,
            collecting: false,
            type: 'powerup',
            renderer: BallPowerUp,
          };
          powerup = true;
        } else {
          entities['box' + key] = {
            row: 1,
            col: col,
            explode: false,
            explosionComplete: false,
            hits: new_hits,
            renderer: BoxTile,
          };
        }
      }
    }
  }
  countPointsInLevel(entities);
}

function countPointsInLevel(entities) {
  let boxes = Object.keys(entities).filter(key => key.startsWith('box'));
  let total_hits = 0;
  for (var boxId in boxes) {
    let box = entities[boxes[boxId]];
    if (box.hits) {
      total_hits += box.hits;
    }
  }
  entities.floor.total_hits = total_hits;
  entities.floor.current_hits = 0;
}

function deleteFallenBallPowerups(entities) {
  let boxes = Object.keys(entities).filter(key => key.startsWith('box'));
  for (var boxId in boxes) {
    let box = entities[boxes[boxId]];
    if (box.type && box.type === 'powerup' && box.falling) {
      delete entities[boxes[boxId]];
    }
  }
}

function cleanUpAfterGame(entities) {
  Object.keys(entities).forEach(id => {
    if (id.startsWith('box')) {
      delete entities[id];
    } else if (id.startsWith('ball') && !id === 'ball') {
      delete entities[id];
    }
  });
}

function animateFallenPowerups(entities) {
  const {ball} = entities;
  let boxes = Object.keys(entities).filter(key => key.startsWith('box'));
  for (var boxId in boxes) {
    let box = entities[boxes[boxId]];
    if (box.type && box.type === 'powerup' && box.falling) {
      entities[boxes[boxId]].collecting = true;
      entities[boxes[boxId]].slidePosition = ball.position.x;
    }
  }
}

const StartGame = (entities, dispatch) => {
  const {scorebar} = entities;
  if (scorebar.state === Config.STOPPED && scorebar.level === 0) {
    moveToNextLevel(entities, dispatch);
  }
  return entities;
};

const MoveBall = (entities, {screen, dispatch}) => {
  const {scorebar, floor} = entities;
  Object.keys(entities).forEach(ballId => {
    let ball = entities[ballId];
    if (!ballId.startsWith('ball')) {
      return;
    }
    if (ball.state === Config.STOPPED) {
      return;
    }

    let next_position = Utils.newPosition(
      ball.position.x + ball.speed.x * ball.direction.x,
      ball.position.y + ball.speed.y * ball.direction.y,
    );
    let next_direction = Utils.clonePosition(ball.direction);

    let isCollision = collidesWithBox(entities, ball);

    // Test box collision before walls
    if (isCollision === Config.SIDE) {
      next_direction.x *= -1;
    } else if (
      next_position.x > screen.width - Config.RADIUS ||
      next_position.x < 0
    ) {
      next_direction.x *= -1;
    }

    if (isCollision === Config.TOP_BOTTOM) {
      next_direction.y *= -1;
    } else if (next_position.y < Config.RADIUS + scorebar.height) {
      next_direction.y *= -1;
    }

    if (next_position.y > floor.height - Config.RADIUS) {
      scorebar.balls_returned++;
      // there's only one ball that is the tracer ball and will remain on the floor while
      // all other balls will dissapear when they hit the floor.
      if (ballId === 'ball') {
        ball.state = Config.STOPPED;
        // ensure rested nicely on top of floor or not outside of sidewalls
        if (next_position.x > screen.width - Config.RADIUS * 2) {
          next_position.x = screen.width - Config.RADIUS * 2;
        }
        if (next_position.x < 0) {
          next_position.x = Config.RADIUS * 2;
        }
        ball.position = Utils.newPosition(next_position.x, ball.start.y);
      } else {
        // remove all balls that aren't the lead ball when they hit they floor
        delete entities[ballId];
      }

      // decide when all balls have returned and stop the current level
      if (scorebar.balls_returned >= scorebar.balls) {
        moveToNextLevelWithDelay(entities, dispatch);
      }
    } else {
      next_position = Utils.newPosition(
        ball.position.x + ball.speed.x * next_direction.x,
        ball.position.y + ball.speed.y * next_direction.y,
      );
      // all is good, update new position now
      ball.position = next_position;
      ball.direction = next_direction;
    }
  });

  return entities;
};

const accelerationX = 1;
const accelerationY = 10;
const minLength = 30;
const maxLength = 800;
const minDeg = -88;
const maxDeg = 88;

const AimBallsStart = (entities, {touches, screen}) => {
  const {scorebar, ball} = entities;
  if (scorebar.state === Config.STOPPED) {
    touches
      .filter(x => x.type === 'start')
      .forEach(t => {
        // aim vector is the drag gestuve movement while the aim line is the opposite vector
        // from the ball towards the direction that the ball will be moving
        let drag_vector = {};
        drag_vector.start = {x: t.event.pageX, y: t.event.pageY};
        drag_vector.delta = {x: 0, y: 0};
        drag_vector.final = {x: 0, y: 0};
        let aim_line = Utils.newPosition(
          ball.position.x + Config.RADIUS / 2,
          ball.position.y + Config.RADIUS / 2,
        );
        entities.aimline = {
          start: aim_line,
          end: aim_line,
          drag_vector: drag_vector,
          renderer: AimLine,
        };
      });

    touches
      .filter(t => t.type === 'move')
      .forEach(t => {
        if (entities.aimline && t.delta) {
          const {aimline} = entities;
          // Track delta movements and allow variable acceleration per axis
          aimline.drag_vector.delta.x += t.delta.pageX * accelerationX;
          aimline.drag_vector.delta.y += t.delta.pageY * accelerationY;

          // Give the aimline a circular curvature, let the change in
          // y-axis delta control length and x-axis delta the degree of
          // the aim line.
          let length = Math.min(maxLength, aimline.drag_vector.delta.y);
          let deg = aimline.drag_vector.delta.x % 360;
          let x2 = length * Math.sin((deg * Math.PI) / 180);
          let y2 = length * Math.cos((deg * Math.PI) / 180);

          if (length > minLength && deg > minDeg && deg < maxDeg) {
            aimline.drag_vector.final = Utils.getPointsDeltas(
              {x: x2 + Config.RADIUS, y: y2 + Config.RADIUS},
              ball.position,
            );
            entities.aimline.end = aimline.drag_vector.final;
          } else {
            // Invalid aimline, revert
            aimline.drag_vector.final = aimline.drag_vector.start;
            entities.aimline.end = Utils.clonePosition(aimline);
          }
        }
      });
  }

  return entities;
};

const AimBallsRelease = (entities, {time, touches}) => {
  const {scorebar, ball, aimline} = entities;
  if (scorebar.state === Config.STOPPED && aimline && aimline.drag_vector) {
    touches
      .filter(t => t.type === 'end')
      .forEach(t => {
        let d = Utils.getDistance(
          aimline.drag_vector.start,
          aimline.drag_vector.final,
        );
        if (
          d > minLength &&
          aimline.drag_vector.start.y > scorebar.height &&
          ball.state === Config.STOPPED
        ) {
          let delta = Utils.getPointsDeltas(
            ball.position,
            aimline.drag_vector.final,
          );
          // Normalize vector
          ball.direction.y = delta.y / d;
          ball.direction.x = delta.x / d;
          ball.start_direction = Utils.clonePosition(ball.direction);
          // This should account for the difference in ball direction in the axes
          ball.speed.x = 10;
          ball.speed.y = 10;
          ball.start = Utils.clonePosition(ball.position);
          ball.state = Config.MOVING;
          ball.last_ball_start_time = time.current;
          scorebar.state = Config.STARTED;
          scorebar.balls_returned = 0;
          scorebar.balls_in_play = 1;
        }
        delete entities.aimline;
      });
  }
  return entities;
};

const CreateBallTail = (entities, {time}) => {
  const {scorebar, ball} = entities;
  if (
    scorebar.state === Config.STARTED &&
    scorebar.balls_in_play < scorebar.balls
  ) {
    // Controls the speed at which new balls are spawned when they start to shoot
    // from the floor
    if (time.current - ball.last_ball_start_time > 75 /* ms */) {
      let position = Utils.clonePosition(ball.start);
      let direction = Utils.clonePosition(ball.start_direction);
      let speed = Utils.clonePosition(ball.speed);
      entities['ball' + Utils.randomKey()] = {
        type: 'ball',
        state: Config.MOVING,
        color: 'white',
        position: position,
        renderer: Ball,
        speed: speed,
        direction: direction,
      };
      scorebar.balls_in_play++;
      ball.last_ball_start_time = time.current;
    }
  }
  return entities;
};

const SpeedUp = (entities, {touches, time}) => {
  const {scorebar, speedbutton, ball} = entities;
  if (
    scorebar.state === Config.STARTED &&
    time.current - ball.last_ball_start_time > 3000
  ) {
    speedbutton.available = true;
  }
  touches
    .filter(t => t.type === 'press')
    .forEach(t => {
      if (speedbutton.available) {
        let top = Utils.rowToTopPosition(speedbutton.row);
        let left = Utils.colToLeftPosition(speedbutton.column);
        let eventX = t.event.pageX;
        let eventY = t.event.pageY;
        if (
          eventX > left &&
          eventX < left + Config.BOX_TILE_SIZE &&
          eventY > top &&
          eventY < top + Config.BOX_TILE_SIZE
        ) {
          if (speedbutton.speed === 1) {
            speedbutton.speed = 1.5;
            speedUpBalls(entities, speedbutton.speed);
          } else if (speedbutton.speed === 1.5) {
            speedbutton.speed = 2;
            speedUpBalls(entities, speedbutton.speed);
          }
        }
      }
    });
  return entities;
};

/**
 * Easter egg which allows adding or removing balls by clicking hotspots at the
 * top of the screen in the scoreboard section. If the game is still in progress
 * the new balls will start moving as they are added. Also, to advance to another
 * level press in the middle of the scorebar.
 */
const SpawnBall = (entities, {touches, screen, dispatch}) => {
  const {scorebar} = entities;
  touches
    .filter(t => t.type === 'press')
    .forEach(t => {
      let increment = scorebar.balls < 100 ? 5 : 50;
      if (
        t.event.pageY < scorebar.height &&
        t.event.pageX > screen.width / 2 + 100
      ) {
        scorebar.balls += increment;
      } else if (
        t.event.pageY < scorebar.height &&
        t.event.pageX < screen.width / 2 - 100 &&
        scorebar.balls > increment
      ) {
        scorebar.balls -= increment;
      } else if (
        t.event.pageY < scorebar.height &&
        scorebar.balls_in_play === 0
      ) {
        moveToNextLevel(entities, dispatch);
      }
    });
  return entities;
};

export {
  StartGame,
  MoveBall,
  SpawnBall,
  AimBallsStart,
  AimBallsRelease,
  CreateBallTail,
  SpeedUp,
};
