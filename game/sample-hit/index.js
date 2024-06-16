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
};

let keyState = [];
keyState['ArrowRight'] = 0;
keyState['ArrowLeft'] = 0;
keyState['ArrowUp'] = 0;
keyState['ArrowDown'] = 0;
document.addEventListener('keydown', e => {
    if (e.key in keyState) {
        keyState[e.key] = 1;
        e.preventDefault();
    }
}, false);

document.addEventListener('keyup', e => {
    if (e.key in keyState) {
        keyState[e.key] = 0;
        e.preventDefault();
    }
}, false);

const W = canvas.width;
const H = canvas.height;
let x = 80;
let y = 60;
let dir = Math.PI * 0.5;
let speed = 4;
let rotSpeed = 0.2;

let tx = 0;
let ty = 0;
let feed = false;

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (feed) {
        ctx.fillStyle = '#444';
        ctx.fillRect(tx - 3, ty - 3, 6, 6);
    }
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 8.0;
    let dx = Math.cos(dir);
    let dy = Math.sin(dir);
    ctx.beginPath();
    ctx.moveTo(x + 8 * dx, y + 8 * dy);
    ctx.lineTo(x - 4 * dx, y - 4 * dy);
    ctx.stroke();
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(x + dx, y + dy);
    ctx.lineTo(x - 12 * dx, y - 12 * dy);
    ctx.stroke();
}

loop((dt) => {

    if (!feed) {
        tx = Math.random() * 140 + 10 ^ 0;
        ty = Math.random() * 100 + 10 ^ 0;
        feed = true;
    }

    const keyX = keyState['ArrowRight'] - keyState['ArrowLeft'];
    // const keyY = keyState['ArrowDown'] - keyState['ArrowUp'];


    let d = keyX * rotSpeed;
    dir += d;
    let v = speed;
    let vx = v * Math.cos(dir);
    let vy = v * Math.sin(dir);
    x += vx;
    y += vy;

    if (x <= 4) x = 4;
    if (y <= 4) y = 4;
    if (x >= W - 4) x = W - 4;
    if (y >= H - 4) y = H - 4;

    let dx = x - tx;
    let dy = y - ty;
    if (dx * dx + dy * dy < 8 * 8) {
        feed = false;
    }

    render();
}, 1000 / 30);
