const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
const w = canvas.width;
const h = canvas.height;
const PI2 = Math.PI * 2;
const F = 32;

function clamp(x, min, max) {
    return x < min ? min : x > max ? max : x;
}

function sin(x) {
    return clamp(Math.sin(x) * 2, 0, 1);
}

function cos(x) {
    return clamp(Math.cos(x) * 0.5 + 0.5, 0, 1);
}

function render() {
    plot();
}

function plot2D(ctx, f, w, h, xr, yr, itr) {
    itr = itr === undefined ? 100 : itr;
    ctx.beginPath();
    let x = -xr;
    let y = f(x);
    ctx.moveTo(x * w / 2 + w / 2, h - y * h);
    
    for (let i = 1 - itr; i <= itr; i++) {
        x = i / itr * xr;
        y = f(x);
        ctx.lineTo(x * w / xr / 2 + w / 2, h - y * h);
    }
    ctx.stroke();
}

const triangleWave = (x) => {
    x = x - Math.floor(x);
    return Math.abs(x - 0.5) * 2;
};

const sawtoothWave = (x) => {
    return x - Math.floor(x);
};

const squareWave = (x) => {
    x = x - Math.floor(x) - 0.5;
    return Math.max(x, 0) > 0 ? 1 : 0;
};

function plot() {
    ctx.clearRect(0, 0, graph.width, graph.height);
    ctx.strokeStyle = '#000';
    plot2D(ctx, sawtoothWave, graph.width, graph.height, 2, 1, 100);
    ctx.strokeStyle = '#0F0';
    plot2D(ctx, triangleWave, graph.width, graph.height, 2, 1, 100);
    ctx.strokeStyle = '#00F';
    plot2D(ctx, squareWave, graph.width, graph.height, 2, 1, 300);
}

render();
