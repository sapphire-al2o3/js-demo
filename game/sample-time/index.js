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

const start = Date.now();

const numPatterns = [
    0x699996,
    0x622222,
    0x69124F,
    0xE16196,
    0x6AAAF2,
    0xF8E11E,
    0x68E996,
    0xF12244,
    0x696996,
    0x699716
];

function fillNum(n, x, y, size) {
    let d = n;
    let charSize = size * 5;
    let k = 0;
    while (d > 0) {
        let p = numPatterns[d % 10];
        let b = 23;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 4; j++) {
                if ((p >> b) & 1) {
                    ctx.fillRect(j * size + x - charSize * k, i * size + y, size, size);
                }
                b--;
            }
        }
        d = d / 10 ^ 0;
        k++;
    }
}

loop((dt) => {

    const keyX = keyState['ArrowRight'] - keyState['ArrowLeft'];
    const keyY = keyState['ArrowDown'] - keyState['ArrowUp'];

    let d = keyX * rotSpeed;
    dir += d;
    let v = keyY * speed;
    let vx = v * Math.cos(dir);
    let vy = v * Math.sin(dir);
    x += vx;
    y += vy;

    if (x <= 4) x = 4;
    if (y <= 4) y = 4;
    if (x >= W - 4) x = W - 4;
    if (y >= H - 4) y = H - 4;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    // ctx.lineWidth = 8.0;
    // ctx.beginPath();
    // let dx = Math.cos(dir);
    // let dy = Math.sin(dir);
    // ctx.moveTo(x + 8 * dx, y + 8 * dy);
    // ctx.lineTo(x - 8 * dx, y - 8 * dy);
    // ctx.stroke();

    let mtime = Date.now() - start;
    ctx.font = '12px serif';
    ctx.textAlign = 'center';
    ctx.fillText(mtime / 1000 ^ 0, W / 2, H / 2);

    fillNum(1234567890, 100, 10, 2);

}, 1000 / 30);
