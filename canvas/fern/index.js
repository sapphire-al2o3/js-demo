const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
let x = 0;
let y = 0;

function hsl(h, s, l) { return 'hsl(' + h + ',' + s + '%,' + l + '%)'; }

const setAnimFrame = (callback, interval) => {
    let elapsed = 0,
        time = Date.now(),
        stop = false;
    
    const update = () => {
        let delta = Date.now() - time;
        time = Date.now();
        elapsed += delta;
        if (elapsed >= interval) {
            var n = elapsed / interval ^ 0;
            elapsed -= n * interval;
            callback();
        }
        
        if (!stop) {
            requestAnimationFrame(update);
        }
    };
    
    update();
    
    return {
        toggle: function() {
            stop = !stop;
            if (!stop) {
                update();
            }
        }
    };
};

ctx.clearRect(0, 0, canvas.width, canvas.height);

let t = 0.0,
    n = 16,
    s = 0.01,
    dot = false;

function moveAll() {

    let nextX, nextY;
    let r = Math.random();

    if (r < 0.01) {
        nextX = 0;
        nextY = 0.16 * y;
    } else if (r < 0.86) {
        nextX = 0.85 * x + 0.04 * y;
        nextY = -0.04 * x + 0.85 * y + 1.6;
    } else if (r < 0.93) {
        nextX = 0.20 * x - 0.26 * y;
        nextY = 0.23 * x + 0.22 * y + 1.6;
    } else {
        nextX = -0.15 * x + 0.28 * y;
        nextY = 0.26 * x + 0.24 * y + 0.44;
    }

    let px = width * (x + 3) / 6;
    let py = height - height * ((y + 2) / 14);

    ctx.fillStyle = 'rgba(0,255,40,0.5)'
    ctx.beginPath();
    ctx.arc(px, py, 1, 0, 2 * Math.PI, true);
    ctx.fill();

    x = nextX;
    y = nextY;
}

function render() {
    for (let i = 0; i < 20; i++) {
        moveAll();
    }
}

let hook = setAnimFrame(render, 1000 / 30),
    playing = true;

canvas.addEventListener('click', () => {
    hook.toggle();
}, false);
