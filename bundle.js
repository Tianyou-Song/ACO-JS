/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/ant.js":
/*!*******************!*\
  !*** ./js/ant.js ***!
  \*******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tour__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tour */ "./js/tour.js");




class Ant {
    constructor(graph, params) {
        this.graph = graph;
        this.alpha = params.alpha;
        this.beta = params.beta;
        this.q = params.q;
        this.tour = null;
        this.addPheromone = this.addPheromone.bind(this);
        this.init = this.init.bind(this);
        this.makeNextMove = this.makeNextMove.bind(this);
    }

    init() {
        this.tour = new _tour__WEBPACK_IMPORTED_MODULE_0__["default"](this.graph);
        const randCityIndex = Math.floor(Math.random() * this.graph.cities.length);
        this.currentCity = this.graph.cities[randCityIndex];
        this.tour.addCity(this.currentCity);
    }

    makeNextMove() {
        if (this.tour === null) {
            this.init();
        }

        let rouletteWheel = 0.0;
        const cities = this.graph.cities;
        const cityProbabilities = [];

        for (const cityIndex in cities) {
            if (!this.tour.contains(cities[cityIndex])) {
                const edge = this.graph.getEdge(this.currentCity, cities[cityIndex]);
                let finalPheromoneWeight = Math.pow(edge.pheromone, this.alpha);
                cityProbabilities[cityIndex] = finalPheromoneWeight * Math.pow(1.0 / edge.distance, this.beta);
                rouletteWheel += cityProbabilities[cityIndex];
            }
        }

        const wheelTarget = rouletteWheel * Math.random();
        let wheelPosition = 0.0;

        for (const cityIndex in cities) {
            if (!this.tour.contains(cities[cityIndex])) {
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
        return (this.tour.cities.length >= this.graph.cities.length);
    }

    run() {
        this.tour = null;
        while(!this.tourFound()) {
            this.makeNextMove();
        }
    }

    addPheromone(weight = 1) {
        const extraPheromone = (this.q * weight) / this.tour.distance();
        for (let tourIndex = 0; tourIndex < this.tour.cities.length; tourIndex++) {
            const fromCity = this.tour.cities[tourIndex];
            if (tourIndex >= this.tour.cities.length - 1) {
                const toCity = this.tour.cities[0];
                const edge = this.graph.getEdge(fromCity, toCity);
                const pheromone = edge.pheromone;
                edge.pheromone = pheromone + extraPheromone;
            } else {
                const toCity = this.tour.cities[tourIndex + 1];
                const edge = this.graph.getEdge(fromCity, toCity);
                const pheromone = edge.pheromone;
                edge.pheromone = pheromone + extraPheromone;
            }
        }
    }
}

/* harmony default export */ __webpack_exports__["default"] = (Ant);

/***/ }),

/***/ "./js/app.js":
/*!*******************!*\
  !*** ./js/app.js ***!
  \*******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvas */ "./js/canvas.js");
/* harmony import */ var _artist__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./artist */ "./js/artist.js");
/* harmony import */ var _colony__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./colony */ "./js/colony.js");






document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas");
    const startButton = document.getElementById('start-button');
    const clearButton = document.getElementById('clear-button');
    const iterationInfo = document.getElementById('iteration-info');
    const bestDistanceInfo = document.getElementById('best-distance-info');

    const acoType = document.getElementById('type');
    const elitestWeightContainer = document.getElementById('elitest-weight-container');
    elitestWeightContainer.style.display = 'none';
    const minScalingFactorContainer = document.getElementById('min-scaling-factor-container');
    minScalingFactorContainer.style.display = 'none';

    const infoDisplay = document.getElementById('info-display');
    infoDisplay.style.display = 'none';

    const currentCanvas = new _canvas__WEBPACK_IMPORTED_MODULE_0__["default"](canvas);
    const colony = new _colony__WEBPACK_IMPORTED_MODULE_2__["default"]();
    const artist = new _artist__WEBPACK_IMPORTED_MODULE_1__["default"](colony, currentCanvas);

    canvas.addEventListener('click', currentCanvas.click);
    acoType.addEventListener('change', () => {
        if (acoType.value === 'elitist') {
            elitestWeightContainer.style.display = 'block';
            minScalingFactorContainer.style.display = 'none';
        } else if (acoType.value === 'maxmin') {
            minScalingFactorContainer.style.display = 'block';
            elitestWeightContainer.style.display = 'none';
        } else {
            elitestWeightContainer.style.display = 'none';
            minScalingFactorContainer.style.display = 'none';
        }
    })
    startButton.addEventListener('click', () => {
        if (!colony.ready()) {
            return;
        }

        const params = {
            colonySize: document.getElementById('colony-size').value,
            alpha: document.getElementById('alpha').value,
            beta: document.getElementById('beta').value,
            rho: document.getElementById('rho').value,
            q: document.getElementById('q').value,
            initPheromone: document.getElementById('initial-pheremone').value,
            iterations: document.getElementById('iterations').value,
            type: document.getElementById('type').value,
            minScalingFactor: document.getElementById('min-scaling-factor').value,
            elitistWeight: document.getElementById('elitest-weight').value
        };
        colony.setParams(params);

        infoDisplay.style.display = 'block';

        artist.run(() => {
            iterationInfo.innerText = `${colony.iteration} / ${colony.maxIterations}`;
            bestDistanceInfo.innerText = `${colony.getGlobalBest().tour.distance()}`;
        });
    });

    clearButton.addEventListener('click', () => {
        artist.clearGraph();
        infoDisplay.style.display = 'none';
    })
});


/***/ }),

/***/ "./js/artist.js":
/*!**********************!*\
  !*** ./js/artist.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);


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
            color: "white"
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
                let alpha = 0.1;
                let width = 1;

                if (this.colony.iteration > 0) {
                    width = Math.ceil((edge.pheromone / totalPheromone) * (graphSize * 8));

                    alpha = (edge.pheromone / totalPheromone) * graphSize + 0.1;
                    if (alpha > 0.8) {
                        alpha = 0.8;
                    }
                }

                this.canvas.drawLine(edge.point1().x, edge.point1().y, edge.point2().x, edge.point2().y, {
                    alpha,
                    color: "#0000ff",
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
                    alpha: 0.9,
                    color: '#ffff00'
                });
            }
        }
    }

    drawCurrentBest() {
        const ant = this.colony.getGlobalBest();

        if (ant === null || ant.tour === null) {
            return;
        }

        const tour = ant.tour;
        const alpha = 0.9;
        const color = "#00ff00";
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

/* harmony default export */ __webpack_exports__["default"] = (Artist);

/***/ }),

/***/ "./js/canvas.js":
/*!**********************!*\
  !*** ./js/canvas.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class Canvas {
    constructor(canvas) {
        this.element = canvas
        this.context = canvas.getContext('2d');
        this.canvasPos = canvas.getBoundingClientRect();
        this.click = this.click.bind(this);
        this.clickHook = null;
        this.mousePos = {
            x: 0,
            y: 0
        };
    }

    click(mouseEvent) {
        this.canvasPos = this.element.getBoundingClientRect();
        const mouseX = mouseEvent.clientX - this.canvasPos.left;
        const mouseY = mouseEvent.clientY - this.canvasPos.top;
        this.mousePos.x = mouseX;
        this.mousePos.y = mouseY;

        if (typeof(this.clickHook) === 'function') {
            this.clickHook();
        };
    }

    setClickHook(clickHook) {
        this.clickHook = clickHook;
    }

    drawLine(x0, y0, x1, y1, params) {
        let width = 1;
        let color = '#000';
        let alpha = 1;

        if (params != undefined) {
            if (params.width != undefined) {
                width = params.width;
            }
            if (params.color != undefined) {
                color = params.color;
            }
            if (params.alpha != undefined) {
                alpha = params.alpha;
            }
        }

        this.context.lineWidth = width;
        this.context.globalAlpha = alpha;
        this.context.strokeStyle = color 

        this.context.beginPath();
        this.context.moveTo(x0, y0);
        this.context.lineTo(x1, y1);
        this.context.stroke();
    }

    drawCircle(x, y, params) {
        let size = 6;
        let color = '#000';
        let alpha = 1;

        if (params != undefined) {
            if (params.size != undefined) {
                size = params.size;
            }
            if (params.color != undefined) {
                color = params.color;
            }
            if (params.alpha != undefined) {
                alpha = params.alpha;
            }
        }

        this.context.globalAlpha = alpha;
        this.context.fillStyle = color;
        this.context.beginPath();
        this.context.arc(x, y, size, 0, 2 * Math.PI);
        this.context.fill();
    }

    drawRectangle(a, b, c, d, params) {
        let color = '#000';
        let alpha = 1;

        if (params != undefined) {
            if (params.color != undefined) {
                color = params.color;
            }
            if (params.alpha != undefined) {
                alpha = params.alpha;
            }
        }

        this.context.fillStyle = color;
        this.context.globalAlpha = alpha;
        this.context.fillRect(a, b, c, d)
    }

    clear() {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
    }
}

/* harmony default export */ __webpack_exports__["default"] = (Canvas);


/***/ }),

/***/ "./js/city.js":
/*!********************!*\
  !*** ./js/city.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (City);

/***/ }),

/***/ "./js/colony.js":
/*!**********************!*\
  !*** ./js/colony.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _graph__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./graph */ "./js/graph.js");
/* harmony import */ var _ant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ant */ "./js/ant.js");



class Colony {
    constructor(params) {
        this.graph = new _graph__WEBPACK_IMPORTED_MODULE_0__["default"]();
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
            this.ants.push(new _ant__WEBPACK_IMPORTED_MODULE_1__["default"](this.graph, {
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

/* harmony default export */ __webpack_exports__["default"] = (Colony);

/***/ }),

/***/ "./js/edge.js":
/*!********************!*\
  !*** ./js/edge.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (Edge);

/***/ }),

/***/ "./js/graph.js":
/*!*********************!*\
  !*** ./js/graph.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _city__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./city */ "./js/city.js");
/* harmony import */ var _edge__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edge */ "./js/edge.js");



class Graph {
    constructor() {
        this.cities = [];
        this.edges = {};
    }

    addCity(x, y) {
        this.cities.push(new _city__WEBPACK_IMPORTED_MODULE_0__["default"](x, y));
    }

    addEdge(city1, city2) {
        this.edges[`${city1.toString()}-${city2.toString()}`] = new _edge__WEBPACK_IMPORTED_MODULE_1__["default"](city1, city2);
    }

    getEdge(city1, city2) {
        const edge1 = this.edges[`${city1.toString()}-${city2.toString()}`];
        const edge2 = this.edges[`${city2.toString()}-${city1.toString()}`];
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
        for (const edgeIndex in this.edges) {
            this.edges[edgeIndex].resetPheromone();
        }
    }

    clear() {
        this.cities = [];
        this.edges = {};
    }
}

/* harmony default export */ __webpack_exports__["default"] = (Graph);

/***/ }),

/***/ "./js/tour.js":
/*!********************!*\
  !*** ./js/tour.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (Tour);

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map