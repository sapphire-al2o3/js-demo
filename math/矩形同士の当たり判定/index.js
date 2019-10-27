// 矩形同士の当たり判定
function rectToRect(r0, r1, p) {
    if(r0.min.x > r1.max.x) return false;
    if(r0.min.y > r1.max.y) return false;
    if(r1.min.x > r0.max.x) return false;
    if(r1.min.y > r0.max.y) return false;
    return true;
}

let canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    w = canvas.width,
    h = canvas.height,
    mouse = new Vector2(0, 0),
    start = new Vector2(0, 0),
    down = false;

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

var rect = {};
rect.min = new Vector2(150, 150);
rect.max = new Vector2(250, 250);

var rect1 = {};
rect1.min = new Vector2(0, 0);
rect1.max = new Vector2(100, 100);

ctx.strokeStyle = '#FFF';

render();

function render() {
    ctx.clearRect(0, 0, w, h);
    if(down) {
        rect1.min.x = Math.min(start.x, mouse.x);
        rect1.min.y = Math.min(start.y, mouse.y);
        rect1.max.x = Math.max(start.x, mouse.x);
        rect1.max.y = Math.max(start.y, mouse.y);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(rect1.min.x, rect1.min.y, rect1.max.x - rect1.min.x, rect1.max.y - rect1.min.y);
        if(rectToRect(rect, rect1)) {
            ctx.strokeStyle = '#F00';
        } else {
            ctx.strokeStyle = '#FFF';
        }
    }
    ctx.strokeRect(rect.min.x, rect.min.y, rect.max.x - rect.min.x, rect.max.y - rect.min.y);
}

