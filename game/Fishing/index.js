const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function loop(callback, interval) {
    let elapsed = 0,
        time = Date.now();

    const update = () => {
        const delta = Date.now() - time;
        time = Date.now();
        elapsed += delta;
        if(elapsed >= interval) {
            let n = elapsed / interval ^ 0;
            elapsed -= n * interval;
            callback(delta);
        }

        requestAnimationFrame(update);
    };

    update();
}

function clamp(x, min, max) {
    return x < min ? min : x > max ? max : x;
}

const ShotKey = 'Space';
let keyState = [];
keyState['ArrowRight'] = 0;
keyState['ArrowLeft'] = 0;
keyState['ArrowUp'] = 0;
keyState['ArrowDown'] = 0;
keyState[ShotKey] = 0;
document.addEventListener('keydown', e => {
    if (e.code in keyState) {
        keyState[e.code] = 1;
        e.preventDefault();
    }
}, false);

document.addEventListener('keyup', e => {
    if (e.code in keyState) {
        keyState[e.code] = 0;
        e.preventDefault();
    }
}, false);

let mousex = 0;
let mousey = 0;
let mousedown = false;
canvas.addEventListener('mousedown', e => {
    mousex = e.offsetX;
    mousey = e.offsetY;
    mousedown = true;
}, false);

canvas.addEventListener('mouseup', e => {
    mousex = e.offsetX;
    mousey = e.offsetY;
    mousedown = false;
}, false);

const W = canvas.width;
const H = canvas.height;
let x = W / 2 ^ 0;
let y = H - 4;
let isGround = true;
let vy = 0;
const g = 1;

const shotMax = 5;
let shot = [];
let shotCount = 0;
let shotInterval = 4;
const shotSpeed = -4;
let fish = {
    x: W / 2 ^ 0,
    y: H / 2 ^ 0,
    d: 0
};

let rodx = x;
let rody = y;
let rodd = Math.PI * 270 / 180;
let rodl = 32;
let px = 30;
let py = 60;

let ripple = [
    {
        x: 30,
        y: 20,
        r: 0
    }
];

function drawLine(x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

function drawCircle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    // ctx.fillRect(x - 4, y - 4, 8, 8);

    let dx = Math.cos(rodd) * rodl + rodx;
    let dy = Math.sin(rodd) * rodl + rody;
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3.0;
    drawLine(rodx, rody, dx, dy);

    ctx.strokeStyle = '#666';
    ctx.lineWidth = 0.5;
    drawLine(dx, dy, px, py);

    ctx.fillStyle = '#222';
    for (let i = 0; i < shotCount; i++) {
        ctx.fillRect(shot[i].x - 2, shot[i].y - 2, 4, 8);
    }

    // ripple
    ctx.lineWidth = 1.0;
    for (let i = 0; i < ripple.length; i++) {
        let y = clamp(ripple[i].r / 8 * 100 + 155 ^ 0, 0, 255);
        ctx.strokeStyle = `rgb(${y},${y},${y})`;
        drawCircle(ripple[i].x, ripple[i].y, ripple[i].r);
    }

    ctx.fillRect(fish.x, fish.y, 4, 4);
}

loop((dt) => {

    vy += g;
    y += vy;

    for (let i = 0; i < shotCount; i++) {
        shot[i].y += shotSpeed;
    }
    for (let i = 0; i < shotCount; i++) {
        if (shot[i].y >= H + 4 || shot[i].y <= -4) {
            shot[i] = shot[shotCount - 1];
            shotCount--;
        }
    }

    if (x <= 4) x = 4;
    if (y <= 4) y = 4;
    if (x >= W - 4) x = W - 4;
    if (y >= H - 4) {
        y = H - 4;
    }

    if (mousedown) {
        px = mousex;
        py = mousey;

        for (let i = 0; i < ripple.length; i++) {
            ripple[i].x = mousex;
            ripple[i].y = mousey;
        }
    }

    if (shotInterval == 0 && keyState[ShotKey]) {
        if (shotCount < shotMax) {
            shot[shotCount] = {
                x: x,
                y: y
            };
            shotCount++;
            shotInterval = 4;
        }
    }
    if (shotInterval > 0) {
        shotInterval--;
    }

    for (let i = 0; i < ripple.length; i++) {
        ripple[i].r += 0.1;
        if (ripple[i].r > 8) {
            ripple[i].r = 0;
        }
    }

    render();

}, 1000 / 30);
