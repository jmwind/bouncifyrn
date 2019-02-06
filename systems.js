import _ from "lodash";
import { Finger, RADIUS } from "./renderers";

const distance = ([x1, y1], [x2, y2]) =>
	    Math.sqrt(Math.abs(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));

const MoveFinger = (entities, { touches, screen }) => {

    //-- I'm choosing to update the game state (entities) directly for the sake of brevity and simplicity.
    //-- There's nothing stopping you from treating the game state as immutable and returning a copy..
    //-- Example: return { ...entities, t.id: { UPDATED COMPONENTS }};
    //-- That said, it's probably worth considering performance implications in either case.
    let box_size = RADIUS; 
    let box_rad = ( box_size / 2);   
    
    Object.keys(entities).forEach(boxId => {
        let box = entities[boxId];
        box.position = [
            box.position[0] + ( box.speed[0] * box.direction[0] ),
            box.position[1] + ( box.speed[1] * box.direction[1] )
        ];
        
        if(box.position[0] > ( screen.width - box_size ) || box.position[0] < box_rad) {
            box.direction[0] *= -1; 
        }

        if(box.position[1] > (screen.height - box_size) || box.position[1] < box_rad) {
            box.direction[1] *= -1; 
        }
    });
    
    return entities;
};

const SpawnFinger = (entities,  { touches }) => {
    touches.filter(t => t.type === "press").forEach(t => {
        let touchOrigin = [t.event.pageX, t.event.pageY];
		let closestBoxes = _.sortBy(
			Object.keys(entities)
				.map(key => ({
					id: key,
					distance: distance(entities[key].position, touchOrigin)
				}))
				.filter(x => x.distance < RADIUS),
			["distance"]
		);

		if (closestBoxes[0]) {
            delete entities[closestBoxes[0].id];
        } else {
            entities[++Object.keys(entities).length] = {
                position: [t.event.pageX, t.event.pageY],
                renderer: Finger,
                speed: [2.0, 2.0], 
                direction: [-1,1]
            };
        }
    });

    return entities;
};
  
export { MoveFinger, SpawnFinger };