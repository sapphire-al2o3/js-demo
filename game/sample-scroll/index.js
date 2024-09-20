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

const W = canvas.width;
const H = canvas.height;

let map = [];
map.push([]);
for (let i = 0; i < 16; i++) {
    map[0].push(Math.random() * 100 + 10 ^ 0);
}

map.push([
    30,
    80,
    40,
    50,
    60,
    100,
    20
]);

const size = [16, 32];
const max = [map[0].length, map[1].length];
let sx = [0, 0];
let speed = [1, 2];

function renderBG(map, sx, size, max) {
    let k = sx / size ^ 0;
    let o = sx % size;
    for (let i = 0; i < max; i++) {
        let y = map[(k + i) % max];
        let x = i * size - o;
        ctx.fillRect(x, y, size, H - y);
    }
}

function render() {
    ctx.clearRect(0, 0, W, H);
    // far
    ctx.fillStyle = '#777';
    renderBG(map[0], sx[0], size[0], max[0]);
    // near
    ctx.fillStyle = '#444';
    renderBG(map[1], sx[1], size[1], max[1]);
}

loop((dt) => {

    sx[0] += speed[0];
    sx[1] += speed[1];

    render();

}, 1000 / 30);
