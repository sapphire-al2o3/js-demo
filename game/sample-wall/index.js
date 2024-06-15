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
const size = 10;
let map = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1,
    1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1,
    1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,
    1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1,
    1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1,
    1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1,
    1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

const mapW = 16;
const mapH = 12;

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#777';
    for (let i = 0; i < mapH; i++) {
        for (let j = 0; j < mapW; j++) {
            if (map[i * mapW + j] === 1) {
                ctx.fillRect(j * size, i * size, size, size);
            }
        }
    }

    ctx.fillStyle = '#000';
    ctx.fillRect(x - 4, y - 4, 8, 8);
}

const speed = 4;

loop((dt) => {

    const keyX = keyState['ArrowRight'] - keyState['ArrowLeft'];
    const keyY = keyState['ArrowDown'] - keyState['ArrowUp'];

    let px = x;
    let py = y;
    x += keyX * speed;
    y += keyY * speed;

    let mx = x / size ^ 0;
    let my = y / size ^ 0;
    if (map[my * mapW + mx] === 1) {
        if (map[my * mapW + (px / size ^ 0)] === 0) {
            x = px;
        } else if (map[(py / size ^ 0) * mapW + mx] === 0) {
            y = py;
        } else {
            x = px;
            y = py;
        }
    }

    if (x <= 4) x = 4;
    if (y <= 4) y = 4;
    if (x >= W - 4) x = W - 4;
    if (y >= H - 4) y = H - 4;

    render();

}, 1000 / 30);
