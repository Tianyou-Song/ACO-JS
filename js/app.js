"use strict";

import Canvas from './canvas'
import Artist from './artist'
import Colony from './colony'

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas");
    const startButton = document.getElementById('start-button');
    const currentCanvas = new Canvas(canvas);
    const colony = new Colony();
    const artist = new Artist(colony, currentCanvas);
    canvas.addEventListener('click', currentCanvas.click);
    startButton.addEventListener('click', artist.run);
});
