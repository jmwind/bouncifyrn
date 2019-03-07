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
    start: utils.newPosition(0, 0),
    delta: utils.newPosition(0, 0),
    final: utils.newPosition(0, 0)
};
let last_ball_start_time = 0; 

function collidesWithBox(entities, ball) {
    let boxes = Object.keys(entities).filter(key => key.startsWith("box"));
    for(var boxId in boxes) {
         let box = entities[boxes[boxId]];
         if(box.explode) {            
             continue;
         }
         let box_y = rowToTopPosition(box.row);
         let box_x = colToLeftPosition(box.col);
         let next_position = utils.newPosition(
            ( ball.speed.x * ball.direction.x ),
            ( ball.speed.y * ball.direction.y )
         );  
        let collision = NO_COLISION;
        
        if (ball.position.x + RADIUS + next_position.x > box_x && 
            ball.position.x + next_position.x < box_x + BOX_TILE_SIZE && 
            ball.position.y + RADIUS > box_y && 
            ball.position.y < box_y + BOX_TILE_SIZE) {                
                collision = SIDE;
        } else if (ball.position.x + RADIUS > box_x && 
                ball.position.x < box_x + BOX_TILE_SIZE && 
                ball.position.y + RADIUS + next_position.y > box_y && 
                ball.position.y + next_position.y < box_y + BOX_TILE_SIZE) {
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
                }
                return collision;
            }
        }
    }

    return NO_COLISION;
}

function moveToNextLevelWithDelay(entities, dispatch) {
    let delay = 100;
    if(entities.scorebar.new_balls > 0) {
        delay = 750;
        animateFallenPowerups(entities);
    }    
    setTimeout(() => {
        moveToNextLevel(entities, dispatch);
    }, delay);
}

export function moveToNextLevel(entities, dispatch) {
    const { scorebar, ball } = entities;
    let boxes = Object.keys(entities).filter(key => key.startsWith("box"));
    let max_row = 0;
    scorebar.level++;

    // clean-up and reset
    scorebar.state = "stopped";
    scorebar.balls_in_play = 0;
    scorebar.balls += entities.scorebar.new_balls;
    scorebar.new_balls = 0;
    // save next start position to ball trail
    ball.start = utils.clonePosition(ball.position);
    deleteFallenBallPowerups(entities);

    // advance boxes still in the game
    let dead_boxes = [];
    for(var boxId in boxes) {
        let box = entities[boxes[boxId]];
        if(box) {
            if(box.explode) {
                dead_boxes.push(boxes[boxId])
            } else {
                if(++box.row > max_row) {
                    max_row = box.row;
                }
            }
        }
    }
    dead_boxes.forEach((boxId) => {
        delete entities[boxId];
    });

    // are we done?
    if(max_row >= LAST_ROW) {
        dispatch({ type: "game-over", score: scorebar.level });
        return;        
    }
    
    // create new row of boxes and power-ups
    let powerup = false;
    for (i = 0; i < 8; i++) {        
        let key = randomKey();
        let col = i;
        let new_hits = utils.randomValueRounded(scorebar.balls, scorebar.balls * 2);
        if(utils.randomRoll(70)) {
            if(!powerup && utils.randomRoll(50)) {            
                entities["box" + key] = {
                    row: 1, 
                    col: col, 
                    collecting: false,                    
                    type: "powerup", 
                    renderer: BallPowerUp, 
                };
                powerup = true;
            } else {
                entities["box" + key] = {
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

function deleteFallenBallPowerups(entities) {
    let boxes = Object.keys(entities).filter(key => key.startsWith("box"));
    for(var boxId in boxes) {
        let box = entities[boxes[boxId]];
        if(box.type && box.type == "powerup" && box.falling) {
            delete entities[boxes[boxId]];
        }
    }
}

function animateFallenPowerups(entities) {
    const { ball } = entities;
    let boxes = Object.keys(entities).filter(key => key.startsWith("box"));
    for(var boxId in boxes) {
        let box = entities[boxes[boxId]];
        if(box.type && box.type == "powerup" && box.falling) {
            entities[boxes[boxId]].collecting = true;
            entities[boxes[boxId]].slidePosition = ball.position.x;
        }
    }
}

const StartGame = (entities, dispatch) => {    
    const {scorebar} = entities;
    if(scorebar.state == "stopped" && scorebar.level == 0) {
        moveToNextLevel(entities, dispatch);
    }
    return entities;
};

const MoveBall = (entities, { screen, dispatch }) => { 
    const { scorebar, floor, ball } = entities; 
    Object.keys(entities).forEach(ballId => {
        let ball = entities[ballId];
        if(! ballId.startsWith("ball")) return;        
        if(ball.state != "moving") return;
        
        let next_position = utils.newPosition(
            ball.position.x + ( ball.speed.x * ball.direction.x ),
            ball.position.y + ( ball.speed.y * ball.direction.y )
        );
        let next_direction = utils.clonePosition(ball.direction);
        
        let isCollision = collidesWithBox(entities, ball);

        // Test box collision before walls
        if(isCollision == SIDE) {
            next_direction.x *= -1; 
        } else if(next_position.x > ( screen.width - RADIUS) || next_position.x < 0) {
            next_direction.x *= -1; 
        }
                
        if(isCollision == TOP_BOTTOM) {
            next_direction.y *= -1; 
        } else if(next_position.y < RADIUS + scorebar.height) {
            next_direction.y *= -1; 
        }

        if(next_position.y > (floor.height - RADIUS*2)) {        
            scorebar.balls_returned++;
            // there's only one ball that is the tracer ball and will remain on the floor while
            // all other balls will dissapear when they hit the floor.
            if(ballId == "ball") {
                ball.state = "stopped";
                // ensure rested nicely on top of floor or not outside of sidewalls
                if(next_position.x > screen.width - RADIUS*2) {
                    next_position.x = screen.width - RADIUS*2;
                }
                if(next_position.x < 0) {
                    next_position.x = RADIUS*2;
                }
                ball.position = utils.newPosition(next_position.x, ball.start.y);                
            } else {
                // remove all balls that aren't the lead ball when they hit they floor
                delete entities[ballId]; 
            }

            // decide when all balls have returned and stop the current level
            if(scorebar.balls_returned >= scorebar.balls) {                
                moveToNextLevelWithDelay(entities, dispatch);
            }
        } else {
            next_position = utils.newPosition(
                ball.position.x + ( ball.speed.x * next_direction.x ),
                ball.position.y + ( ball.speed.y * next_direction.y )
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
const minLength = 20;
const maxLength = FLOOR_HEIGHT - SCOREBOARD_HEIGHT;
const minDeg = -88;
const maxDeg = 88;

const AimBallsStart = (entities, { touches, screen }) => {
    const { scorebar, ball } = entities;
    if(scorebar.state == "stopped") {
        touches.filter(x => x.type === "start").forEach(t => {
            aim_vector.start = { x: t.event.pageX, y: t.event.pageY };
            aim_vector.delta = { x: 0, y: 0 };
            aim_vector.final = { x: 0, y: 0 };
            aim_line = utils.newPosition(
                ball.position.x + RADIUS / 2,
                ball.position.y + RADIUS / 2
            );
            entities["aimline"] = {
                start: aim_line,
                end: aim_line,
                renderer: AimLine
            };
	    });
    
        touches.filter(t => t.type === "move").forEach(t => {
            if(entities.aimline && t.delta) {
                // Track delta movements and allow variable acceleration per axis
                aim_vector.delta.x += t.delta.pageX * accelerationX;
                aim_vector.delta.y += t.delta.pageY * accelerationY;

                 // Give the aimline a circular curvature, let the change in
                 // y-axis delta control length and x-axis delta the degree of
                 // the aim line.                
                let length = Math.min(maxLength, aim_vector.delta.y);
                let deg = (aim_vector.delta.x % 360);
                let x2 = length * Math.sin(deg * Math.PI / 180);
                let y2 = length * Math.cos(deg * Math.PI / 180);

                if(length > minLength && deg > minDeg && deg < maxDeg) {
                    aim_vector.final = utils.getPointsDeltas({x: x2 + RADIUS, y: y2 + RADIUS}, ball.position);
                    entities.aimline.end = aim_vector.final;
                } else {
                    // Invalid aimline, revert
                    aim_vector.final = aim_vector.start;
                    entities.aimline.end = utils.clonePosition(aim_line);
                }
            }
        });
    }

	return entities;
};

const AimBallsRelease = (entities, { time, touches }) => {
    const { scorebar, ball, floor } = entities;
    if(entities.scorebar.state == "stopped") {
        touches.filter(t => t.type === "end").forEach(t => {
            delete entities.aimline;
            let d = utils.getDistance(aim_vector.start, aim_vector.final);
            if(t.event.pageY > floor.height && d > minLength && ball.state == "stopped") {
                let delta = utils.getPointsDeltas(ball.position, aim_vector.final);
                // Normalize vector
                ball.direction.y = (delta.y/d);
                ball.direction.x = (delta.x/d);
                ball.start_direction = utils.clonePosition(ball.direction);
                // This should account for the difference in ball direction in the axes
                ball.speed.x = 10;
                ball.speed.y = 10;
                ball.start = utils.clonePosition(ball.position);
                ball.state = "moving";
                scorebar.state = "started";
                scorebar.balls_returned = 0;
                scorebar.balls_in_play = 1;
                last_ball_start_time = time.current;                
            }
        });
    }
	return entities;
};

const CreateBallTail = (entities, { time }) => {
    const { scorebar, ball } = entities;
    if(scorebar.state == "started" && scorebar.balls_in_play < scorebar.balls) {
        // Controls the speed at which new balls are spawned when they start to shoot 
        // from the floor
        if((time.current - last_ball_start_time) > 150 /* ms */) {
            let position = utils.clonePosition(ball.start);
            let direction = utils.clonePosition(ball.start_direction);
            let speed = utils.clonePosition(ball.speed);
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
 * the new balls will start moving as they are added. Also, to advance to another
 * level press in the middle of the scorebar.
 */
const SpawnBall = (entities,  { touches, screen, dispatch }) => {
    const { scorebar } = entities;
    touches.filter(t => t.type === "press").forEach(t => {
        if(t.event.pageY < scorebar.height && t.event.pageX > (screen.width / 2 + 100)) {
            scorebar.balls+=5;
        } else if(t.event.pageY < scorebar.height && t.event.pageX < (screen.width / 2 - 100) && scorebar.balls > 1) {
            scorebar.balls-=5;
        } else if(t.event.pageY < scorebar.height) {
            moveToNextLevel(entities, dispatch);
        }
    });
    return entities;
};
  
export { StartGame, MoveBall, SpawnBall, AimBallsStart, AimBallsRelease, CreateBallTail };