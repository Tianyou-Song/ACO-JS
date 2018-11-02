"use strict";

class Artist {
    constructor(colony, canvas) {
        this.colony = colony;
        this.canvas = canvas;

        canvas.setClickHook(this.click.bind(this));
        this.draw = this.draw.bind(this);
        this.draw();

        this.animationIterator = null;
        this.animationSteps = 10;
        this.iterationHook = null;

        this.run = this.run.bind(this);
        this.click = this.click.bind(this);
        this.drawBg = this.drawBg.bind(this);
        this.drawEdges = this.drawEdges.bind(this);
        this.drawNodes = this.drawNodes.bind(this);
        this.drawCurrentBest = this.drawCurrentBest.bind(this);
        this.clearGraph = this.clearGraph.bind(this);
        this.stop = this.stop.bind(this);
        this.step = this.step.bind(this);
        this.animateAnts = this.animateAnts.bind(this);
        this.drawAnt = this.drawAnt.bind(this);
        this.moveAnt = this.moveAnt.bind(this);
    }

    click() {
        const cities = this.colony.graph.cities;

        for (const cityIndex in cities) {
            let difference = 0;

            difference += Math.abs(cities[cityIndex].x - this.canvas.mousePos.x);
            difference += Math.abs(cities[cityIndex].y - this.canvas.mousePos.y);

            if (difference < 30) {
                return;
            }
        }

        this.colony.graph.addCity(this.canvas.mousePos.x, this.canvas.mousePos.y);
        this.colony.graph.createEdges();
        clearInterval(this.animationIterator);
        this.colony.reset();
        this.draw();
    }

    draw() {
        this.canvas.clear();
        this.drawBg();
        this.drawEdges();
        this.drawNodes();
        this.drawCurrentBest();
    }

    drawBg() {
        this.canvas.drawRectangle(0, 0, this.canvas.element.width, this.canvas.element.height, {
            color: "lightgray"
        });
    }

    drawEdges() {
        const edges = this.colony.graph.edges;

        let totalPheromone = 0;

        for (const edgeIndex in edges) {
            if (edges.hasOwnProperty(edgeIndex)) {
                totalPheromone += edges[edgeIndex].pheromone;
            }
        }

        for (const edgeIndex in edges) {
            if (edges.hasOwnProperty(edgeIndex)) {
                const edge = edges[edgeIndex];
                const graphSize = this.colony.graph.cities.length;
                let alpha = 0.2;
                let width = 1;

                if (this.colony.iteration > 0) {
                    width = Math.ceil((edge.pheromone / totalPheromone) * (graphSize * 6));

                    alpha = (edge.pheromone / totalPheromone) * graphSize + 0.03;
                    if (alpha > 1) {
                        alpha = 1;
                    }
                }

                this.canvas.drawLine(edge.point1().x, edge.point1().y, edge.point2().x, edge.point2().y, {
                    alpha,
                    color: "#007fff",
                    width
                });
            }
        }
    }

    drawNodes() {
        const nodes = this.colony.graph.cities;

        for (const nodeIndex in nodes) {
            if (nodes.hasOwnProperty(nodeIndex)) {
                const node = nodes[nodeIndex];

                this.canvas.drawCircle(node.x, node.y, {
                    alpha: 0.8,
                    color: 'yellow'
                });
            }
        }
    }

    drawCurrentBest() {
        const ant = this.colony.getGlobalBest();
        debugger;

        if (ant === null || ant.tour === null) {
            return;
        }

        const tour = ant.tour;
        const alpha = 0.9;
        const color = "#00ff7f";
        const width = 3;

        for (let tourIndex = 0; tourIndex < tour.cities.length; tourIndex++) {
            const currentStop = tour.cities[tourIndex];

            if (tourIndex < tour.cities.length - 1) {
                const nextStop = tour.cities[tourIndex + 1];

                this.canvas.drawLine(currentStop.x, currentStop.y, nextStop.x, nextStop.y, {
                    alpha,
                    color,
                    width
                });
            } else {
                const tourStart = tour.cities[0];

                this.canvas.drawLine(currentStop.x, currentStop.y, tourStart.x, tourStart.y, {
                    alpha,
                    color,
                    width
                });
            }
        }
    }

    clearGraph() {
        this.stop();
        this.colony.graph.clear();
        this.draw();
    }

    stop() {
        clearInterval(this.animationIterator);
        this.colony.reset();
        this.draw();
    }

    run(iterationHook) {
        if (!this.colony.ready()) {
            return;
        } else if (typeof (iterationHook) === "function") {
            this.iterationHook = iterationHook;
        }

        clearInterval(this.animationIterator);
        this.colony.reset();
        this.step();
    }

    step() {
        if (this.colony.iteration >= this.colony.maxIterations) {
            this.draw();
            this.colony.resetAnts();
            return;
        }

        for (let i = 0; i < 3; i++) {
            this.colony.step();
            this.draw();
        }

        this.animateAnts();

        if (typeof (this.iterationHook) === "function") {
            this.iterationHook();
        }
    }

    animateAnts() {
        let animationIndex = 2;

        this.animationIterator = setInterval(() => {
            this.draw();
            const ants = this.colony.ants;

            for (const antIndex in ants) {
                if (ants.hasOwnProperty(antIndex)) {
                    this.moveAnt(ants[antIndex], 1, animationIndex);
                }
            }
            animationIndex++;
            if (animationIndex >= this.animationSteps) {
                clearInterval(this.animationIterator);
                this.step();
            }
        }, 20);
    }

    moveAnt(ant, tourIndex, animationStep) {
        const fromCity = ant.tour.cities[tourIndex - 1];
        const toCity = ant.tour.cities[tourIndex];
        const xOffset = (toCity.x - fromCity.x) * ((1 / this.animationSteps) * animationStep);
        const yOffset = (toCity.y - fromCity.y) * ((1 / this.animationSteps) * animationStep);

        const antX = fromCity.x + xOffset;
        const antY = fromCity.y + yOffset;

        this.drawAnt(antX, antY);
    }

    drawAnt(x, y) {
        this.canvas.drawCircle(x, y, {
            alpha: 0.5,
            size: 2
        });
    }
}

export default Artist;