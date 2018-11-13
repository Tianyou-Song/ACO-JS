import Graph from './graph';
import Ant from './ant';

class Colony {
    constructor(params) {
        this.graph = new Graph();
        this.ants = [];

        this.colonySize = 20;
        this.alpha = 1;
        this.beta = 3;
        this.rho = 0.1;
        this.q = 1;
        this.initPheromone = this.q;
        this.type = 'acs';
        this.elitistWeight = 0;
        this.maxIterations = 250;
        this.minScalingFactor = 0.001;

        if (params != undefined) {
            this.setParams(params);
        }
        
        this.iteration = 0
        this.minPheromone = null;
        this.maxPheromone = null;
        this.iterationBest = null;
        this.globalBest = null;

        this.createAnts();
    }

    createAnts() {
        this.ants = [];
        for (let antIndex = 0; antIndex < this.colonySize; antIndex++) {
            this.ants.push(new Ant(this.graph, {
                alpha: this.alpha,
                beta: this.beta,
                q: this.q
            }));
        }
    }

    setParams(params) {
        if (params.colonySize != undefined) {
            this.colonySize = params.colonySize
        }
        if (params.alpha != undefined) {
            this.alpha = params.alpha;
        }
        if (params.beta != undefined) {
            this.beta = params.beta;
        }
        if (params.rho != undefined) {
            this.rho = params.rho;
        }
        if (params.iterations != undefined) {
            this.maxIterations = params.iterations;
        }
        if (params.q != undefined) {
            this.q = params.q;
        }
        if (params.initPheromone != undefined) {
            this.initPheromone = params.initPheromone;
        } 
        if (params.minScalingFactor != undefined) {
            this.minScalingFactor = params.minScalingFactor;
        }
        if (params.type != undefined) {
            if (params.type == "elitist") {
                if (params.elitistWeight != undefined) {
                    this.elitistWeight = params.elitistWeight;
                    this.type = "elitist";
                }
            } else if (params.type == "maxmin") {
                this.type = "maxmin";
            } else {
                this.type = "acs";
            }
        }
    }

    reset() {
        this.iteration = 0;
        this.globalBest = null;
        this.resetAnts();
        this.setInitialPheromone(this.initPheromone);
        this.graph.resetPheromone();
    }

    setInitialPheromone() {
        const edges = this.graph.edges;
        for (const edgeIndex in edges) {
            edges[edgeIndex].initialPheromone = this.initPheromone;
        }
    }

    resetAnts() {
        this.createAnts();
        this.iterationBest = null;
    }

    ready() {
        if (this.graph.cities.length <= 1) {
            return false;
        }
        return true;
    }

    run() {
        if (!this.ready()) {
            return;
        }

        this.iteration = 0 
        while(this.iteration < this.maxIterations) {
            this.step();
        }
    }

    step() {
        if (!this.ready() || this.iteration >= this.maxIterations) {
            return;
        }

        this.resetAnts();
        for (const antIndex in this.ants) {
            this.ants[antIndex].run();
        }

        this.getGlobalBest();
        this.updatePheromone();
        this.iteration++;
    }

    updatePheromone() {
        const edges = this.graph.edges;

        for (const edgeIndex in edges) {
            let pheromone = edges[edgeIndex].pheromone;
            edges[edgeIndex].pheromone = pheromone * (1 - this.rho);
        }

        if (this.type === 'maxmin') {
            let best;
            if ((this.iteration / this.maxIterations) > 0.75) {
                best = this.getGlobalBest();
            } else {
                best = this.getIterationBest();
            }
            this.maxPheromone = this.q / best.tour.distance();
            this.minPheromone = this.maxPheromone * this.minScalingFactor;
            best.addPheromone();
        } else {
            for (const antIndex in this.ants) {
                this.ants[antIndex].addPheromone();
            }
        }

        if (this.type === 'elitist') {
            this.getGlobalBest().addPheromone(this.elitistWeight);
        } else if (this.type === 'maxmin') {
            for (const edgeIndex in edges) {
                let pheromone = edges[edgeIndex].pheromone;
                
                if (pheromone > this.maxPheromone) {
                    edges[edgeIndex].pheromone = this.maxPheromone;
                } else if (pheromone < this.minPheromone) {
                    edges[edgeIndex].pheromone = this.minPheromone;
                } else {
                    edges[edgeIndex].pheromone = pheromone;
                }
            }
        }
        
    }

    getIterationBest() {
        if (this.ants[0].tour === null) {
            return null;
        }

        if (this.iterationBest === null) {
            const best = this.ants[0];

            for (const antIndex in this.ants) {
                if (best.tour.distance() >= this.ants[antIndex].tour.distance()) {
                    this.iterationBest = this.ants[antIndex];
                }
            }
        }

        return this.iterationBest;
    }

    getGlobalBest() {
        const bestAnt = this.getIterationBest();

        if (bestAnt === null && this.globalBest === null) {
            return null;
        }

        if (bestAnt != null) {
            if (this.globalBest === null || this.globalBest.tour.distance() >= bestAnt.tour.distance()) {
                this.globalBest = bestAnt;
            }
        }

        return this.globalBest;
    }
}

export default Colony