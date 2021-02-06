
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
    
    for (var i = 1 - itr; i <= itr; i++) {
        x = i / itr * xr;
        y = f(x);
        ctx.lineTo(x * w / 2 + w / 2, h - y * h);
    }
    ctx.stroke();
}

function render() {
    ctx.clearRect(0, 0, w, h);
    plot2D(ctx, gauss.bind(null, 0.5), w, h, 1, 1, 200);
}

render();
