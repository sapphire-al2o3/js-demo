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
let x = 4;
let y = 4;

loop((dt) => {

    if (x <= 4) x = 4;
    if (y <= 4) y = 4;
    if ()

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(x - 4, y - 4, 8, 8);

}, 1000 / 30);
