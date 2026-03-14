const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
let time = 0;
function rgba(r, g, b, a) { return `rgb(${r} ${g} ${b}/${a})`; }

let color0 = [255, 0, 0];
let color1 = [0, 0, 0];
let colorBG = '#000';

let loop = false;

function getColor(a) {
    let r = color0[0] * a + color1[0] * (1 - a);
    let g = color0[1] * a + color1[1] * (1 - a);
    let b = color0[2] * a + color1[2] * (1 - a);
    return rgba(r, g, b, 1);
}

function render() {
    ctx.fillStyle = colorBG;
    ctx.fillRect(0, 0, 400, 400);
    // ctx.clearRect(0, 0, 400, 400);
    const d = 200;
    let h = loop ? 100 : 200;
    let k = 0;
    for (let i = 0; i < h; i++, k++) {
        let r0 = time / 20 + Math.PI * k * 2 / d;
        let r1 = time / 20 + Math.PI * (k + 1) * 2 / d;
        let x0 = Math.cos(r0) * 200 + 200,
            y0 = Math.sin(r0) * 200 + 200,
            x1 = Math.cos(r1) * 200 + 200,
            y1 = Math.sin(r1) * 200 + 200;
        let grad3 = ctx.createLinearGradient(x0, y0, x1, y1);
        grad3.addColorStop(0, getColor(i / h));
        grad3.addColorStop(1, getColor((i + 1) / h));
        ctx.fillStyle = grad3;
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, r0 - 0.01, r1 + 0.01, false);
        ctx.fill();
    }
    if (loop) {
        for (let i = 0; i < h; i++, k++) {
            let r0 = time / 20 + Math.PI * k * 2 / d;
            let r1 = time / 20 + Math.PI * (k + 1) * 2 / d;
            let x0 = Math.cos(r0) * 200 + 200,
                y0 = Math.sin(r0) * 200 + 200,
                x1 = Math.cos(r1) * 200 + 200,
                y1 = Math.sin(r1) * 200 + 200;
            let grad3 = ctx.createLinearGradient(x0, y0, x1, y1);
            grad3.addColorStop(0, getColor(1 - i / h));
            grad3.addColorStop(1, getColor(1 - (i + 1) / h));
            ctx.fillStyle = grad3;
            ctx.beginPath();
            ctx.moveTo(200, 200);
            ctx.arc(200, 200, 200, r0 - 0.01, r1 + 0.01, false);
            ctx.fill();
        }
    }
    time += 1.0;
};

const timer = setAnimationFrame(render, 1000 / 30);

canvas.addEventListener('click', e => {
    timer.toggle();
}, false);

document.body.appendChild(createCheckbox('loop', v => {
    loop = v;
    if (!timer.isPlaying()) {
        render();
    }
}));

document.body.appendChild(createColor('color0', '#FF0000', e => {
    color0 = e;
    if (!timer.isPlaying()) {
        render();
    }
}));

document.body.appendChild(createColor('color1', '#000000', e => {
    color1 = e;
    if (!timer.isPlaying()) {
        render();
    }
}));

document.body.appendChild(createColor('background', '#000000', (color, id, text) => {
    colorBG = text;
    if (!timer.isPlaying()) {
        render();
    }
}));
