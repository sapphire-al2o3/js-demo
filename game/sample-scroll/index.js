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
let isGround = true;
let vy = 0;
const g = 1;

let map = [];
map.push(30);
map.push(80);
map.push(40);
map.push(50);
let sx = 0;
let svx = 4;

function render() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#000';
    let k = sx / 40 ^ 0;
    for (let i = 0; i < 4; i++) {
        let y = map[(k + i) % 4];
        let x = i * 40;
        ctx.fillRect(x, y, 40, H - y);
    }
}

loop((dt) => {

    sx += svx;

    render();

}, 1000 / 30);
