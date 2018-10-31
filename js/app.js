"use strict";

import Demo from './demo'

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    const demo = new Demo(context);
    demo.render();
});
