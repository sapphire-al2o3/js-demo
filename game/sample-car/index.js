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
let x = 4;
let y = 4;
let dir = Math.PI * 0.5;
let speed = 4;

loop((dt) => {

    const keyX = keyState['ArrowRight'] - keyState['ArrowLeft'];
    const keyY = keyState['ArrowDown'] - keyState['ArrowUp'];

    let d = keyX * 0.2;
    dir += d;
    let vx = keyY * speed * Math.cos(dir);
    let vy = keyY * speed * Math.sin(dir);
    x += vx;
    y += vy;

    if (x <= 4) x = 4;
    if (y <= 4) y = 4;
    if (x >= W - 4) x = W - 4;
    if (y >= H - 4) y = H - 4;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 8.0;
    ctx.beginPath();
    let dx = Math.cos(dir);
    let dy = Math.sin(dir);
    ctx.moveTo(x + 8 * dx, y + 8 * dy);
    ctx.lineTo(x - 8 * dx, y - 8 * dy);
    ctx.stroke();

}, 1000 / 30);
