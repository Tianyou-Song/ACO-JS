import Canvas from './canvas';

class Demo {
    constructor(context) {
        this.canvas = new Canvas(context);
    }

    render() {
        this.context.canvas.width = Math.min(window.innerWidth, 720);
        this.context.canvas.height = Math.min(window.innerHeight, 480);
        this.context.fillStyle = 'red';
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height)
    }
}

export default Demo