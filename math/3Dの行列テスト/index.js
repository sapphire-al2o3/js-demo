var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

function hsva(h,s,v,a){var f=h/60,i=f^0,m=v-v*s,k=v*s*(f-i),p=v-k,q=k+m;return 'rgba('+[[v,p,m,m,q,v][i]*255^0,[q,v,v,p,m,m][i]*255^0,[m,m,q,v,v,p][i]*255^0,a].join(',')+')';}
  
function line(v0, v1) {
  ctx.beginPath();
  ctx.moveTo(v0.x, v0.y);
  ctx.lineTo(v1.x, v1.y);
  ctx.stroke();
}

function toRad(a) {
  return a * Math.PI / 180.0;
}

ctx.lineWidth = 0.5;
ctx.fillStyle = '#000';
ctx.strokeStyle = hsva(0, 0, 1, 0.4);
ctx.fillRect(0, 0, 400, 400);
  
var p = [
  new Vector3(-1,  1, -1),
  new Vector3( 1,  1, -1),
  new Vector3( 1,  1,  1),
  new Vector3(-1,  1,  1),
  new Vector3(-1, -1, -1),
  new Vector3( 1, -1, -1),
  new Vector3( 1, -1,  1),
  new Vector3(-1, -1,  1)
];
  
var proj = Matrix4.perspective(toRad(30), 1, 0.1, 100),
    view = Matrix4.lookAt(new Vector3(3, 4, 5), new Vector3(0, 0, 0), Vector3.up),
    screen = Matrix4.viewport(canvas.width, canvas.height, 0.1, 100.0),
    upv = screen.mul(proj).mul(view);
  
p = p.map(function(e) { return upv.apply(e.add(Vector3(0, 0, 0))); });
  
line(p[0], p[1]);
line(p[1], p[2]);
line(p[2], p[3]);
line(p[3], p[0]);

line(p[4], p[5]);
line(p[5], p[6]);
line(p[6], p[7]);
line(p[7], p[4]);

line(p[0], p[4]);
line(p[1], p[5]);
line(p[2], p[6]);
line(p[3], p[7]);

