import Canvas from './canvas';

class Demo {
    constructor(context) {
        this.canvas = new Canvas(context);
        this.canvas.addEventListener('click', this.canvas.click);
    }

}

export default Demo