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
    view = Matrix4.lookAt(Vector3(3,4,8), Vector3(0,0,0), Vector3.up),
    screen = Matrix4.viewport(canvas.width, canvas.height, 0.1, 100.0),
    upv = screen.mul(proj).mul(view);

function draw() {
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  view = Matrix4.lookAt(position, target, up);
  upv = screen.mul(proj).mul(view);
  var q = p.map(function(e) { return upv.apply(e); });
  
  line(q[0], q[1]);
  line(q[1], q[2]);
  line(q[2], q[3]);
  line(q[3], q[0]);
  
  line(q[4], q[5]);
  line(q[5], q[6]);
  line(q[6], q[7]);
  line(q[7], q[4]);
  
  line(q[0], q[4]);
  line(q[1], q[5]);
  line(q[2], q[6]);
  line(q[3], q[7]);
}

var position = Vector3(0, 3, 8),
    target = Vector3(0, 0, 0),
    up = Vector3(0, 1, 0);

var ease = function(x) {
  return 0.5 * Math.sin(Math.PI * (x - 0.5)) + 0.5;
};

function lerp(a, b, t) {
  return a.mul(1.0 - t).add(b.mul(t));  
}

var t = 0,
    target0 = new Vector3(0, 0, 0),
    o = Vector3(0, 3, 8),
    b = Vector3(0, 3, 32),
    c = Vector3(0, 3, 8),
    d = Vector3(16, 3, 12),
    k0 = Vector3(4, 0, 0),
    k1 = Vector3(0, 6, 0);

function dolly(t) {
  var e = ease(t);
  position = t < 0.5 ? lerp(o, b, e) : lerp(b, o, e);
}
function track(t) {
  var e = ease(t);
  position = t < 0.5 ? lerp(o, d, e) : lerp(d, o, e);
}
function pan(t) {
  var e = ease(t);
  target = t < 0.5 ? lerp(target0, k0, e) : lerp(k0, target0, e);
}
function tilt(t) {
var e = ease(t);
target = t < 0.5 ? lerp(target0, k1, e) : lerp(k1, target0, e);
}
function roll(t) {
  var e = ease(t) * Math.PI * 2;
  up.x = Math.sin(e);
  up.y = Math.cos(e);
}


function Play(f) {
  var t = 0;
  (function() {
    f(t);
    draw();
    t += 0.01;
    if(t <= 1) {
      setTimeout(arguments.callee, 33);
    }
  })(f);
}
Play(dolly);








