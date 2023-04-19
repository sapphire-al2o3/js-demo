const canvas = document.getElementsByTagName('canvas');
const ctx = canvas[0].getContext('2d');
let img = new Image(),
    down = false,
    px = 0,
    py = 0,
    power = 8,
    pdx = 0,
    pdy = 0,
    weight = 0.2,
    width = canvas[0].width,
    height = canvas[0].height,
    lineWidth = 32.0,
    strokeColor = 'rgba(200, 200, 255, 1.0)',
    baseColor = 'rgb(127, 127, 0)';

// let image = ctx.getImageData(0, 0, canvas[0].width, canvas[0].height);

ctx.lineWidth = lineWidth;
ctx.strokeStyle = strokeColor;
ctx.fillStyle = strokeColor;
ctx.lineCap = 'round';

ctx.fillStyle = baseColor;
ctx.fillRect(0, 0, width, height);

// ctx.globalAlpha = 0.2;

canvas[0].addEventListener('mousedown', (e) => {
    const rect = e.target.getBoundingClientRect();
    down = true;
    px = e.clientX - rect.left + 0.5;
    py = e.clientY - rect.top + 0.5;
    
    // ctx.beginPath();
    // ctx.moveTo(px, py);
}, false);

function clamp(x) {
    return x > 1.0 ? 1.0 : x < -1.0 ? -1.0 : x;
}

function vecColor(dx, dy) {
    
    dx = clamp(dx * power / width);
    dy = clamp(dy * power / height);

    dy *= -1;

    // normalize
    // let l = dx * dx + dy * dy;
    // dx /= l;
    // dy /= l;

    let r = (dx * 127 ^ 0) + 127;
    let g = (dy * 127 ^ 0) + 127;
    return `rgb(${r}, ${g}, 0)`;
}

function vecNormColor(dx, dy) {
    
    dx = clamp(dx * power / width);
    dy = clamp(dy * power / height);

    // normalize
    let l = dx * dx + dy * dy;
    if (l > 0) {
        dx /= l;
        dy /= l;
    }

    let r = (dx * 127 ^ 0) + 127;
    let g = (dy * 127 ^ 0) + 127;
    return `rgb(${r}, ${g}, 0)`;
}

function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}

canvas[0].addEventListener('mousemove', (e) => {
    if (down) {
        const rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left + 0.5,
            y = e.clientY - rect.top + 0.5;
        
        let dx = px - x,
            dy = py - y;
        
        dx = lerp(pdx, dx, weight);
        dy = lerp(pdy, dy, weight);

        ctx.strokeStyle = vecColor(dx, dy);

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        px = x;
        py = y;
        pdx = dx;
        pdy = dy;
    }
}, false);

canvas[0].addEventListener('mouseup', (e) => {
    if (down) {
        down = false;
    }
}, false);

document.getElementById('clear').addEventListener('click', (e) => {
    clearCanvas();
}, false);

document.getElementById('size').addEventListener('change', (e) => {
    ctx.lineWidth = lineWidth = parseInt(e.target.value, 10);
}, false);

document.getElementById('power').addEventListener('change', (e) => {
    power = parseInt(e.target.value, 10);
}, false);

document.getElementById('weight').addEventListener('change', (e) => {
    weight = parseFloat(e.target.value);
}, false);

document.getElementById('tex-size').addEventListener('change', (e) => {
    let size = parseInt(e.target.value, 10);
    canvas[0].width = size;
    canvas[0].height = size;
    width = size;
    height = size;

    ctx.lineCap = 'round';
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);
}, false);

function circle(x, y, r) {
    ctx[3].arc(x, y, r, 0, Math.PI * 2.0, false);
}

function line(x, y, ex, ey) {
    let seg = 20.0;
    let dx = (ex - x) / seg,
        dy = (ey - y) / seg;
    ctx[3].beginPath();
    for (let i = 0; i < seg; i++) {
        circle(dx * i + x, dy * i + y, 1.5);
    }
    ctx[3].fill();
}

function clearCanvas() {
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);
}

function setCap(e) {
    ctx.lineCap = e.checked ? 'round' : 'butt';
}

function setJoin(e) {
    ctx.lineJoin = e.checked ? 'round' : 'miter';
}

