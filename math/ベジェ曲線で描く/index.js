var canvas = document.getElementById('world'),
    ctx = canvas.getContext('2d'),
    mouse = new Vector2(0, 0),
    click = new Vector2(0, 0),
    down = false,
    shapes = [],
    active = null;

shapes = toVector2([
107,189,
27,238,
84,260,
85,299,
107,275,
157,296,
158,205,
185,304,
204,260,
246,285,
243,238,
297,233,
202,165,
299,150,
259,106,
267,76,
236,87,
215,42,
174,128,
168,37,
129,74,
97,38,
98,82,
63,91,
111,143,
46,104,
50,138,
14,143,
44,159,
34,208,
106,180
]);

ctx.clearRect(0, 0, 200, 200);
ctx.strokeStyle = 'rgba(200, 100, 100, 1.0)';
ctx.lineWidth = 2.0;

draw();

canvas.addEventListener('mousedown', function(e) {
  var rect = e.target.getBoundingClientRect();
  click.x = e.clientX - rect.left;
  click.y = e.clientY - rect.top;
  down = true;
  draw();
}, false);

canvas.addEventListener('mouseup', function(e) {
  down = false;
  active = null;
}, false);

canvas.addEventListener('mouseout', function(e) {
  down = false;
  active = null;
}, false);

canvas.addEventListener('mousemove', function(e) {
  var rect = e.target.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
  if(down) {
    click.x = mouse.x;
    click.y = mouse.y;
  }
  draw();
  e.stopPropagation();
}, false);

function drawCurve() {
  if(shapes.length > 3) {
    ctx.moveTo(shapes[0].x, shapes[0].y);
    for(var i = 1; i < shapes.length - 2; i += 3) {
      ctx.bezierCurveTo(
        shapes[i].x, shapes[i].y,
        shapes[i + 1].x, shapes[i + 1].y,
        shapes[i + 2].x, shapes[i + 2].y
      );
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
}

function draw() {
  if(down) {
    shapes.forEach(function(e) {
      if(mouse.distance(e) < 6) {
        active = e;
      }
    });
    if(active) {
      active.x = click.x;
      active.y = click.y;
    } else {
      shapes.push(new Vector2(click.x, click.y));
    }
  }
        
  ctx.clearRect(0, 0, 400, 400);
    
  ctx.lineWidth = 2.0;
  drawCurve();
    
  ctx.fillStyle = 'rgba(77, 80, 192, 1)';
  shapes.forEach(function(e) {
    if(mouse.distance(e) < 6) {
      ctx.strokeCircle(e.x, e.y, 6);
    } else {
      ctx.strokeCircle(e.x, e.y, 3);
    }
  });
  
  ctx.font = "9pt Arial";
  ctx.fillText("count:" + shapes.length, 4, 10);
}
  
function toVector2(a) {
  var ret = [];
  for(var i = 0; i < a.length; i += 2) {
    ret.push(new Vector2(a[i], a[i + 1]));
  }
  return ret;
}
  
function clearPoint() {
  shapes = [];
  draw();
}

function printPoint() {
  var text = shapes.join(',');
  document.getElementById('text').value = text;
}
  
  
  
  
  
  
  
  
  
