// 線分または半直線と矩形との当たり判定
function segToRect(s, r, p) {
    // 各辺と線との当たり判定をとる
    for(var i = 0; i < 4; i++) {
        if(p(r.e[i], s)) {
            return true;
        }
    }
    return false;
}

// 線分と線分の当たり判定
function segToSeg(a, b) {
    var v0 = a.end.sub(a.start),
	c0 = b.start.sub(a.start).cross(v0),
	c1 = b.end.sub(a.start).cross(v0),
	v1 = b.end.sub(b.start),
	c2 = a.start.sub(b.start).cross(v1),
	c3 = a.end.sub(b.start).cross(v1);
    return c0 * c1 < 0 && c2 * c3 < 0;
}

// 線分と半直線(レイ)の当たり判定
function segToRay(a, b) {
    var v = b.end.sub(b.start),
	c0 = a.start.sub(b.start).cross(v),
	c1 = a.end.sub(b.start).cross(v),
	c2 = a.start.sub(b.start).dot(v),
	c3 = a.end.sub(b.start).dot(v);
    return c0 * c1 < 0 && (c2 >= 0 || c3 >= 0); 
}


var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    w = canvas.width,
    h = canvas.height,
    mouse = new Vector2(0, 0),
    start = new Vector2(0, 0),
    down = false,
    op = document.getElementById('op'),
    op2 = document.getElementById('op2'),
    isRay = false;

op2.onchange = op.onchange = function(e) {
    isRay = !op.value;
    down = true;
    render();
    down = false;
};

canvas.onmousedown = function(e) {
    down = true;
    var rect = e.target.getBoundingClientRect();
    start.x = e.clientX - rect.left;
    start.y = e.clientY - rect.top;
    isRay = !op.checked;
};

canvas.onmousemove = function(e) {
    if(down) {
	var rect = e.target.getBoundingClientRect();
	mouse.x = e.clientX - rect.left;
	mouse.y = e.clientY - rect.top;
	render();
    }
};

canvas.onmouseup = function(e) {
    down = false;
};

var Ray = function(x0, y0, x1, y1) {
    this.start = new Vector2(x0, y0);
    this.end = new Vector2(x1, y1);
};

var ray = new Ray(100, 100, 200, 200);
var rect = {};
rect.pos = new Vector2(150, 150);
rect.size = new Vector2(100, 100);
rect.e = [];
rect.e[0] = new Ray(rect.pos.x, rect.pos.y, rect.pos.x + rect.size.x, rect.pos.y);
rect.e[1] = new Ray(rect.pos.x, rect.pos.y, rect.pos.x, rect.pos.y + rect.size.y);
rect.e[2] = new Ray(rect.pos.x + rect.size.x, rect.pos.y, rect.pos.x + rect.size.x, rect.pos.y + rect.size.y);
rect.e[3] = new Ray(rect.pos.x, rect.pos.y + rect.size.y, rect.pos.x + rect.size.x, rect.pos.y + rect.size.y);

ctx.strokeStyle = '#FFF';

render();

function line(s) {
    ctx.beginPath();
    ctx.moveTo(s.start.x, s.start.y);
    ctx.lineTo(s.end.x, s.end.y);
    ctx.stroke();
}

function line_r(s) {
    ctx.beginPath();
    ctx.moveTo(s.start.x, s.start.y);
    var p = s.end.sub(s.start).mul(w);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
}

function render() {
    ctx.clearRect(0, 0, w, h);
    if(down) {
        ray.start = start;
        ray.end = mouse;
        ctx.strokeStyle = '#FFF';
        if(isRay) {
            line_r(ray);
        } else {
            line(ray);
        }
        if(segToRect(ray, rect, isRay ? segToRay : segToSeg)) {
            ctx.strokeStyle = '#F00';
        } else {
            ctx.strokeStyle = '#FFF';
        }
    }
    ctx.strokeRect(rect.pos.x, rect.pos.y, rect.size.x, rect.size.y);
}

