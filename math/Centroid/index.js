
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let mouse = {x: 0, y: 0};
let clickX = 0, clickY = 0;
let down = false;
let p0 = {x: 100, y: 100, label: 'P0'},
    p1 = {x: 300, y: 300, label: 'P1'},
    p2 = {x: 300, y: 100, label: 'P2'};
let active = {};
let shapes = [p0, p1, p2];

ctx.lineWidth = 2.0;
ctx.font = '9pt consolas';

canvas.addEventListener('mousedown', e => {
    const rect = e.target.getBoundingClientRect();
    clickX = e.clientX - rect.left;
    clickY = e.clientY - rect.top;
    down = true;
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
    var rect = e.target.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    if(down) {
        clickX = mouse.x;
        clickY = mouse.y;
    }
    
    if(mouse.x !== 0 || mouse.y !== 0) {
        draw();
    }
    
    e.stopPropagation();
}, false);

function center() {
    let x = (p0.x + p1.x + p2.x) / 3;
    let y = (p0.y + p1.y + p2.y) / 3;
    return [x, y];
}

function draw() {
    let d = new Vector2(mouse.x, mouse.y);
    if (down) {
        shapes.forEach(e => {
            if (d.distance(e) < 6) {
                active = e;
            }
        });
        active.x = clickX;
        active.y = clickY;
    }
    
    
    ctx.clearRect(0, 0, 400, 400);
    ctx.strokeStyle = '#999';
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p0.x, p0.y);
    ctx.stroke();
    ctx.strokeStyle = '#000';
    shapes.forEach(e => {
        if (d.distance(e) < 6) {
            ctx.strokeCircle(e.x, e.y, 6);
        } else {
            ctx.strokeCircle(e.x, e.y, 3);
        }
        ctx.fillText(e.label, e.x, e.y - 8);
    });

    let [x, y] = center();
    ctx.strokeCircle(x, y, 3);
}
draw();
