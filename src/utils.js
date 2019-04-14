import { COLORS, Constants } from "./constants";

export default utils = {
    getDistance: function (p1, p2) {
        return Math.sqrt(Math.abs(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)));
    },

    getPointsDeltas: function (p1, p2) {
        return {x: p2.x - p1.x, y: p2.y - p1.y};
    },

    clonePosition: function (position) {
        return {x: position.x, y: position.y};
    },

    newPosition: function (x_val, y_val) {
        return {x: x_val, y: y_val};
    },

    randomValue: function(min, max) {
        return Math.random() * (max - min) + min;
    },

    randomValueRounded: function(min, max) {
        return Math.round(utils.randomValue(min, max));
    },

    randomRoll: function(percent) {
        return utils.randomValueRounded(1, 100) <= percent; 
    },

    randomKey: function() {
        return (Math.random() + 1).toString(36).substring(7);
    },

    colToLeftPosition: function(col) {
        return Constants.BOX_TILE_SPACE + 
            ((col * Constants.BOX_TILE_SPACE) + 
            (col * Constants.BOX_TILE_SIZE));    
    },

    rowToTopPosition: function(row) {
        return Constants.SCOREBOARD_HEIGHT + 
            Constants.BOX_TILE_SPACE + 
            ((row * Constants.BOX_TILE_SPACE) + 
            (row * Constants.BOX_TILE_SIZE));
    },

    hitsToColor: function(hits) {
        if(hits <= 10) {
            return COLORS[0];
        } else if(hits <=20) {
            return COLORS[1];
        } else if(hits <= 30) {
            return COLORS[2];
        } else if(hits <= 50) {
            return COLORS[3]
        } else if(hits <= 99) {
            return COLORS[4];
        } else if(hits <= 150) {
            return COLORS[5];
        }
        return COLORS[6];    
    }
}
