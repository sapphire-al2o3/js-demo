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
let count = 0;

let feed = [];
for (let i = 0; i < 4; i++) {
    feed.push({
        x: 0,
        y: 0,
        alive: false
    });
}

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

function fillText(s, x, y, size) {
    let charSize = size * 5;

    for (let k = 0; k < s.length; k++) {
        let d = s[k].charCodeAt(0) - '0'.charCodeAt(0);
        let p = numPatterns4x6[d];
        let b = 23;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 4; j++) {
                if ((p >> b) & 1) {
                    ctx.fillRect(j * size + x + charSize * k, i * size + y, size, size);
                }
                b--;
            }
        }
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < feed.length; i++) {
        ctx.fillStyle = '#444';
        ctx.fillRect(feed[i].x - 3, feed[i].y - 3, 6, 6);
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

    fillText(count.toString(), 10, 4, 2);
}

loop((dt) => {
    for (let i = 0; i < feed.length; i++) {
        if (!feed[i].alive) {
            feed[i].x = Math.random() * (W - 20) + 10 ^ 0;
            feed[i].y = Math.random() * (H - 20) + 10 ^ 0;
            feed[i].alive = true;
        }
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

    for (let i = 0; i < feed.length; i++) {
        let dx = x - feed[i].x;
        let dy = y - feed[i].y;
        if (dx * dx + dy * dy < 8 * 8) {
            feed[i].alive = false;
            count++;
        }
    }

    render();
}, 1000 / 30);
