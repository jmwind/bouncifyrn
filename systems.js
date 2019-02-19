import _ from "lodash";
import { Ball, RADIUS, AimLine, rowToTopPosition, colToLeftPosition, BOX_TILE_SIZE, BoxTile, BallPowerUp } from "./renderers";

// Collision detection
const NO_COLISION = 0;
const SIDE = 1;
const TOP_BOTTOM = 2;

const randomKey = () =>
    (Math.random() + 1).toString(36).substring(7);

// Vector distance for initial ball launch aiming
const distance = ([x1, y1], [x2, y2]) =>
        Math.sqrt(Math.abs(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));        
let aim_vector = {start: [0,0], current: [0,0]};  
let last_ball_start_time = 0; 

function collidesWithBox(entities, ball) {
    let boxes = Object.keys(entities).filter(key => key.startsWith("box"));
    for(var boxId in boxes) {
         let box = entities[boxes[boxId]];
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
                    delete entities[boxes[boxId]];
                }
                return collision;
            }
        }
    }

    return NO_COLISION;
}

function calculateNextLevel(entities) {
    let boxes = Object.keys(entities).filter(key => key.startsWith("box"));
    let max_row = 0;
    entities.scorebar.level++;
    for(var boxId in boxes) {
        let box = entities[boxes[boxId]];
        if(++box.row > max_row) {
            max_row = box.row;
        }
    }
    if(max_row >= 10) {
        // game over
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
                hits: new_hits, 
                renderer: BoxTile, 
            };
        }
    }
}

function deleteBallPowerups(entities) {
    let boxes = Object.keys(entities).filter(key => key.startsWith("box"));
    for(var boxId in boxes) {
        let box = entities[boxes[boxId]];
        if(box.type && box.type == "powerup" && box.falling) {
            delete entities[boxes[boxId]];
        }
    }
}

const MoveBall = (entities, { screen }) => {
    
    Object.keys(entities).forEach(ballId => {
        if(! ballId.startsWith("ball")) return;
        let ball = entities[ballId];
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
                deleteBallPowerups(entities);
                calculateNextLevel(entities);
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

const AimBallsStart = (entities, { touches }) => {
    if(entities.scorebar.state == "stopped") {
        touches.filter(x => x.type === "start").forEach(t => {        
            aim_vector.start = [t.event.pageX, t.event.pageY];
            aim_vector.current = [t.event.pageX, t.event.pageY];
            aim_line = [
                entities.ball.position[0] + RADIUS / 2,
                entities.ball.position[1] + RADIUS / 2
            ];
            entities['aimline'] = {
                start: aim_line,
                end: aim_line,
                strokewidth: 3,
                renderer: AimLine
            };        
	    });
    
        touches.filter(t => t.type === "move").forEach(t => {
            if(entities.aimline) {
                aim_vector.current = [t.event.pageX, t.event.pageY];
                let d = distance(aim_vector.start, aim_vector.current);
                if(aim_vector.current[1] - aim_vector.start[1] > 0) {
                    let end_x = entities.aimline.start[0] + ((aim_vector.current[0] - aim_vector.start[0])*(-1*(d/2)));
                    let end_y = Math.max(
                        entities.aimline.start[1] + ((aim_vector.current[1] - aim_vector.start[1])*(-1*(d/2))), 
                        entities.scorebar.height);
                    entities.aimline.end = [end_x, end_y];
                    entities.aimline.strokewidth = (d/5); 
                }
            }
        });
    }

	return entities;
};

const AimBallsRelease = (entities, { time, touches }) => {
    if(entities.scorebar.state == "stopped") {
        touches.filter(t => t.type === "end").forEach(t => {
            aim_vector.current = [t.event.pageX, t.event.pageY];
            delete entities.aimline;
            let d = distance(aim_vector.start, aim_vector.current);
            if(t.event.pageY > entities.floor.height && d > 10 && entities.ball.state == "stopped") {
                let x1 = (aim_vector.current[0] - aim_vector.start[0]);
                let y1 = (aim_vector.current[1] - aim_vector.start[1]);            
                entities.ball.direction[0] = (x1 * -1)/5;
                entities.ball.direction[1] = (y1 * -1)/5;
                entities.ball.start_direction = [entities.ball.direction[0], entities.ball.direction[1]];
                entities.ball.speed[0] = 1;
                entities.ball.speed[1] = 1;
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
 * top of the screen in the scoreboard section. 
 */
const SpawnBall = (entities,  { touches, screen }) => {
    touches.filter(t => t.type === "press").forEach(t => {
        // Hack to add more balls quickly without needing to play all levels
        if(t.event.pageY < entities.scorebar.height && t.event.pageX > screen.width / 2) {
            entities.scorebar.balls+=5;
        } else if(t.event.pageY < entities.scorebar.height && t.event.pageX < screen.width / 2 && entities.scorebar.balls > 1) {
            entities.scorebar.balls-=5;
        }
    });
    return entities;
};
  
export { MoveBall, SpawnBall, AimBallsStart, AimBallsRelease, CreateBallTail };