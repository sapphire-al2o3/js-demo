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
keyState['Space'] = 0;
keyState['Enter'] = 0;
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

function resetKey() {
    for (let key in keyState) {
        keyState[key] = 0;
    }
}

const W = canvas.width;
const H = canvas.height;

const padW = 16;
let x = 80;
let y = 120;

const blockSize = 8;
const stageW = 12;
const stageH = 22;

const offsetX = 8;
const offsetY = -24;

const ball = {
    x: 0,
    y: 0,
    vx: 2,
    vy: 2
}

let stage = [];

function initStage() {
}


let frame = 0;
let pause = false;
let gameover = false;
let score = 0;

const numPatterns5x6 = [
    0x1DBDEF6E,
    0x1C6318C6,
    0x1DB1999F,
    0x1DB30F6E,
    0x0EFDEFE3,
    0x3F8F0C7E,
    0x1D8F6F6E,
    0x3FB198C6,
    0x1DB76F6E,
    0x1DBDBC6E
];
const numW = 5;
const numH = 6;

function fillNum(n, x, y, size = 1) {
    let d = n;
    let charSize = size * (numW + 1);
    let k = 0;
    do {
        let p = numPatterns5x6[d % 10];
        let b = numW * numH - 1;
        for (let i = 0; i < numH; i++) {
            for (let j = 0; j < numW; j++) {
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

function fillText(s, x, y, size = 1) {
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

const colors = [
    '#598000',
    '#003000',
    '#26560a'
];

function drawBall() {
    const x = ball.x ^ 0;
    const y = ball.y ^ 0;
    ctx.fillStyle = colors[2];
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
}

function draw() {
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = colors[1];
    
    ctx.fillRect(x - padW / 2, y, padW, 4);

    drawBall();
    // ctx.fillRect(ball.x, ball.y, 2, 2);

    if (pause) {
        ctx.fillStyle = colors[2];
        fillText('PAUSE', 42, 64);
    }
}

let speed = 20;
let fallCount = 0;
let vx = 4;

loop((dt) => {

    let dx = keyState['ArrowRight'] - keyState['ArrowLeft'];
    let dy = keyState['ArrowUp'] - keyState['ArrowDown'];

    if (keyState['Enter']) {
        pause = !pause;
    }

    if (pause) {
        resetKey();
        draw();
        return;
    }

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.x < 0 || ball.x >= W) {
        ball.vx *= -1;
    }
    if (ball.y < 0 || ball.y >= H) {
        ball.vy *= -1;
    }

    x += dx * vx;
    // y += keyY * 4;


    if (x <= padW / 2) x = padW / 2;
    if (x >= W - padW / 2) x = W - padW / 2;
    if (y >= H - 1) y = H - 1;

    draw();

}, 1000 / 30);
