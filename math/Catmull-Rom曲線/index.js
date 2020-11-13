(function(){
  var canvas = document.getElementById('canvas'),
      ctx = canvas.getContext('2d');
  var mouse = {x: 0, y: 0};
  var clickX = 0, clickY = 0;
  var down = false;
  var p0 = {x: 100, y: 100, label: 'P0'},
      p1 = {x: 300, y: 300, label: 'P1'},
      p2 = {x: 300, y: 100, label: 'P2'},
      p3 = {x: 100, y: 200, label: 'P3'},
      p4 = {x: 100, y: 300, label: 'P4'};
  var active = {};
  var shapes = [p0, p1, p2, p3, p4];
  
  ctx.lineWidth = 2.0;
  ctx.font = '9pt consolas';
  
  function catmullRom(x0, y0, x1, y1, x2, y2, x3, y3, t, c) {
    var vx0 = (x2 - x0) * 0.5 * c,
        vy0 = (y2 - y0) * 0.5 * c,
        vx1 = (x3 - x1) * 0.5 * c,
        vy1 = (y3 - y1) * 0.5 * c,
        t2 = t * t,
        t3 = t2 * t;
    return {
      x: (2.0 * x1 - 2.0 * x2 + vx0 + vx1) * t3
        + (-3 * x1 + 3 * x2 - 2 * vx0 - vx1) * t2
        + vx0 * t + x1,
      y: (2 * y1 - 2 * y2 + vy0 + vy1) * t3
        + (-3 * y1 + 3 * y2 - 2 * vy0 - vy1) * t2
        + vy0 * t + y1
    };
  }
  
  function catmullRomCurve(ctx, x0, y0, x1, y1, x2, y2, x3, y3, c) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    for(var i = 1; i <= 20; i++) {
      var p = catmullRom(x0, y0, x1, y1, x2, y2, x3, y3, i / 20.0, c);
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }
  
  canvas.addEventListener('mousedown', function(e) {
    var rect = e.target.getBoundingClientRect();
    clickX = e.clientX - rect.left;
    clickY = e.clientY - rect.top;
    down = true;
  }, false);
  canvas.addEventListener('mouseup', function(e) {
    down = false;
    active = {};
  }, false);
  canvas.addEventListener('mouseout', function(e) {
    down = false;
    active = {};
  }, false);
  canvas.addEventListener('mousemove', function(e) {
    var rect = e.target.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    if(down) {
      clickX = mouse.x;
      clickY = mouse.y;
    }
    
    if(mouse.x !== 0 || mouse.y !== 0) {
      draw();
    }
    
    e.stopPropagation();
  }, false);
  
  function draw() {
    var d = new Vector2(mouse.x, mouse.y);
    if(down) {
      shapes.forEach(function(e) {
        if(d.distance(e) < 6) {
          active = e;
        }
      });
      active.x = clickX;
      active.y = clickY;
    }
    
    
    ctx.clearRect(0, 0, 400, 400);
    ctx.strokeStyle = '#999';
    catmullRomCurve(ctx, p0.x, p0.y, p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, 1);
    catmullRomCurve(ctx, p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, 1);
    catmullRomCurve(ctx, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p3.x, p3.y, 1);
    catmullRomCurve(ctx, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y, p4.x, p4.y, 1);
    ctx.strokeStyle = '#000';
    shapes.forEach(function(e) {
      if(d.distance(e) < 6) {
        ctx.strokeCircle(e.x, e.y, 6);
      } else {
        ctx.strokeCircle(e.x, e.y, 3);
      }
      ctx.fillText(e.label, e.x, e.y - 8);
    });
  }
  draw();
})();









