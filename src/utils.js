// Vector distance for initial ball launch aiming
export default utils = {
    getDistance: function ([x1, y1], [x2, y2]) {
        return Math.sqrt(Math.abs(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
    },

    getPointsDeltas: function ([x1, y1], [x2, y2]) {
        return [x2 - x1, y2 - y1];
    }
}
