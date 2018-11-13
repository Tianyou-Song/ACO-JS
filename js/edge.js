class Edge {
    constructor(city1, city2) {
        this.city1 = city1;
        this.city2 = city2;
        this.initPheromone = 1;
        this.pheromone = this.initPheromone;

        const deltaX = Math.pow((city1.x - city2.x), 2);
        const deltaY = Math.pow((city1.y - city2.y), 2);
        this.distance = Math.sqrt(deltaX + deltaY);
    }

    point1() {
        return { x: this.city1.x, y: this.city1.y };
    }

    point2() {
        return { x: this.city2.x, y: this.city2.y };
    }

    contains(city) {
        if ((this.city1.x === city.x && this.city1.y === city.y) || (this.city2.x === city.x && this.city2.y === city.y)) {
            return true;
        }
        return false;
    }

    resetPheromone() {
        this.pheromone = this.initPheromone;
    }
}

export default Edge