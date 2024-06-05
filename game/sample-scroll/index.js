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
const size = 32;

let map = [];
map.push(30);
map.push(80);
map.push(40);
map.push(50);
map.push(60);
map.push(100);
map.push(20);

const sizef = 16;
let mapf = [];
let maxf = 16;
for (let i = 0; i < maxf; i++) {
    mapf.push(Math.random() * 100 + 10 ^ 0);
}
const max = map.length;
let sx = 0;
let speed = 2;

let sxf = 0;
let speedf = 1;

function render() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#777';
    let kf = sxf / sizef ^ 0;
    let of = sxf % sizef;
    for (let i = 0; i < maxf; i++) {
        let y = mapf[(kf + i) % maxf];
        let x = i * sizef - of;
        ctx.fillRect(x, y, sizef, H - y);
    }
    ctx.fillStyle = '#444';
    let k = sx / size ^ 0;
    let o = sx % size;
    for (let i = 0; i < max; i++) {
        let y = map[(k + i) % max];
        let x = i * size - o;
        ctx.fillRect(x, y, size, H - y);
    }
}

loop((dt) => {

    sx += speed;
    sxf += speedf;

    render();

}, 1000 / 30);
