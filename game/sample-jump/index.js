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

const JumpKey = 'Space';
let keyState = [];
keyState['ArrowRight'] = 0;
keyState['ArrowLeft'] = 0;
keyState['ArrowUp'] = 0;
keyState['ArrowDown'] = 0;
keyState[JumpKey] = 0;
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

const W = canvas.width;
const H = canvas.height;
let x = 80;
let y = 120 - 4;
let isGround = true;
let vy = 0;
const g = 1;

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(x - 4, y - 4, 8, 8);
}

loop((dt) => {

    vy += g;
    y += vy;

    if (x <= 4) x = 4;
    if (y <= 4) y = 4;
    if (x >= W - 4) x = W - 4;
    if (y >= H - 4) {
        y = H - 4;
        isGround = true;
    }

    if (isGround && keyState[JumpKey]) {
        isGround = false;
        vy = -9;
    }

    render();

}, 1000 / 30);
