var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    w = canvas.width,
    h = canvas.height,
    mouse = new Vector2(0, 0),
    start = new Vector2(0, 0),
    down = false,
    isRay = false,
    op = document.getElementById('op'),
    op2 = document.getElementById('op2');

op2.onchange = op.onchange = function(e) {
    isRay = !isRay;
    render();
};

canvas.onmousedown = function(e) {
    down = true;
    var rect = e.target.getBoundingClientRect();
    start.x = e.clientX - rect.left;
    start.y = e.clientY - rect.top;
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

var circle = {
    pos: new Vector2(200, 200),
    r: 60
};

var Ray = function(x0, y0, x1, y1) {
    this.start = new Vector2(x0, y0);
    this.end = new Vector2(x1, y1);
};

var ray = new Ray(100, 100, 200, 200);

console.log(segToCircle(ray, circle));

ctx.strokeStyle = '#FFF';

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
    ray.start = start;
    ray.end = mouse;
    ctx.clearRect(0, 0, w, h);
    
    ctx.strokeStyle = '#FFF';
    
    if(isRay) {
        line_r(ray);
    } else {
        line(ray);
    }

    var hit = isRay ? rayToCircle(ray, circle) : segToCircle(ray, circle);
    if(hit) {
        ctx.strokeStyle = '#F00';
    }

    ctx.beginPath();
    ctx.arc(circle.pos.x, circle.pos.y, circle.r, 0, Math.PI * 2.0, false);
    ctx.stroke();
}

render();

// 線分と円のあたり判定
function segToCircle(s, c) {
    var sd = c.pos.sub(s.start),
        ed = s.end.sub(c.pos),
        v = s.end.sub(s.start).normalize(),
        da = sd.length(),
        d = v.dot(sd),
        // レイから円の中心までの最短距離
        dc = da * da - d * d;

    var f = 0;
    if(sd.length() < c.r) {
        f += 1;
    }
    if(ed.length() < c.r) {
        f += 1;
    }
    // 始点も終点が円の内部なら交差していない
    if(f == 2) {
        return false;
    }
    // 始点か終点のどちらかが円の内部なら交差している
    if(f == 1) {
        return true;
    }

    if(d > 0 && s.end.sub(s.start).length() > da && dc <= c.r * c.r) {
        return true;
    }

    return false;
}

// レイと円のあたり判定
function rayToCircle(s, c) {
    var sd = c.pos.sub(s.start);	// レイの開始点から円の中心に向かうベクトル
    
    // 開始点が円の内側なら交差する
    if(sd.length() < c.r) {
        return true;
    }
    
    var v = s.end.sub(s.start).normalize(),
        da = sd.length(),
        d = v.dot(sd),
        // レイから円の中心までの最短距離
        dc = da * da - d * d;
    
    // 円の中心点がレイの方向に存在する、かつ直線と円の中心までの距離が円の半径以内
    if(d > 0 && dc <= c.r * c.r) {
        return true;
    }
    
    return false;
}
