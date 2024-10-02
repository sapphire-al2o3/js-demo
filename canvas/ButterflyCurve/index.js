const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;

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

function render() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < n; i++) {
        let r = Math.PI * 2.0 / n * i;
        let th = t + r;
        let z = Math.exp(Math.cos(th)) - 2 * Math.cos(4 * th) - Math.pow(Math.sin(th / 12), 5);
        let x = centerX - Math.sin(th) * 50 * z,
            y = centerY - Math.cos(th) * 50 * z;

        if (dot) {
            ctx.fillStyle = hsl(t * 100 ^ 0, 100, 50);
            ctx.fillRect(x, y, 2, 2);
        } else {
            th = th - s;
            let pz = Math.exp(Math.cos(th)) - 2 * Math.cos(4 * th) - Math.pow(Math.sin(th / 12), 5);
            let px = centerX - Math.sin(th) * 50 * pz,
                py = centerY - Math.cos(th) * 50 * pz;
            
            ctx.strokeStyle = hsl(t * 100 ^ 0, 100, 50);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(px, py);
            ctx.stroke();
        }
    }
    t += s;
}

let hook = setAnimFrame(render, 1000 / 30),
    playing = true;

canvas.addEventListener('click', () => {
    hook.toggle();
}, false);

document.body.appendChild(createSlider('s', 0, (v) => {
    s = 0.01 + v * 0.04;
}));
document.body.appendChild(createSlider('n', n / 32, (v) => {
    n = v * 32 ^ 0 + 1;
}));
document.body.appendChild(createCheckbox('dot', (v) => {
    dot = v;
}));
