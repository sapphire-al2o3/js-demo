const canvas = document.getElementsByTagName('canvas');
const ctx = canvas[0].getContext('2d');
let img = new Image(),
    down = false,
    px = 0,
    py = 0,
    strokeColor = 'rgba(200, 200, 255, 1.0)';


ctx.lineWidth = 3.0;
ctx.strokeStyle = strokeColor;
ctx.fillStyle = strokeColor;

canvas[0].addEventListener('mousedown', (e) => {
    const rect = e.target.getBoundingClientRect();
    down = true;
    px = e.clientX - rect.left + 0.5;
    py = e.clientY - rect.top + 0.5;
    
    ctx.beginPath();
    ctx.moveTo(px, py);
}, false);

canvas[0].addEventListener('mousemove', function(e) {
    if (down) {
        const rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left + 0.5,
            y = e.clientY - rect.top + 0.5;
        
            ctx.lineTo(x, y);
        ctx.stroke();
        
        px = x;
        py = y;
    }
}, false);

canvas[0].addEventListener('mouseup', function(e) {
    if (down) {
        down = false;
    }
}, false);

function circle(x, y, r) {
  ctx[3].arc(x, y, r, 0, Math.PI * 2.0, false);
}

function line(x, y, ex, ey) {
  var seg = 20.0;
  var dx = (ex - x) / seg,
      dy = (ey - y) / seg;
  ctx[3].beginPath();
  for(var i = 0; i < seg; i++) {
    circle(dx * i + x, dy * i + y, 1.5);
  }
  ctx[3].fill();
}

function clearCanvas() {
    ctx.clearRect(0, 0, 200, 200);
}

function setCap(e) {
    ctx.lineCap = e.checked ? 'round' : 'butt';
}

function setJoin(e) {
    ctx.lineJoin = e.checked ? 'round' : 'miter';
}

