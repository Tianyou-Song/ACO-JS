import City from './city';
import Edge from './edge';

class Graph {
    constructor() {
        this.cities = [];
        this.edges = {};
    }

    addCity(x, y) {
        this.cities.push(new City(x, y));
    }

    addEdge(city1, city2) {
        this.edges[`${city1.toString()}-${city2.toString()}`] = new Edge(city1, city2);
    }

    getEdge(city1, city2) {
        edge1 = this.edges[`${city1.toString()}-${city2.toString()}`];
        edge2 = this.edges[`${city2.toString()}-${city1.toString()}`];
        if (edge1 != undefined) {
            return edge1
        } else if (edge2 != undefined) {
            return edge2
        }
    }

    createEdges() {
        this.edges = {};
        for (let cityIndex = 0; cityIndex < this.cities.length; cityIndex++) {
            for (let connectionIndex = cityIndex; connectionIndex < this.cities.length; connectionIndex++) {
                this.addEdge(this.cities[cityIndex], this.cities[connectionIndex])
            }
        }
    }

    resetPheromone() {
        for (let edgeIndex in this.edges) {
            this.edges[edgeIndex].resetPheromone();
        }
    }

    clear() {
        this.cities = [];
        this.edges = {};
    }
}

export default Graph;