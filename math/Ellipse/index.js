// https://web.wakayama-u.ac.jp/~tokoi/lecture/cg/cgnote03.pdf
// http://dencha.ojaru.jp/programs_07/pg_graphic_09a2.html
// https://saibara.sakura.ne.jp/program/circle.html
// https://fussy.web.fc2.com/algo/algo2-2.htm
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const w = canvas.width;
const h = canvas.height;

const size = 16;
const scale = w / size;

function render(a, b) {
    ctx.clearRect(0, 0, w, h);

    ctx.lineWidth = 1.0;

    ctx.fillStyle = "#F44";
    // drawCircle0(0, 0, 16, 16);
    drawEllipse(0, 0, a, b);

    // let cx = w / 2 - (size - r - 1) / 2 * scale;

    // ctx.strokeStyle = '#333';
    // ctx.beginPath();
    // ctx.arc(cx, cx, (r + 1) * scale / 2, 0, Math.PI * 2, true);
    // ctx.stroke();

    // ctx.beginPath();
    // ctx.arc(cx, cx, r * scale / 2, 0, Math.PI * 2, true);
    // ctx.stroke();

    drawGrid();
}

function drawGrid() {
    ctx.strokeStyle = '#CCC';
    ctx.beginPath();
    for (let i = 1; i < 16; i++) {
        let x = scale * i - 0.5;
        ctx.moveTo(0, x);
        ctx.lineTo(w, x);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
    }
    ctx.stroke();

    ctx.strokeStyle = '#444';
    ctx.beginPath();
    ctx.moveTo(0, h / 2 - 0.5);
    ctx.lineTo(w, h / 2 - 0.5);
    ctx.moveTo(w / 2 - 0.5, 0);
    ctx.lineTo(w / 2 - 0.5, h);
    ctx.stroke();
}

function drawDot(x, y) {
    ctx.fillRect(x * scale, y * scale, scale, scale);
}

function drawEllipse(x0, y0, x1, y1) {

    let a = (x1 - x0) / 2;
    let b = (y1 - y0) / 2;

    let cx = a + x0;
    let cy = b + y0;

    let x = a;
    let y = 0;
    let d = b * a * b;
    let aa = b * b;
    let bb = a * a;
    let f = -2 * d + aa + 2 * bb;
    let h = -4 * d + 2 * aa + bb;



    while (x >= 0) {
        drawDot(cx + x, cy + y);
        drawDot(cx - x, cy + y);
        drawDot(cx + x, cy - y);
        drawDot(cx - x, cy - y);
        console.log(cx, cy);

        if (f >= 0) {
            x--;
            f -= 4 * aa * x;
            h -= 4 * aa * x - 2 * aa;
        }
        if (h < 0) {
            y++;
            f += 4 * bb * y + 2 * bb;
            h += 4 * bb * y;
        }
    }


}

let a = 15;
let b = 10;

document.body.appendChild(createSlider('a2', 1, v => {
    a = v * 15 ^ 0;
    render(a, b);
}));

document.body.appendChild(createSlider('b2', 1, v => {
    b = v * 15 ^ 0;
    render(a, b);
}));

render(a, b);