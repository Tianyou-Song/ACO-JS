class Tour {
    constructor(graph) {
        this.graph = graph;
        this.tour = [];
        this.distance = null;
    }

    contains(city) {
        for (let tourIndex in this.tour) {
            if (city.isEqual(this.tour[tourIndex])) {
                return true;
            }
        }
        return false;
    }

    addCity(city) {
        this.distance = null;
        this.tour.push(city);
    }

    distance() {
        if(this.distance === null) {
            let distance = 0.0;

            for (let tourIndex = 0; tourIndex < this.tour.length; tourIndex++) {
                let edge;
                if (tourIndex >= this.tour.length - 1) {
                    edge = this.graph.getEdge(this.tour[tourIndex], this.tour[0]);
                } else {
                    edge = this.graph.getEdge(this.tour[tourIndex], this.tour[tourIndex + 1]);
                }
                distance += edge.distance;
            }

            this.distance = distance;
        }

        return this.distance;
    }
}

export default Tour;