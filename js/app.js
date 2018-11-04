"use strict";

import Canvas from './canvas'
import Artist from './artist'
import Colony from './colony'

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

    const currentCanvas = new Canvas(canvas);
    const colony = new Colony();
    const artist = new Artist(colony, currentCanvas);

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
