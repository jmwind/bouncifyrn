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

        if(box.position[1] > (screen.height - box_size - entities.floor.height - 7)) {
            box.direction[1] *= -1;
            //delete entities[boxId]; 
        }
    });
    
    return entities;
};

const SpawnFinger = (entities,  { touches }) => {
    touches.filter(t => t.type === "press").forEach(t => {
        let touchOrigin = [t.event.pageX, t.event.pageY];
		let closestBoxes = _.sortBy(
            Object.keys(entities)
                .filter(key => entities[key].type == "ball")
                .map(key => ({
					id: key,
					distance: distance(entities[key].position, touchOrigin)
				}))
				.filter(x => x.distance < RADIUS * 2),
			["distance"]
		);

		if (closestBoxes[0]) {
            delete entities[closestBoxes[0].id];
        } else {
            entities["ball" + ++Object.keys(entities).length] = {
                type: "ball",
                position: [t.event.pageX, t.event.pageY],
                renderer: Finger,
                speed: [4.0, 2.0], 
                direction: [-1,1]
            };
            entities.scorebar.balls++;
        }
    });

    return entities;
};
  
export { MoveFinger, SpawnFinger };