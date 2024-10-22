
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let mouse = {x: 0, y: 0};
let clickX = 0, clickY = 0;
let down = false;
let p0 = {x: 100, y: 300, label: 'P0'},
    p1 = {x: 300, y: 300, label: 'P1'},
    p2 = {x: 200, y: 100, label: 'P2'},
    p3 = {x: 240, y: 80, label: 'P3'};
let active = {};
let shapes = [p0, p1, p2, p3];
let count = 3;
let lines = false;

ctx.lineWidth = 2.0;
ctx.font = '9pt consolas';

canvas.addEventListener('mousedown', e => {
    const rect = e.target.getBoundingClientRect();
    clickX = e.clientX - rect.left;
    clickY = e.clientY - rect.top;
    down = true;
    draw();
}, false);

canvas.addEventListener('mouseup', e => {
    down = false;
    active = {};
}, false);

canvas.addEventListener('mouseout', e => {
    down = false;
    active = {};
}, false);

canvas.addEventListener('mousemove', e => {
    let rect = e.target.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    if (down) {
        clickX = mouse.x;
        clickY = mouse.y;
    }
    
    if (mouse.x !== 0 || mouse.y !== 0) {
        draw();
    }
    
    e.stopPropagation();
}, false);

function cross(x0, y0, x1, y1) {
    return x0 * y1 - x1 * y0;
}

function inside() {
    const d0 = cross(p1.x - p0.x, p1.y - p0.y, p3.x - p0.x, p3.y - p0.y);
    const d1 = cross(p2.x - p1.x, p2.y - p1.y, p3.x - p1.x, p3.y - p1.y);
    const d2 = cross(p0.x - p2.x, p0.y - p2.y, p3.x - p2.x, p3.y - p2.y);

    return d0 > 0 && d1 > 0 && d2 > 0 || d0 < 0 && d1 < 0 && d2 < 0;
}


function draw() {
    let d = new Vector2(mouse.x, mouse.y);
    if (down) {
        p3.x = clickX;
        p3.y = clickY;
    }
    
    
    ctx.clearRect(0, 0, 400, 400);
    ctx.strokeStyle = '#999';
    ctx.fillStyle = '#CCF';
    ctx.beginPath();
    
    ctx.moveTo(shapes[0].x, shapes[0].y);
    for (let i = 1; i < count; i++) {
        ctx.lineTo(shapes[i].x, shapes[i].y);
    }
    ctx.lineTo(shapes[0].x, shapes[0].y);
    ctx.stroke();

    
    ctx.strokeStyle = '#000';
    for (let i = 0; i < count; i++) {
        const e = shapes[i];
        if (d.distance(e) < 6) {
            ctx.strokeCircle(e.x, e.y, 6);
        } else {
            ctx.strokeCircle(e.x, e.y, 3);
        }
        ctx.fillText(e.label, e.x, e.y - 8);
    }
    
    ctx.strokeStyle = inside() ? '#37E' : '#E37';
    ctx.strokeCircle(p3.x, p3.y, 3);
}
draw();
