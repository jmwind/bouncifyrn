import _ from "lodash";
import { Ball, RADIUS } from "./renderers";

const distance = ([x1, y1], [x2, y2]) =>
        Math.sqrt(Math.abs(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
        
let aim_vector = {start: [0,0], current: [0,0]};        

const MoveBall = (entities, { touches, screen }) => {

    let box_size = RADIUS; 
    let box_rad = ( box_size / 2);   
    
    Object.keys(entities).forEach(boxId => {
        if(! boxId.startsWith("ball")) return;
        let box = entities[boxId];

        if(box.state != "moving") return;
        box.position = [
            box.position[0] + ( box.speed[0] * box.direction[0] ),
            box.position[1] + ( box.speed[1] * box.direction[1] )
        ];
        
        if(box.position[0] > ( screen.width - box_size - 7 ) || box.position[0] < box_rad) {
            box.direction[0] *= -1; 
        }

        if(box.position[1] < box_rad + entities.scorebar.height + 3) {
            box.direction[1] *= -1; 
        }

        if(box.position[1] > (screen.height - box_size - entities.floor.height - 5)) {
            //box.direction[1] *= -1;
            if(boxId == "ball") {
                entities.ball.state = "stopped";
            } else {
                delete entities[boxId]; 
            }
        }
    });
    
    return entities;
};

const AimBallsStart = (entities, { touches }) => {
    touches.filter(x => x.type === "start").forEach(t => {
		aim_vector.start = [t.event.pageX, t.event.pageY];		
	});
    
    touches.filter(t => t.type === "move").forEach(t => {
        aim_vector.current = [t.event.pageX, t.event.pageY];
        let d = distance(aim_vector.start, aim_vector.current);
        if(d > 1) {
            console.log("START: " + aim_vector.start + " END: " + aim_vector.current);
            console.log("DISTANCE: " + d);        
        }
	});

	return entities;
};

const AimBallsRelease = (entities, { touches }) => {
	touches.filter(t => t.type === "end").forEach(t => {
        aim_vector.current = [t.event.pageX, t.event.pageY];
        let d = distance(aim_vector.start, aim_vector.current);
        if(d > 10) {
            console.log("FINISHED DRAG");
            let x1 = (aim_vector.current[0] - aim_vector.start[0]) / 10;
            let y1 = (aim_vector.current[1] - aim_vector.start[1]) / 10;
            console.log(x1);
            console.log(y1);
            console.log("DISTANCE: " + d);
            entities.ball.direction[0] = x1 * -1;
            entities.ball.direction[1] = y1 * -1;
            //entities.ball.speed[0] = d / 10;
            //entities.ball.speed[1] = d / 10;
            entities.ball.state = "moving";
        }
	});
	return entities;
};

const SpawnBall = (entities,  { touches }) => {
    touches.filter(t => t.type === "press").forEach(t => {
            entities["ball" + ++Object.keys(entities).length] = {
                type: "ball",
                state: "moving",
                position: [t.event.pageX, t.event.pageY],
                renderer: Ball,
                speed: [2.0, 2.0], 
                direction: [-3.5,-0.5]
            };
            entities.scorebar.balls++;
        }
    );
    return entities;
};
  
export { MoveBall, SpawnBall, AimBallsStart, AimBallsRelease };