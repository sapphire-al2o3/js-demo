var canvas = document.getElementsByTagName('canvas'),
    ctx = [],
    img = new Image(),
    down = false,
    px = 0,
    py = 0,
    strokeColor = 'rgba(200, 200, 255, 1.0)';

for(var i = 0; i < canvas.length; i++) {
  ctx[i] = canvas[i].getContext('2d');
  ctx[i].lineWidth = 3.0;
  ctx[i].strokeStyle = strokeColor;
  ctx[i].fillStyle = strokeColor;
}

canvas[0].addEventListener('mousedown', function(e) {
  var rect = e.target.getBoundingClientRect();
  down = true;
  px = e.clientX - rect.left + 0.5;
  py = e.clientY - rect.top + 0.5;
  
  ctx[0].beginPath();
  ctx[0].moveTo(px, py);
  
  //ctx[1].beginPath();
  //ctx[1].
  
  ctx[2].beginPath();
  ctx[2].moveTo(px, py);
}, false);

canvas[0].addEventListener('mousemove', function(e) {
  if(down) {
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left + 0.5,
        y = e.clientY - rect.top + 0.5;
    
    // 0
    //ctx[0].moveTo(px, py);
    ctx[0].lineTo(x, y);
    //ctx[0].closePath();
    ctx[0].stroke();
    
    // 1
    ctx[1].beginPath();
    ctx[1].moveTo(px, py);
    ctx[1].lineTo(x, y);
    ctx[1].stroke();
    
    // 2
    ctx[2].lineTo(x, y);
    
    // 3
    line(px, py, x, y);
    
    px = x;
    py = y;
  }
}, false);

canvas[0].addEventListener('mouseup', function(e) {
  if(down) {
    down = false;
    ctx[2].stroke();
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
  for(var i = 0, n = ctx.length; i < n; i++) {
    ctx[i].clearRect(0, 0, 200, 200);
  }  
}

function setCap(e) {
  for(var i = 0, n = ctx.length; i < n; i++) {
    ctx[i].lineCap = e.checked ? 'round' : 'butt';
  }
}

function setJoin(e) {
  for(var n = ctx.length; n--;) {
    ctx[n].lineJoin = e.checked ? 'round' : 'miter';
  }
}

