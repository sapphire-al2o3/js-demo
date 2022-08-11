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

function render(a, b, m, g = true) {
    ctx.clearRect(0, 0, w, h);

    ctx.lineWidth = 1.0;

    ctx.fillStyle = "#F44";
    if (m === 0) {
        drawEllipse(0, 0, a, b);
    } else {
        drawEllipse2(0, 0, a, b);
    }
    ctx.strokeStyle = '#333';
    strokeEllipse(scale / 2, scale / 2, a * scale + scale / 2, b * scale + scale / 2);

    // ctx.beginPath();
    // ctx.arc(cx, cx, r * scale / 2, 0, Math.PI * 2, true);
    // ctx.stroke();

    if (g) {
        drawGrid();
    }
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

const strokeEllipse = (left, top, right, bottom) => {
    let halfWidth = (right - left) / 2.0;
    let halfHeight = (bottom - top) / 2.0;
    let x0 = left + halfWidth;
    let y1 = top + halfHeight;
    ctx.beginPath();
    let cw = 4.0 * (Math.sqrt(2.0) - 1.0) * halfWidth / 3.0;
    let ch = 4.0 * (Math.sqrt(2.0) - 1.0) * halfHeight / 3.0;
    ctx.moveTo(x0, top);
    ctx.bezierCurveTo(x0 + cw, top, right, y1 - ch, right, y1);
    ctx.bezierCurveTo(right, y1 + ch, x0 + cw, bottom, x0, bottom);
    ctx.bezierCurveTo(x0 - cw, bottom, left, y1 + ch, left, y1);
    ctx.bezierCurveTo(left, y1 - ch, x0 - cw, top, x0, top);
    ctx.stroke();
}

function drawDot(x, y) {
    ctx.fillRect(x * scale, y * scale, scale, scale);
}

function drawEllipse(x0, y0, x1, y1) {

    let dx = x1 - x0;
    let dy = y1 - y0;
    let a = dx / 2 ^ 0;
    let b = dy / 2 ^ 0;

    let cx = a + x0;
    let cy = b + y0;

    let cx0 = dx & 1 ? cx + 1 : cx;
    let cy0 = dy & 1 ? cy + 1 : cy;

    let x = a;
    let y = 0;
    let d = b * a * b;
    let aa = b * b;
    let bb = a * a;
    let f = -2 * d + aa + 2 * bb;
    let h = -4 * d + 2 * aa + bb;

    while (x >= 0) {
        drawDot(cx0 + x, cy0 + y);
        drawDot(cx - x, cy0 + y);
        drawDot(cx0 + x, cy - y);
        drawDot(cx - x, cy - y);

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

function eps(x0, y0, x1, y1, x, y) {
    let dx = (x1 - x0),
        dy = (y1 - y0),
        dx2 = dx * dx,
        dy2 = dy * dy,
        ex = 2 * x - x0 - x1,
        ey = 2 * y - y0 - y1,
        e = dx2 * dy2 - dy * dy * ex * ex - dx * dx * ey * ey;
    return e;
}

function drawEllipse2(x0, y0, x1, y1) {
    let left = Math.min(x0, x1),
        right = Math.max(x0, x1),
        top = Math.min(y0, y1),
        bottom = Math.max(y0, y1);

    x0 = left;
    x1 = right;
    y0 = top;
    y1 = bottom;

    let dx = x1 - x0,
        dy = y1 - y0,
        dx2 = dx * dx,
        dy2 = dy * dy,
        a = dx >> 1,
        b = dy >> 1,
        w = scale,
        h = scale;
        
    let x = ((x0 + x1) >> 1) * w;

    drawDot((x0 + x1) >> 1, y0);
    drawDot((x0 + x1) >> 1, y1);

	if ((dx & 1) === 1) {
		drawDot(((x0 + x1) >> 1) + 1, y0);
		drawDot(((x0 + x1) >> 1) + 1, y1);
	}
	
	let y = ((y0 + y1) >> 1) * h;
	drawDot(x0, (y0 + y1) >> 1);
	drawDot(x1, (y0 + y1) >> 1);
	if ((dy & 1) === 1) {
		drawDot(x0, ((y0 + y1) >> 1)  + 1);
		drawDot(x1, ((y0 + y1) >> 1)  + 1);
	}
	
	let a2 = a * a,
		b2 = b * b,
		f = b2 *(-2 * a + 1) + 2 * a2,
		o = x * b2 / a2,
		cx = x0 + a,
		cy = y0 + b,
		cx1 = x1 - a,
		cy1 = y1 - b,
		n = a / Math.sqrt(b2 /a2 + 1) - 0.5;
	
	y = y1;
	x = ((x0 + x1) >> 1);
	for(let i = 0; i < n; i++) {
		let e0 = eps(x0 + 0.5, y0 + 0.5, x1 + 0.5, y1 + 0.5, x - 1 + 0.5, y + 0.5),
			e1 = eps(x0 + 0.5, y0 + 0.5, x1 + 0.5, y1 + 0.5, x - 1 + 0.5, y - 1 + 0.5);
		
		if(Math.abs(e0) < Math.abs(e1)) {
			x = x - 1;
		} else {
			x = x - 1;
			y = y - 1;
		}
		drawDot(x, y);
		drawDot(x1 - x + x0, y);
		drawDot(x, y1 - y + y0);
		drawDot(x1 - x + x0, y1 - y + y0);
	}

	if (y - 1 <= cy) {
		return;
	}
	
	y = (y0 + y1) >> 1;
	x = x1;
	n = b / Math.sqrt(a2 / b2 + 1);
	for (let i = 0; i < n; i++) {
		let e0 = eps(x0 + 0.5, y0 + 0.5, x1 + 0.5, y1 + 0.5, x + 0.5, y - 1 + 0.5),
			e1 = eps(x0 + 0.5, y0 + 0.5, x1 + 0.5, y1 + 0.5, x - 1 + 0.5, y - 1 + 0.5);
		if (Math.abs(e0) < Math.abs(e1)) {
			y = y - 1;
		} else {
			x = x - 1;
			y = y - 1;
		}
        drawDot(x, y);
        drawDot(x1 - x + x0, y);
        drawDot(x, y1 - y + y0);
        drawDot(x1 - x + x0, y1 - y + y0);
	}

	ctx.fill();
}

let a = 15;
let b = 15;
let m = 0;

let param = document.getElementById('param');

document.body.appendChild(createSlider('ax2', 1, v => {
    a = v * 15 ^ 0;
    param.textContent = `${a}x${b}`;
    render(a, b, m);
}));

document.body.appendChild(createSlider('bx2', 1, v => {
    b = v * 15 ^ 0;
    param.textContent = `${a}x${b}`;
    render(a, b, m);
}));

document.body.appendChild(createRadio(['f1', 'f2'], (v, id, i) => {
    m = i;
    render(a, b, m);
}));

render(a, b, m);