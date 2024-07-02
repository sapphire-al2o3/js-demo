
const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');

const w = canvas.width;
const h = canvas.height;

ctx.lineWidth = 1.5;


function gauss(sigma, x) {
    return Math.exp(-(x * x) / (2 * sigma * sigma)) / (Math.sqrt(2 * Math.PI) * sigma);
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

function grid(x, y) {
    for (let i = 1; i < x; i++) {
        ctx.beginPath();
        ctx.moveTo(i * w / x + 0.5, 0);
        ctx.lineTo(i * w / x + 0.5, h);
        ctx.stroke();
    }
}

let sigma = 1;
let rangeX = 4;

function render() {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#AAA';
    ctx.lineWidth = 1.0;
    grid(rangeX, 1);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    plot2D(ctx, gauss.bind(null, sigma), w, h, rangeX, 1, 200);
    ctx.fillText(`σ=${sigma.toFixed(3)}`, 10, 20);
}

document.body.appendChild(createSlider('sigma', 1, v => {
    sigma = v;
    render();
}));

render();
