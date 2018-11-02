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
        this.context.globalSlpha = alpha;
        this.context.fillRect(a, b, c, d)
    }

    clear() {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
    }
}

export default Canvas
