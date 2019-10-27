(function(){
  var canvas = document.getElementById('canvas'),
      ctx = canvas.getContext('2d'),
      mouse = new Vector2(0, 0),
      click = new Vector2(0, 0),
      down = false,
      p0 = new Vector2(100, 100),
      p1 = new Vector2(300, 300),
      p2 = new Vector2(300, 100),
      p3 = new Vector2(100, 300),
      active = {},
      shapes = [p0, p1, p2, p3];
  
  ctx.lineWidth = 2.0;
  ctx.font = '9pt consolas';
  ctx.strokeStyle = 'rgba(200, 100, 100, 1.0)';
  
  function hermite(p0, p1, v0, v1, t) {
    var t2 = t * t,
        t3 = t2 * t,
        h0 = 2 * t3 - 3 * t2 + 1,
        h1 = -2 * t3 + 3 * t2,
        h2 = t3 - 2 * t2 + t,
        h3 = t3 - t2;
      return new Vector2(
    p0.x * h0 + p1.x * h1 + v0.x * h2 + v1.x * h3,
    p0.y * h0 + p1.y * h1 + v0.y * h2 + v1.y * h3
      );
  }
  
  function hermiteCurve(ctx, p0, p1, p2, p3) {
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    for(var i = 1; i <= 40; i++) {
      var p = hermite(p0, p1, p2.sub(p0), p3.sub(p1), i / 40.0);
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }
  
  canvas.addEventListener('mousedown', function(e) {
    var rect = e.target.getBoundingClientRect();
    click.x = e.clientX - rect.left;
    click.y = e.clientY - rect.top;
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
      click.x = mouse.x;
      click.y = mouse.y;
    }
    
    if(mouse.x !== 0 || mouse.y !== 0) {
      draw();
    }
    
    e.stopPropagation();
  }, false);
  
  function draw() {
    if(down) {
      shapes.forEach(function(e) {
        if(mouse.distance(e) < 6) {
          active = e;
        }
      });
      active.x = click.x;
      active.y = click.y;
    }
    
    ctx.clearRect(0, 0, 400, 400);
    
    ctx.lineWidth = 2.0;
    hermiteCurve(ctx, p0, p1, p2, p3);
    
    ctx.fillStyle = 'rgba(77, 80, 192, 1)';
    shapes.forEach(function(e) {
      ctx.beginPath();
      if(mouse.distance(e) < 6) {
        ctx.arc(e.x, e.y, 6, 0, Math.PI * 2, false);
      } else {
        ctx.arc(e.x, e.y, 3, 0, Math.PI * 2, false);
      }
      ctx.stroke();
    });
    
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.stroke();
  }    
  draw();
})();











