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

const W = canvas.width;
const H = canvas.height;
let x = 80;
let y = 120 - 4;
let isGround = true;
let vy = 0;
const g = 1;

const shotMax = 5;
let shot = [];
let shotCount = 0;
let shotInterval = 4;
const shotSpeed = -4;



function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(x - 4, y - 4, 8, 8);

    ctx.fillStyle = '#222';
    for (let i = 0; i < shotCount; i++) {
        ctx.fillRect(shot[i].x - 2, shot[i].y - 2, 4, 8);
    }
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

    render();

}, 1000 / 30);
