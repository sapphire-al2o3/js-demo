const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const w = canvas.width;
const h = canvas.height;
    
let px = 0,
    py = 0,
    rect,
    rot = 32,
    down = false;

ctx.lineWidth = 1.0;
ctx.strokeStyle = 'rgba(255, 100, 20, 0.5)';

function mousemove(e) {
    if(down) {
        let x = e.pageX - rect.left + 0.5,
            y = e.pageY - rect.top + 0.5;
        
        render(x, y, px, py);
        
        px = x;
        py = y;
    }
}

function mouseup(e) {
    if(down) {
        down = false;
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
    }
}

function mousedown(e) {
    rect = e.target.getBoundingClientRect();
    px = e.pageX - rect.left + 0.5;
    py = e.pageY - rect.top + 0.5;
    down = true;
    
    document.addEventListener('mousemove', mousemove, false);
    document.addEventListener('mouseup', mouseup, false);
}
    
canvas.addEventListener('mousedown', mousedown, false);
    
document.getElementById('clear').addEventListener('click', () => {
    ctx.fillStyle = '#000';
    ctx.clearRect(0, 0, w, h);
    ctx.fillRect(0, 0, w, h);
});

document.getElementById('r16').addEventListener('click', e => {
    s = 16;
    document.querySelector('.selected').className = '';
    e.target.className = 'selected';
});
document.getElementById('r8').addEventListener('click', e => {
    s = 8;
    document.querySelector('.selected').className = '';
    e.target.className = 'selected';
});
document.getElementById('r4').addEventListener('click', e => {
    s = 4;
    document.querySelector('.selected').className = '';
    e.target.className = 'selected';
});
document.getElementById('r2').addEventListener('click', e => {
    s = 2;
    document.querySelector('.selected').className = '';
    e.target.className = 'selected';
});

document.getElementById('flip').addEventListener('click', e => {
    flip = !flip;
    e.target.className = e.target.className == 'selected' ? '' : 'selected';
});

let s = 8;
let flip = false;

document.getElementById('r8').className = 'selected';

function drawLine(x, y, px, py) {
    let sx = w / s,
        sy = h / s;

    let ex = 1,
        ey = 1;
    
    if (!flip) {
        ex = 1 - (x / sx ^ 0) % 2;
        ey = 1 - (y / sy ^ 0) % 2;
    }

    x = x % sx;
    y = y % sy;
    px = px % sx;
    py = py % sy;

    for (let i = 0; i < s; i++) {
        for (let j = 0; j < s; j++) {
            let ax = px,
                ay = py,
                bx = x,
                by = y;
            if (i % 2 == ex) {
                ax = sx - ax;
                bx = sx - bx;
            }
            if (j % 2 == ey) {
                ay = sy - ay;
                by = sy - by;
            }
            ctx.beginPath();
            ctx.moveTo(ax + sx * i, ay + sy * j);
            ctx.lineTo(bx + sx * i, by + sy * j);
            ctx.stroke();
        }
    }
}

function render(x, y, px, py) {
    let sx = w / s,
        sy = h / s;
    
    let mx = x / sx ^ 0,
        my = y / sy ^ 0,
        mpx = px / sx ^ 0,
        mpy = py / sy ^ 0;

    // console.log(mx, my, mpx, mpy);

    if (mx !== mpx) {
        let dx = x - px,
            dy = y - py;
        console.log(x, y, px, py);
        if (dx === 0) console.error('err');
        let xx = mx > mpx ? mx * sx : mpx * sx;
        let yy = dy / dx * (xx - px) + py;
        console.log(xx, yy, px, py);
        drawLine(xx, yy, px, py);
        return;
        px = xx;
        py = yy;
    }
    if (my !== mpy) {
        return;
    }

    drawLine(x, y, px, py);
}

// render(10, 10, 300, 100);
// render(300, 100, 10, 10);
// render(300, 100, 200, 150);

