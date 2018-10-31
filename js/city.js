class City {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `${this.x},${this.y}`;
    }

    isEqual(city) {
        if (this.x === city.x && this.y === city.y) {
            return true;
        }
        return false;
    }
}

export default City;