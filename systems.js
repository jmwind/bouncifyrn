import _ from "lodash";
import { Finger, RADIUS } from "./renderers";

const distance = ([x1, y1], [x2, y2]) =>
	    Math.sqrt(Math.abs(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));

const MoveFinger = (entities, { touches, screen }) => {

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
            delete entities[boxId]; 
        }
    });
    
    return entities;
};

const SpawnFinger = (entities,  { touches }) => {
    touches.filter(t => t.type === "press").forEach(t => {
            entities["ball" + ++Object.keys(entities).length] = {
                type: "ball",
                state: "moving",
                position: [t.event.pageX, t.event.pageY],
                renderer: Finger,
                speed: [2.0, 2.0], 
                direction: [-3.5,-0.5]
            };
            entities.scorebar.balls++;
        }
    );
    return entities;
};
  
export { MoveFinger, SpawnFinger };