const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');

const w = canvas.width;
const h = canvas.height;

ctx.lineWidth = 1.5;

let s = 0;
let e = 4;
let d = e - s;

function lerp(s, e, t) {
    return e * t + s * (1.0 - t);
}

function plot2D(ctx, f, w, h, itr) {
    itr = itr === undefined ? 100 : itr;
    ctx.beginPath();
    let x = -1;
    let y = f(x);
    ctx.moveTo(x * w, h - y * h);
    
    for (var i = 1 - itr; i <= itr; i++) {
        x = i / itr;
        y = f(x);
        y /= d;
        ctx.lineTo(x * w, h - y * h);
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
    for (let i = 1; i < y; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * h / y + 0.5);
        ctx.lineTo(w, i * h / y + 0.5);
        ctx.stroke();
    }
}

let rangeX = 4;

function render(f) {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#AAA';
    ctx.lineWidth = 1.0;
    grid(0, 4);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2.5;
    plot2D(ctx, f, w, h, 400);
}

function linear(t) {
    return lerp(s, e, t);
}
function floor(t) {
    return Math.floor(lerp(s, e, t));
}
function ceil(t) {
    return Math.ceil(lerp(s, e, t));
}

function ceilfix(t) {
    return t === 1 ? e : Math.ceil(lerp(s, e - 1, t));
}

function print(f) {
    for (let i = 0; i <= 1.0; i += 0.25) {
        console.log(i, f(i));
    }
}

document.body.appendChild(createRadio(['linear', 'floor', 'ceil', 'ceil_fix'], (checked, id) => {
    if (id === 'linear') {
        render(linear);
    } else if (id === 'floor') {
        render(floor);
    } else if (id === 'ceil') {
        render(ceil);
    } else if (id === 'ceil_fix') {
        render(ceilfix);
    }
}, 0));

render(linear);
