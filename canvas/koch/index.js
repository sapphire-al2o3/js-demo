const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const w = canvas.width;
const h = canvas.height;
const TO_RAD = Math.PI / 180;
const ROT_60 = TO_RAD * 60;

function koch(n, p1, p2) {
    if (n === 0) {
        if (!fill) {
            ctx.beginPath();
            ctx.moveTo(p1[0], p1[1]);
            ctx.lineTo(p2[0], p2[1]);
            ctx.stroke();
        }
        return;
    }

    const sx = 2 * p1[0] / 3 + p2[0] / 3;
    const sy = 2 * p1[1] / 3 + p2[1] / 3;
    const tx = p1[0] / 3 + 2 * p2[0] / 3;
    const ty = p1[1] / 3 + 2 * p2[1] / 3;
    const ux = (tx - sx) * Math.cos(ROT_60) - (ty - sy) * Math.sin(ROT_60) + sx;
    const uy = (tx - sx) * Math.sin(ROT_60) + (ty - sy) * Math.cos(ROT_60) + sy;

    if (fill) {
        let c = (mn - n + 1) / 5 * 255 ^ 0;
        ctx.fillStyle = `rgba(${c},${c},${c},255)`;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ux, uy);
        ctx.lineTo(tx, ty);
        ctx.closePath();
        ctx.fill();
    }

    koch(n - 1, p1, [sx, sy]);
    koch(n - 1, [sx, sy], [ux, uy]);
    koch(n - 1, [ux, uy], [tx, ty]);
    koch(n - 1, [tx, ty], p2);
}

const r = 300;
const p1 = [w / 2, h / 2 - r / 2 / Math.sin(ROT_60)];
const p2 = [w / 2 - r / 2, h / 2 + r / 4 / Math.sin(ROT_60)];
const p3 = [w / 2 + r / 2, h / 2 + r / 4 / Math.sin(ROT_60)];

let mn = 5;
let fill = false;

if (fill) {
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.lineTo(p3[0], p3[1]);
    ctx.fill();
}

koch(mn, p1, p2);
koch(mn, p2, p3);
koch(mn, p3, p1);

function render() {
    ctx.clearRect(0, 0, w, h);
    console.time('koch');
    koch(mn, p1, p2);
    koch(mn, p2, p3);
    koch(mn, p3, p1);

    if (fill) {
        let c = 0;
        ctx.fillStyle = `rgba(${c},${c},${c},255)`;
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.lineTo(p3[0], p3[1]);
        ctx.fill();
    }
    console.timeEnd('koch');
}

const slider = createSlider('n', 1, v => {
    let nn = v * 5 ^ 0;
    if (nn === n) {
        return;
    }
    mn = nn;
    render();
});

document.body.appendChild(slider);

document.body.appendChild(createCheckbox('fill', v => {
    fill = v;
    render();
}));
