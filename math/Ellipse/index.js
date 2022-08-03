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

function render(r) {
    ctx.clearRect(0, 0, w, h);

    ctx.lineWidth = 1.0;

    ctx.fillStyle = "#F44";
    // drawCircle0(0, 0, 16, 16);
    drawCircle1(0, 0, r, r);

    let cx = w / 2 - (size - r - 1) / 2 * scale;

    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.arc(cx, cx, (r + 1) * scale / 2, 0, Math.PI * 2, true);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cx, r * scale / 2, 0, Math.PI * 2, true);
    ctx.stroke();

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

function drawCircle0(x0, y0, x1, y1) {
    let dx = x1 - x0;
    let dy = y1 - y0;
    let r = dx / 2 ^ 0;

    let xr = r / Math.sqrt(2);

    for (let x = 0; x < xr; x++) {
        let y = Math.sqrt(r * r - x * x) + 0.5 ^ 0;
        drawDot(x + r, size / 2 - y);
        drawDot(r - x - 1, size / 2 - y);

        drawDot(x + r, dy - (size / 2 - y) - 1);
        drawDot(r - x - 1, dy - (size / 2 - y) - 1);

        drawDot(size / 2 - y, x + r);
        drawDot(size / 2 - y, r - x - 1);

        drawDot(dx - (size / 2 - y) - 1, x + r);
        drawDot(dx - (size / 2 - y) - 1, r - x - 1);
    }
}

// Michener algorithm
function drawCircle1(x0, y0, x1, y1) {
    let dx = x1 - x0;
    let dy = y1 - y0;
    let cx = dx / 2 ^ 0 + x0;
    let cy = dy / 2 ^ 0 + y0;
    let mcx = cx;
    let mcy = cy;
    let r = dx / 2 ^ 0;
    let d = 3 - 2 * r;

    if (dx & 1 == 1) {
        mcx++;
        mcy++;
    }

    let y = r;
    for (let x = 0; x <= y; x++) {
        if (d >= 0) {
            d -= 4 * y;
            y--;
        }

        d += 4 * (x + 1) + 2;
        drawDot(mcx + y, mcy + x);
        drawDot(cx - y, mcy + x);
        drawDot(mcx + y, cy - x);
        drawDot(cx - y, cy - x);

        drawDot(mcx + x, mcy + y);
        drawDot(cx - x, mcy + y);
        drawDot(mcx + x, cy - y);
        drawDot(cx - x, cy - y);
    }
}

document.body.appendChild(createSlider('radius', 1, v => {
    let r = v * 15 ^ 0;
    render(r);
}));

render(15);