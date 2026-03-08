const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
let time = 0;
function rgba(r, g, b, a) { return 'rgba(' + (r^0) + ',' + g + ',' + b + ',' + a + ')'; };

let color0 = [255, 0, 0];
let color1 = [0, 0, 0];

function getColor(a) {
    let r = color0[0] * a + color1[0] * (1 - a);
    let g = color0[1] * a + color1[1] * (1 - a);
    let b = color0[2] * a + color1[2] * (1 - a);
    return rgba(r, g, b, 1);
}

const timer = setAnimationFrame(() => {
    ctx.clearRect(0, 0, 400, 400);
    var d = 200;
    for (let i = 0; i < d; i++) {
        let r0 = time / 20 + Math.PI * i * 2 / d;
        let r1 = time / 20 + Math.PI * (i + 1) * 2 / d;
        let x0 = Math.cos(r0) * 200 + 200,
            y0 = Math.sin(r0) * 200 + 200,
            x1 = Math.cos(r1) * 200 + 200,
            y1 = Math.sin(r1) * 200 + 200;
        let grad3 = ctx.createLinearGradient(x0, y0, x1, y1);
        grad3.addColorStop(0, getColor(i / d));
        grad3.addColorStop(1, getColor((i + 1) / d));
        ctx.fillStyle = grad3;
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, r0 - 0.01, r1 + 0.01, false);
        ctx.fill();
    }
    time += 1.0;
}, 1000 / 30);

canvas.addEventListener('click', e => {
    timer.toggle();
}, false);

