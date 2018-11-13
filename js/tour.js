class Tour {
    constructor(graph) {
        this.graph = graph;
        this.cities = [];
        this.distance_total = null;
    }

    contains(city) {
        for (const tourIndex in this.cities) {
            if (city.isEqual(this.cities[tourIndex])) {
                return true;
            }
        }
        return false;
    }

    addCity(city) {
        this.distance_total = null;
        this.cities.push(city);
    }

    distance() {
        if(this.distance_total === null) {
            let distance = 0.0;

            for (let tourIndex = 0; tourIndex < this.cities.length; tourIndex++) {
                let edge;
                if (tourIndex >= this.cities.length - 1) {
                    edge = this.graph.getEdge(this.cities[tourIndex], this.cities[0]);
                } else {
                    edge = this.graph.getEdge(this.cities[tourIndex], this.cities[tourIndex + 1]);
                }
                distance += edge.distance;
            }

            this.distance_total = distance;
        }

        return this.distance_total;
    }
}

export default Tour;