const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const w = canvas.width;
const h = canvas.height;
let mouseX = 0, mouseY = 0;
let clickX = 0, clickY = 0;
let down = false;
let p0 = {x: 100, y: 100};
let p1 = {x: 250, y: 100};
let p2 = {x: 300, y: 150};
let p3 = {x: 300, y: 300};
let active = {};
let refresh = true;

let isClamp = true;
let shapes = [p1, p2];

const textX = document.getElementById('expression-x');
const textY = document.getElementById('expression-y');
let exp;

function clamp(x, min, max) {
    return x < min ? min : x > max ? max : x;
}

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
    if (down) {
        clickX = mouseX;
        clickY = mouseY;
    }
    e.stopPropagation();
}, false);

setInterval(draw, 33);

function bezier3(p0, p1, p2, p3, t) {
    const t2 = (1 - t) * (1 - t);
    const t3 = (1 - t) * t2;
    return {
        x: t3 * p0.x + 3 * t * t2 * p1.x + 3 * t * t * (1 - t) * p2.x + t * t * t * p3.x,
        y: t3 * p0.y + 3 * t * t2 * p1.y + 3 * t * t * (1 - t) * p2.y + t * t * t * p3.y
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
    const d = new Vector2(mouseX, mouseY);
    
    if (down) {
        shapes.forEach(e => {
            if (d.distance(e) < 6) {
                active = e;
            }
        });
        if (isClamp) {
            active.x = clamp(clickX, p0.x, p3.x);
            active.y = clamp(clickY, p0.y, p3.y);
        } else {
            active.x = clickX;
            active.y = clickY;
        }
    }
    
    // if (!refresh) {
    //     return;
    // }
    // refresh = false;

    ctx.clearRect(0, 0, 400, 400);
    
    ctx.strokeStyle = 'rgba(200, 100, 100, 1.0)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    for(let i = 1; i < 100; i++) {
        let p = bezier3(p0, p1, p2, p3, i / 100);
        ctx.lineTo(p.x, p.y);
    }
    ctx.lineTo(p3.x, p3.y);
    ctx.stroke();

    // ctx.lineWidth = 1.0;
    // ctx.beginPath();
    // ctx.moveTo(p0.x, p0.y);
    // for(let i = 1; i < 100; i++) {
    //     let p = bezier3(p0, p1, p2, p3, i / 100);
    //     ctx.lineTo(p0.x + i * 2, p.y);
    // }
    // ctx.lineTo(p3.x, p3.y);
    // ctx.stroke();

    //     ctx.beginPath();
    // ctx.moveTo(p0.x, p0.y);
    // for(let i = 1; i < 100; i++) {
    //     let p = bezier3(p0, p1, p2, p3, i / 100);
    //     ctx.lineTo(p.x, p0.y + i * 2);
    // }
    // ctx.lineTo(p3.x, p3.y);
    // ctx.stroke();


    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#AAA';
    strokeLine(0, p0.y, w, p0.y);
    strokeLine(p0.x, 0, p0.x, h);
    strokeLine(0, p3.y, w, p3.y);
    strokeLine(p3.x, 0, p3.x, h);

    strokeLine(0, (p0.y + p3.y) * 0.5, w, (p0.y + p3.y) * 0.5);
    strokeLine((p0.x + p3.x) * 0.5, 0, (p0.x + p3.x) * 0.5, h);
    
    ctx.fillStyle = 'rgba(255, 80, 192, 1)';
    // if (d.distance(p0) < 6) {
    //     fillCircle(p0.x, p0.y, 8);
    // } else {
    //     fillCircle(p0.x, p0.y, 4);
    // }
    ctx.fillStyle = 'rgba(155, 187, 89, 1)';
    
    // if (d.distance(p3) < 6) {
    //     fillCircle(p3.x, p3.y, 8);
    // } else {
    //     fillCircle(p3.x, p3.y, 4);
    // }
    
    if (d.distance(p1) < 6) {
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'rgba(128, 128, 128, 0.8)';
        strokeLine(p0.x, p0.y, p1.x,p1.y);

        ctx.fillStyle = 'rgba(128, 60, 162, 1)';
        fillCircle(p1.x ,p1.y, 8);
        
    } else {
        ctx.fillStyle = 'rgba(128, 60, 162, 1)';
        fillCircle(p1.x ,p1.y, 4);
    }

    if (d.distance(p2) < 6) {
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'rgba(128, 128, 128, 0.8)';
        strokeLine(p2.x, p2.y, p3.x,p3.y);

        ctx.fillStyle = 'rgba(128, 60, 162, 1)';
        fillCircle(p2.x, p2.y, 8);
    } else {
        ctx.fillStyle = 'rgba(128, 60, 162, 1)';
        fillCircle(p2.x, p2.y, 4);
    }

    printExpression();
}

printExpression();

function printExpression() {
    let newExp = `(1 - t)^3*${p0.x} + 3*t*(1 - t)^2 * ${p1.x} + 3*t*t*(1 - t)*${p2.x} + t^3*${p3.x}`;
    if (exp !== newExp) {
        exp = newExp;
        textX.textContent = exp;
        textY.textContent = `(1 - t)^3*${p0.y} + 3*t*(1 - t)^2 * ${p1.y} + 3*t*t*(1 - t)*${p2.y} + t^3*${p3.y}`;
    }
}

document.body.appendChild(createCheckbox('clamp', v => {
    isClamp = v;
    if (isClamp) {
        p1.x = clamp(p1.x, p0.x, p3.x);
        p1.y = clamp(p1.y, p0.y, p3.y);
        p2.x = clamp(p2.x, p0.x, p3.x);
        p2.y = clamp(p2.y, p0.y, p3.y);
    }
}, isClamp));
