import _ from "lodash";
import { Ball, RADIUS, AimLine, rowToTopPosition, colToLeftPosition, BOX_TILE_SIZE, BoxTile, BallPowerUp, FLOOR_HEIGHT, SCOREBOARD_HEIGHT } from "./renderers";
import utils from "./utils";

// Collision detection
const NO_COLISION = 0;
const SIDE = 1;
const TOP_BOTTOM = 2;
const LAST_ROW = 11;

const randomKey = () =>
    (Math.random() + 1).toString(36).substring(7);

// Tracking of vector sizing between drag. Maybe this should be in some state instead?
let aim_vector = {
    start: [0,0],
    delta: [0,0],
    final: [0,0]
};
let last_ball_start_time = 0; 

function collidesWithBox(entities, ball) {
    let boxes = Object.keys(entities).filter(key => key.startsWith("box"));
    for(var boxId in boxes) {
         let box = entities[boxes[boxId]];
         if(box.explode) continue;
         let box_y = rowToTopPosition(box.row);
         let box_x = colToLeftPosition(box.col);
         let next_position = [
            ( ball.speed[0] * ball.direction[0] ),
            ( ball.speed[1] * ball.direction[1] )
        ];  
        let collision = NO_COLISION;
        
        if (ball.position[0] + RADIUS + next_position[0] > box_x && 
            ball.position[0] + next_position[0] < box_x + BOX_TILE_SIZE && 
            ball.position[1] + RADIUS > box_y && 
            ball.position[1] < box_y + BOX_TILE_SIZE) {                
                collision = SIDE;
        } else if (ball.position[0] + RADIUS > box_x && 
                ball.position[0] < box_x + BOX_TILE_SIZE && 
                ball.position[1] + RADIUS + next_position[1] > box_y && 
                ball.position[1] + next_position[1] < box_y + BOX_TILE_SIZE) {
                collision = TOP_BOTTOM;
        }

        if(collision != NO_COLISION) {
            if(box.type && box.type == "powerup") {
                collision = NO_COLISION;                
                if(!box.falling) {
                    entities.scorebar.new_balls++;  
                    box.falling = true;
                }                          
            } else {
                box.hits--;
                if(box.hits <= 0) {
                    box.explode = true;
                    //delete entities[boxes[boxId]];
                }
                return collision;
            }
        }
    }

    return NO_COLISION;
}

/**
 * TODO: there seems to be a case where a powerup spawns below a box tile?
 * TODO: need to start a new level with a random generated row
 */
export function moveToNextLevel(entities, dispatch) {
    let boxes = Object.keys(entities).filter(key => key.startsWith("box"));
    let max_row = 0;
    entities.scorebar.level++;
    for(var boxId in boxes) {
        let box = entities[boxes[boxId]];
        if(box.explode) {
            delete entities[boxes[boxId]];
        } else {
            if(++box.row > max_row) {
                max_row = box.row;
            }
        }
    }
    if(max_row >= LAST_ROW) {
        dispatch({ type: "game-over" });        
    }
    // random number of blocks for colums 0-7
    let num_new_blocks = Math.floor(Math.random() * 8);
    let new_cols = new Array(8);
    let powerups = 1;
    for (i = 0; i < num_new_blocks; i++) {
        let new_hits = Math.floor(Math.random() * entities.scorebar.balls) + (entities.scorebar.balls * 2);
        let key = randomKey();
        let col = -1;
        while(col == -1) {
            let next_col = Math.floor(Math.random() * 8);
            if(new_cols[next_col] != 1) {
                col = next_col;
            }
        }
        // pick one slot to be a power up
        Math.floor(Math.random() * num_new_blocks);
        if(powerups-- > 0) {
            entities["box" + key] = {
                row: 1, 
                col: col, 
                type: "powerup", 
                renderer: BallPowerUp, 
            };
        } else {
            entities["box" + key] = {
                row: 1, 
                col: col, 
                explode: false,
                hits: new_hits, 
                renderer: BoxTile, 
            };
        }
    }
}

function deleteFallenBallPowerups(entities) {
    let boxes = Object.keys(entities).filter(key => key.startsWith("box"));
    for(var boxId in boxes) {
        let box = entities[boxes[boxId]];
        if(box.type && box.type == "powerup" && box.falling) {
            delete entities[boxes[boxId]];
        }
    }
}

const StartGame = (entities, dispatch) => {    
    if(entities.scorebar.state == "stopped" && entities.scorebar.level == 0) {
        moveToNextLevel(entities, dispatch);
    }
    return entities;
};

const MoveBall = (entities, { screen, dispatch }) => {  
    Object.keys(entities).forEach(ballId => {
        let ball = entities[ballId];
        if(! ballId.startsWith("ball")) return;        
        if(ball.state != "moving") return;
        
        let next_position = [
            ball.position[0] + ( ball.speed[0] * ball.direction[0] ),
            ball.position[1] + ( ball.speed[1] * ball.direction[1] )
        ];
        let next_direction = [
            ball.direction[0],
            ball.direction[1]
        ];
        
        let isCollision = collidesWithBox(entities, ball);

        // Test box collision before walls
        if(isCollision == SIDE) {
            next_direction[0] *= -1; 
        } else if(next_position[0] > ( screen.width - RADIUS) || next_position[0] < 0) {
            next_direction[0] *= -1; 
        }
                
        if(isCollision == TOP_BOTTOM) {
            next_direction[1] *= -1; 
        } else if(next_position[1] < RADIUS + entities.scorebar.height) {
            next_direction[1] *= -1; 
        }

        if(next_position[1] > (entities.floor.height - RADIUS*2)) {        
            entities.scorebar.balls_returned++;
            // there's only one ball that is the tracer ball and will remain on the floor while
            // all other balls will dissapear when they hit the floor.
            if(ballId == "ball") {
                entities.ball.state = "stopped";
                // ensure rested nicely on top of floor
                entities.ball.position = [
                    next_position[0],
                    entities.ball.start[1],
                ];                
            } else {
                delete entities[ballId]; 
            }

            // decide when all balls have returned and stop the current level
            if(entities.scorebar.balls_returned >= entities.scorebar.balls) {
                entities.scorebar.state = "stopped";
                entities.scorebar.balls_in_play = 0;
                entities.scorebar.balls += entities.scorebar.new_balls;
                entities.scorebar.new_balls = 0;
                // save next start position to ball trail
                entities.ball.start = [
                    entities.ball.position[0],
                    entities.ball.position[1],
                ];
                deleteFallenBallPowerups(entities);
                moveToNextLevel(entities, dispatch);
            }
        } else {
            next_position = [
                ball.position[0] + ( ball.speed[0] * next_direction[0] ),
                ball.position[1] + ( ball.speed[1] * next_direction[1] )
            ];
            // all is good, update new position now
            ball.position = next_position; 
            ball.direction = next_direction;
        }
        
    });
    
    return entities;
};

const accelerationX = 1;
const accelerationY = 10;
const minLength = 20;
const maxLength = FLOOR_HEIGHT - SCOREBOARD_HEIGHT;
const minDeg = -88;
const maxDeg = 88;

const AimBallsStart = (entities, { touches, screen }) => {
    if(entities.scorebar.state == "stopped") {
        touches.filter(x => x.type === "start").forEach(t => {
            aim_vector.start = [t.event.pageX, t.event.pageY];
            aim_vector.delta = [0, 0];
            aim_vector.final = [0, 0];
            aim_line = [
                entities.ball.position[0] + RADIUS / 2,
                entities.ball.position[1] + RADIUS / 2
            ];
            entities["aimline"] = {
                start: aim_line,
                end: aim_line,
                renderer: AimLine
            };
	    });
    
        touches.filter(t => t.type === "move").forEach(t => {
            if(entities.aimline && t.delta) {
                // Track delta movements and allow variable acceleration per axis
                aim_vector.delta[0] += t.delta.pageX * accelerationX;
                aim_vector.delta[1] += t.delta.pageY * accelerationY;

                 // Give the aimline a circular curvature, let the change in
                 // y-axis delta control length and x-axis delta the degree of
                 // the aim line.                
                let length = Math.min(maxLength, aim_vector.delta[1]);
                let deg = (aim_vector.delta[0] % 360);
                let x2 = length * Math.sin(deg * Math.PI / 180);
                let y2 = length * Math.cos(deg * Math.PI / 180);

                if(length > minLength && deg > minDeg && deg < maxDeg) {
                    aim_vector.final = utils.getPointsDeltas([x2 + RADIUS, y2 + RADIUS], entities.ball.position)
                    entities.aimline.end = aim_vector.final;
                } else {
                    // Invalid aimline, revert
                    aim_vector.final = aim_vector.start;
                    entities.aimline.end = [aim_line[0], aim_line[1]];
                }
            }
        });
    }

	return entities;
};

const AimBallsRelease = (entities, { time, touches }) => {
    if(entities.scorebar.state == "stopped") {
        touches.filter(t => t.type === "end").forEach(t => {
            delete entities.aimline;
            let d = utils.getDistance(aim_vector.start, aim_vector.final);
            if(t.event.pageY > entities.floor.height && d > minLength && entities.ball.state == "stopped") {
                let [dx, dy] = utils.getPointsDeltas(entities.ball.position, aim_vector.final);
                // Normalize vector
                entities.ball.direction[1] = (dy/d);
                entities.ball.direction[0] = (dx/d);
                entities.ball.start_direction = [entities.ball.direction[0], entities.ball.direction[1]];
                // This should account for the difference in ball direction in the axes
                entities.ball.speed[0] = 10;
                entities.ball.speed[1] = 10;
                entities.start = [entities.ball.position[0], entities.ball.position[1]];
                entities.ball.state = "moving";
                entities.scorebar.state = "started";
                entities.scorebar.balls_returned = 0;
                entities.scorebar.balls_in_play = 1;
                last_ball_start_time = time.current;                
            }
        });
    }
	return entities;
};

const CreateBallTail = (entities, { time }) => {
    let scorebar = entities.scorebar;
    if(scorebar.state == "started" && scorebar.balls_in_play < scorebar.balls) {
        if((time.current - last_ball_start_time) > 150 /* ms */) {
            let position = [entities.ball.start[0], entities.ball.start[1]];
            let direction = [entities.ball.start_direction[0], entities.ball.start_direction[1]];
            let speed = [entities.ball.speed[0], entities.ball.speed[1]];
            entities["ball" + randomKey()] = {
                type: "ball",
                state: "moving",
                color: "white",
                position: position,
                renderer: Ball,
                speed: speed, 
                direction: direction
            };
            scorebar.balls_in_play++;
            last_ball_start_time = time.current;
        }
    }
    return entities;
}

/**
 * Easter egg which allows adding or removing balls by clicking hotspots at the 
 * top of the screen in the scoreboard section. If the game is still in progress
 * the new balls will start moving as they are added.
 */
const SpawnBall = (entities,  { touches, screen }) => {
    touches.filter(t => t.type === "press").forEach(t => {
        if(t.event.pageY < entities.scorebar.height && t.event.pageX > screen.width / 2) {
            entities.scorebar.balls+=5;
        } else if(t.event.pageY < entities.scorebar.height && t.event.pageX < screen.width / 2 && entities.scorebar.balls > 1) {
            entities.scorebar.balls-=5;
        }
    });
    return entities;
};
  
export { StartGame, MoveBall, SpawnBall, AimBallsStart, AimBallsRelease, CreateBallTail };