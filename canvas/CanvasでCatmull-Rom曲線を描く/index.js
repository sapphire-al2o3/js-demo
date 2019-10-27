var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    points = [],
    down = false,
    count = 0;

function catmullRom(x0, y0, x1, y1, x2, y2, x3, y3, t, c) {
  var vx0 = (x2 - x0) * 0.5 * c,
      vy0 = (y2 - y0) * 0.5 * c,
      vx1 = (x3 - x1) * 0.5 * c,
      vy1 = (y3 - y1) * 0.5 * c;
  return {
    x: (2.0 * x1 - 2.0 * x2 + vx0 + vx1) * t * t * t
    + (-3 * x1 + 3 * x2 - 2 * vx0 - vx1) * t * t
    + vx0 * t + x1,
    y: (2 * y1 - 2 * y2 + vy0 + vy1) * t * t * t
    + (-3 * y1 + 3 * y2 - 2 * vy0 - vy1) * t * t
    + vy0 * t + y1
  };
}

function catmullRomCurve(x0, y0, x1, y1, x2, y2, x3, y3, c) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  for(var i = 0; i <= 20; i++) {
    var p = catmullRom(x0, y0, x1, y1, x2, y2, x3, y3, i / 20.0, c);
    ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
}

function hsva(h,s,v,a){var f=h/60,i=f^0,m=v-v*s,k=v*s*(f-i),p=v-k,q=k+m;return 'rgba('+[[v,p,m,m,q,v][i]*255^0,[q,v,v,p,m,m][i]*255^0,[m,m,q,v,v,p][i]*255^0,a].join(',')+')';}

var x = [], y = [];
ctx.lineWidth = 1.0;
ctx.clearRect(0, 0, 400, 400);
ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';

canvas.onmousemove = function(e) {
  if(count++ % 16) return false;
  x.push(e.pageX);
  y.push(e.pageY);
  
  ctx.strokeStyle = hsva(count % 360, 1.0, 1.0, 0.2);
  
  ctx.beginPath();
  ctx.arc(e.pageX, e.pageY, 3.0, 0, Math.PI * 2.0, false);
  ctx.stroke();
  
  if(x.length > 3) {
    
    catmullRomCurve(x[0], y[0], x[0], y[0], x[1], y[1], x[2], y[2], 2.0);
    catmullRomCurve(x[0], y[0], x[1], y[1], x[2], y[2], x[3], y[3], 2.0);
    catmullRomCurve(x[1], y[1], x[2], y[2], x[3], y[3], x[3], y[3], 2.0);
    
    //ctx.strokeStyle = hsva((count + 180) % 360, 1.0, 1.0, 0.4);
    
    catmullRomCurve(x[0], y[0], x[0], y[0], x[1], y[1], x[2], y[2], 1.0);
    catmullRomCurve(x[0], y[0], x[1], y[1], x[2], y[2], x[3], y[3], 1.0);
    catmullRomCurve(x[1], y[1], x[2], y[2], x[3], y[3], x[3], y[3], 1.0);
    
    catmullRomCurve(x[0], y[0], x[0], y[0], x[1], y[1], x[2], y[2], -1.0);
    catmullRomCurve(x[0], y[0], x[1], y[1], x[2], y[2], x[3], y[3], -1.0);
    catmullRomCurve(x[1], y[1], x[2], y[2], x[3], y[3], x[3], y[3], -1.0);
    
    
    x.shift();
    y.shift();
  }
};
