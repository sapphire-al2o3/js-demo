const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
const w = canvas.width;
const h = canvas.height;
const PI2 = Math.PI * 2;
const F = 32;
let wave = 0;

function render() {
    plot();
}

const offsetY = 0;
function plot2D(ctx, f, w, h, xr, yr, itr) {
    itr = itr === undefined ? 100 : itr;
    ctx.beginPath();
    let x = -xr;
    let y = f(x);
    ctx.moveTo(x * w / 2 + w / 2, h - y * h + offsetY);
    
    for (let i = 1 - itr; i <= itr; i++) {
        x = i / itr * xr;
        y = f(x);
        ctx.lineTo(x * w / xr / 2 + w / 2, h * (1 - y) + offsetY);
        y = f(x + 0.0001);
        // ctx.lineTo(x * w / xr / 2 + w / 2, h * (1 - y) + offsetY);
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
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#000';
    if (wave === 0) {
        plot2D(ctx, sawtoothWave, w, h, 2, 1, 100);
    } else if (wave === 1) {
        plot2D(ctx, triangleWave, w, h, 2, 1, 100);
    } else if (wave === 2) {
        plot2D(ctx, squareWave, w, h, 2, 1, 100);
    }
}

render();

document.body.appendChild(createRadio(['Triangle', 'Sawtooth', 'Square'], (v, id, i) => {
    wave = i;
    render();
}));
