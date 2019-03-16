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
    }
}
