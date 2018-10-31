"use strict";

import Tour from './tour';

class Ant {
    constructor(graph, params) {
        this.graph = graph;
        this.alpha = params.alpha;
        this.beta = params.beta;
        this.q = params.q;
        this.tour = null;
    }

    init() {
        this.tour = new Tour(this.graph);
        const randCityIndex = Math.floor(Math.random() * this.graph.size());
        this.currentCity = this.graph.getCity(randCityIndex);
        this.tour.addCity(this.currentCity);
    }

    makeNextMove() {
        if (this.tour === null) {
            this.init()
        }

        let rouletteWheel = 0.0;
        const cities = this.graph.getCities();
        const cityProbabilities = [];

        for (let cityIndex in cities) {
            if (!this.tour.contains(cities[cityIndex])) {
                const edge = this.graph.getEdge(this.currentCity, cities[cityIndex]);
                let finalPheromoneWeight = Math.pow(edge.getPheromone(), this.alpha);
                cityProbabilities[cityIndex] = finalPheromoneWeight * Math.pow(1.0 / edge.getDistance(), this.beta);
                rouletteWheel += cityProbabilities[cityIndex];
            }
        }

        const wheelTarget = rouletteWheel * Math.random();
        let wheelPosition = 0.0;

        for (let cityIndex in cities) {
            if (!this.tour.contains(cities(cityIndex))) {
                wheelPosition += cityProbabilities[cityIndex];
                if (wheelPosition >= wheelTarget) {
                    this.currentCity = cities[cityIndex];
                    this.tour.addCity(cities[cityIndex]);
                    return;
                }
            }
        }
    }

    tourFound() {
        if (this.tour === null) {
            return false;
        }
        return (this.tour.size() >= this.graph.size());
    }

    run(callback) {
        this.reset();
        while(!this.tourFound()) {
            this.makeNextMove();
        }
    }

    addPheromone(weight = 1) {
        const extraPheromone = (this._q * weight) / this.tour.distance();

        for (let tourIndex = 0; tourIndex < this.tour.size(); tourIndex++) {
            let fromCity = this.tour.get(tourIndex);
            if (tourIndex >= this.tour.size - 1) {
                let toCity = this.tour.get(0);
                let edge = this.graph.getEdge(fromCity, toCity);
                let pheromone = edge.getPheromone();
                edge.setPheromone(pheromone + extraPheromone);
            } else {
                let toCity = this.tour.get(tourIndex + 1);
                let edge = this.graph.getEdge(fromCity, toCity);
                let pheromone = edge.getPheromone();
                edge.setPheromone(pheromone + extraPheromone);
            }
        }
    }
}

export default Ant;