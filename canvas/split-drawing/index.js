const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const w = canvas.width;
const h = canvas.height;
    
    var px = 0,
        py = 0,
        rect,
        rot = 32,
        down = false;
    
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = 'rgba(250, 100, 0, 0.4)';
    
function mousemove(e) {
    if(down) {
        let x = e.pageX - rect.left + 0.5,
            y = e.pageY - rect.top + 0.5;
        
        render(x, y, px, py);
        
        px = x;
        py = y;
    }
}
    
function mouseup(e) {
    if(down) {
        down = false;
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
    }
}

function mousedown(e) {
    rect = e.target.getBoundingClientRect();
    px = e.pageX - rect.left + 0.5;
    py = e.pageY - rect.top + 0.5;
    down = true;
    
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
}
    
canvas.addEventListener('mousedown', mousedown);
    
document.getElementById('clear').addEventListener('click', function() {
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, w, h);
});
document.getElementById('r32').addEventListener('click', function(e) {
    rot = 32;
});
document.getElementById('r16').addEventListener('click', function(e) {
    rot = 16;
});
document.getElementById('r8').addEventListener('click', function(e) {
    rot = 8;
});
document.getElementById('r64').addEventListener('click', function(e) {
    rot = 64;
});
document.getElementById('r3').addEventListener('click', function(e) {
    rot = 3;
});

let s = 4;

function render(x, y, px, py) {
    let sx = w / s,
        sy = h / s;
    
    x = x % sx;
    y = y % sy;
    px = px % sx;
    py = py % sy;

    for (let i = 0; i < s; i++) {
        for (let j = 0; j < s; j++) {
            ctx.beginPath();
            ctx.moveTo(px + i * sx, py + j * sy);
            ctx.lineTo(x + i * sx, y + j * sy);
            ctx.stroke();
        }
    }
}
