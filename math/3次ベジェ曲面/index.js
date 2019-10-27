function bezier3(p0, p1, p2, p3, t) {
  var b0 = (1-t)*(1-t)*(1-t),
      b1 = 3*(1-t)*(1-t)*t,
      b2 = 3*(1-t)*t*t,
      b3 = t*t*t;
  return new Vector3(
    b0 * p0.x + b1 * p1.x + b2 * p2.x + b3*p3.x,
    b0 * p0.y + b1 * p1.y + b2 * p2.y + b3*p3.y,
    b0 * p0.z + b1 * p1.z + b2 * p2.z + b3*p3.z
  );
}

function bezierPatch(p, t, u) {
  var p0 = bezier3(p[0], p[1], p[2], p[3], t),
      p1 = bezier3(p[4], p[5], p[6], p[7], t),
      p2 = bezier3(p[8], p[9], p[10], p[11], t),
      p3 = bezier3(p[12], p[13], p[14], p[15], t);
  return bezier3(p0, p1, p2, p3, u);
}

function line(v0, v1) {
  ctx.strokeLine(v0.x, v0.y, v1.x, v1.y);
}
  
function dot(v) {
  ctx.fillRect(v.x, v.y, 2, 2);
}

function toRad(a) {
  return a * Math.PI / 180.0;
}

var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    p = [];

ctx.lineWidth = 0.5;
ctx.fillStyle = '#000';
ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
ctx.fillRect(0, 0, 400, 400);
ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';

var x0 = -0.5,
    x1 = -0.5 + 1/3,
    x2 = 0.5 - 1/3,
    x3 = 0.5,
    y0 = 0.1,
    y1 = -0.1;

var pos = [
  x0,0,x0, x1,y0,x0, x2,y1,x0, x3,0,x0,
  x0,0,x1, x1,y0,x1, x2,y1,x1, x3,0,x1,
  x0,0,x2, x1,y0,x2, x2,y1,x2, x3,0,x2,
  x0,0,x3, x1,y0,x3, x2,y1,x3, x3,0,x3
];

for(var i = 0; i < pos.length; i += 3) {
  p[i/3] = new Vector3(pos[i], pos[i + 1], pos[i + 2]);
}

var proj = Matrix4.perspective(toRad(30), 1, 0.1, 100),
    view = Matrix4.lookAt(new Vector3(1, 2, 1), new Vector3(0, 0, 0), Vector3.up),
    screen = Matrix4.viewport(canvas.width, canvas.height, 0.1, 100.0),
    upv = screen.mul(proj).mul(view),
    b = [],
    division = 200;

console.time("bezier patch");
for(i = 0; i <= division; i++) {
  for(var j = 0; j <= division; j++) {
    b.push(bezierPatch(p, i / division, j / division));
  }
}
console.timeEnd("bezier patch");

b.forEach(function(e) {
  dot(upv.apply(e));
});


  
  for(var i = 0; i < pos.length; i += 3) {
    p[i/3] = new Vector3(pos[i], pos[i + 1], pos[i + 2]);
  }




