# README

## Ant Colony Optimization Demo

[Ant Colony Optimization](https://en.wikipedia.org/wiki/Ant_colony_optimization_algorithms) (ACO) is a computer algorithm used to solve the classic [traveling salesman problem](https://en.wikipedia.org/wiki/Travelling_salesman_problem). 
It simulates "ants" traveling between the cities", and leaving "pheromone" trails that disapates over time, which influences the probability of other ants picking to travel the same trail.

[Live](https://tianyou-song.github.io/ACO-JS/)

## Architecture and Technologies 

* Vanilla JavaScript for the overall structure as well as the algorithm logic
* `HTML5 Canvas` for DOM manipulation and rendering
* Webpack to bundle and serve up the various scripts

## Features

### HTML5 Canvas

Used to display dynamic and interactive graphics and animations

![alt text]()

```js
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
```

### 