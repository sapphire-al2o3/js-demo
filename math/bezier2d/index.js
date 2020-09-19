const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let mouseX = 0, mouseY = 0;
let clickX = 0, clickY = 0;
let down = false;
let begin = {x: 100, y: 100};
let end = {x: 300, y: 300};
let middle = {x: 300, y: 100};
let active = {};
let shapes = [begin, end, middle];


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
    const rect = e.target.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    if(down) {
        clickX = mouseX;
        clickY = mouseY;
    }
    e.stopPropagation();
}, false);

setInterval(draw, 33);

function bezier2(p0, p1, p2, t) {
    return {
        x: (1 - t) * (1 - t) * p0.x + 2 * t * (1 - t) * p1.x + t * t * p2.x,
        y: (1 - t) * (1 - t) * p0.y + 2 * t * (1 - t) * p1.y + t * t * p2.y
    };
}

function fillCircle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.fill();
}

function strokeLine(a, b, c, d) {
    ctx.beginPath();
    ctx.moveTo(a, b);
    ctx.lineTo(c, d);
    ctx.stroke();
}

function draw() {
    var d = new Vector2(mouseX, mouseY);
    
    if(down) {
        shapes.forEach(function(e) {
        if(d.distance(e) < 6) {
            active = e;
        }
        });
        active.x = clickX;
        active.y = clickY;
    }
    
    ctx.clearRect(0, 0, 400, 400);
    
    ctx.strokeStyle = 'rgba(200, 100, 100, 1.0)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(begin.x, begin.y);
    for(let i = 1; i < 100; i++) {
        let p = bezier2(begin, middle, end, i / 100);
        ctx.lineTo(p.x, p.y);
    }
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(77, 80, 192, 1)';
    if(d.distance(begin) < 6) {
        fillCircle(begin.x, begin.y, 8);
    } else {
        fillCircle(begin.x, begin.y, 4);
    }
    ctx.fillStyle = 'rgba(155, 187, 89, 1)';
    
    if(d.distance(end) < 6) {
        fillCircle(end.x, end.y, 8);
    } else {
        fillCircle(end.x, end.y, 4);
    }
    
    if(d.distance(middle) < 6) {
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'rgba(128, 128, 128, 0.8)';
        strokeLine(end.x, end.y, middle.x, middle.y);
        strokeLine(begin.x, begin.y, middle.x, middle.y);
        ctx.fillStyle = 'rgba(128, 60, 162, 1)';
        fillCircle(middle.x ,middle.y, 8);
        
    } else {
        ctx.fillStyle = 'rgba(128, 60, 162, 1)';
        fillCircle(middle.x ,middle.y, 4);
    }
}