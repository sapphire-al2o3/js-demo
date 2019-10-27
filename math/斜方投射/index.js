var canvas = document.getElementById('world');
var ctx = canvas.getContext('2d');
var mouse = Vector2.zero;
var start = new Vector2(100, 100);
var target = new Vector2(300, 200);
var pos = new Vector2(100, 100);
var v = new Vector2(0, 0);
var down = false;
var time = 0.0;
var active = null;
var shapes = [start, target];
const G = 9.8 / 30.0;

start.color = '#AFE';
target.color = '#AFE';

//function ready() {
canvas.onmousedown = function(e) {
  down = true;
};
canvas.onmouseup = function(e) {
  down = false;
};
canvas.onmousemove = function(e) {
  var rect = e.target.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
};
//}

setInterval(function() {
    
    for(var i = 0; i < 2; i++) {
        if(shapes[i].distance(mouse) < 8) {
            shapes[i].color = '#FEA';
            if(down) active = shapes[i];
        } else {
            
        }
    }
    
    if(down && active) {
        active.x = mouse.x;
        active.y = mouse.y;
    } else {
        active = null;    
    }
    
    if(time === 0) {
        var x = start.x - target.x,
            y = start.y - target.y,
            v0 = 10,
            a = G * x * x / (2 * v0 * v0),
            b = x,
            c = y + a,
            d = b * b - 4 * a * c;
        if(d < 0) d = 0;
        d = Math.sqrt(d);
        var rad = x < 0 ? Math.atan((-b + d) / (2 * a))
                        : Math.atan((-b - d) / (2 * a)) + Math.PI;
        v.x = v0 * Math.cos(rad);
        v.y = -v0 * Math.sin(rad);
        ctx.clearRect(0, 0, 440, 400);
    }
    
    target.color = target.distance(mouse) < 8 ? '#FEA' : '#AEF';
    start.color = start.distance(mouse) < 8 ? '#EFA' : '#AFE';
  
    pos.x = start.x + v.x * time;
    pos.y = start.y + v.y * time + G * time * time / 2.0;
    
    ctx.clearRect(0, 0, 440, 400);
    
    ctx.fillStyle = '#000';
    ctx.fillCircle(pos.x, pos.y, 4);
  
  ctx.fillStyle = target.color;
  ctx.fillCircle(target.x, target.y, 8);
  ctx.fillStyle = start.color;
  ctx.fillCircle(start.x, start.y, 8);
  
  time += 1.0;
  
  if(time > 100.0) {
    time = 0.0;   
  }
  
}, 33);
