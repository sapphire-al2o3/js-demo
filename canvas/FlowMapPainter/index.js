const canvas = document.getElementsByTagName('canvas');
const ctx = canvas[0].getContext('2d');
let img = new Image(),
    down = false,
    px = 0,
    py = 0,
    power = 16,
    width = canvas[0].width,
    height = canvas[0].height,
    strokeColor = 'rgba(200, 200, 255, 1.0)',
    baseColor = 'rgb(127, 127, 0)';

// let image = ctx.getImageData(0, 0, canvas[0].width, canvas[0].height);

ctx.lineWidth = 32.0;
ctx.strokeStyle = strokeColor;
ctx.fillStyle = strokeColor;
ctx.lineCap = 'round';

ctx.fillStyle = baseColor;
ctx.fillRect(0, 0, width, height);

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

    // normalize
    // let l = dx * dx + dy * dy;
    // dx /= l;
    // dy /= l;

    let r = (dx * 127 ^ 0) + 127;
    let g = (dy * 127 ^ 0) + 127;
    return `rgb(${r}, ${g}, 0)`;
}

canvas[0].addEventListener('mousemove', (e) => {
    if (down) {
        const rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left + 0.5,
            y = e.clientY - rect.top + 0.5;
        
        let dx = px - x,
            dy = py - y;
        
        ctx.strokeStyle = vecColor(dx, dy);

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        px = x;
        py = y;
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
    ctx.lineWidth = e.target.value;
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

