const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const w = canvas.width;
const h = canvas.height;
const TO_RAD = Math.PI / 180;
const ROT_60 = TO_RAD * 60;

function koch(n, p1, p2) {
    if (n === 0) {
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
        return;
    }

    const sx = 2 * p1[0] / 3 + p2[0] / 3;
    const sy = 2 * p1[1] / 3 + p2[1] / 3;
    const tx = p1[0] / 3 + 2 * p2[0] / 3;
    const ty = p1[1] / 3 + 2 * p2[1] / 3;
    const ux = (tx - sx) * Math.cos(ROT_60) - (ty - sy) * Math.sin(ROT_60) + sx;
    const uy = (tx - sx) * Math.sin(ROT_60) + (ty - sy) * Math.cos(ROT_60) + sy;



    koch(n - 1, p1, [sx, sy]);
    koch(n - 1, [sx, sy], [ux, uy]);
    koch(n - 1, [ux, uy], [tx, ty]);
    koch(n - 1, [tx, ty], p2);
}

const r = 300;
const p1 = [w / 2, h / 2 - r / 2 / Math.sin(ROT_60)];
const p2 = [w / 2 - r / 2, h / 2 + r / 4 / Math.sin(ROT_60)];
const p3 = [w / 2 + r / 2, h / 2 + r / 4 / Math.sin(ROT_60)];

let n = 5;

koch(n, p1, p2);
koch(n, p2, p3);
koch(n, p3, p1);

const slider = createSlider('n', 1, v => {
    let nn = v * 5 ^ 0;
    if (nn === n) {
        return;
    }
    n = nn;
    ctx.clearRect(0, 0, w, h);
    console.time('koch');
    koch(n, p1, p2);
    koch(n, p2, p3);
    koch(n, p3, p1);
    console.timeEnd('koch');
});

document.body.appendChild(slider);
