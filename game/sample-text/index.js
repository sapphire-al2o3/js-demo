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

const numPatterns4x6 = [
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
    do {
        let p = numPatterns4x6[d % 10];
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
    } while (d > 0)
}

const charPatterns5x6 = [
    0x1DBDFF7B,
    0x3DBF6F7E,
    0x1DBC636E,
    0x3DBDEF7E,
    0x3F8F631F,
    0x3F8F6318,
    0x1D8C6F6E,
    0x37BFEF7B,
    0x0C6318C6,
    0x0631EF6E,
    0x37BF6F7B,
    0x318C631F,
    0x23BFFF7B,
    0x27BFFF79,
    0x1DBDEF6E,
    0x3DBDEFD8,
    0x1DBDFF6F,
    0x3DBDFB7B,
    0x1F8E38FE,
    0x3E6318C6,
    0x37BDEF6E,
    0x37BDEDC4,
    0x37BFFF71,
    0x37B76F7B,
    0x37B78CC6,
    0x3E33331F
];

function fillText(s, x, y, size) {
    let charSize = size * 6;

    for (let k = 0; k < s.length; k++) {
        let d = s[k].charCodeAt(0) - 'A'.charCodeAt(0);
        let p = charPatterns5x6[d];
        let b = 0;
        for (let i = 6 - 1; i >= 0; i--) {
            for (let j = 5 - 1; j >= 0; j--) {
                if ((p >> b) & 1) {
                    ctx.fillRect(j * size + x + charSize * k, i * size + y, size, size);
                }
                b++;
            }
        }
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

    let mtime = Date.now() - start;

    fillText('TIME', 60, 30, 2);
    fillNum(mtime, 100, 60, 2);

}, 1000 / 30);
