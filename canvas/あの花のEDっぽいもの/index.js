var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    down = 0,
    stop = false;

canvas.onmousedown = function() {
  if(!stop) {
    stop = true;
    setTimeout(function() {
      down = 1 - down;
      stop = false;
    }, 600);
  }
};

var d = [
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
];

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;

ctx.fillStyle = '#FFF';
ctx.fillRect(0, 0, canvas.width, canvas.height);

function Flower(x, y, r, s, c) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.s = s;
  this.c = c;
  this.vx = Math.random() - 0.5;
}

Flower.prototype.draw = function() {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.scale(this.s, this.s);
  ctx.translate(145, 168);
  ctx.rotate(this.r);
  ctx.translate(-145, -168);
  ctx.fillStyle = color[down][this.c];
  ctx.beginPath();
  ctx.moveTo(d[0], d[1]);
  for(var i = 2, n = d.length - 6; i < n; i += 6) {
    ctx.bezierCurveTo(d[i], d[i + 1], d[i + 2], d[i + 3], d[i + 4], d[i + 5]);
  }
  ctx.bezierCurveTo(d[i], d[i + 1], d[i + 2], d[i + 3], d[0], d[1]);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

var f = 0,
    p = [],
    wait = 30,
    color = [['#DC59B8', '#CE186A', '#F4B8DA', '#F6D0BB', '#F1B7D8', '#EE8AE9'],
             ['#C8C8C8', '#B6B6B6', '#E7E7E7', '#F3F3F3', '#BBBBBB', '#D9D9D9']];

(function() {
  for(var i = 0; i < 500; i++) {
    var x = Math.random() * 600 - 20,
        y = Math.random() * 600,
        r = Math.random(),
        s = Math.random() * Math.random() * Math.random() * 0.3 + 0.05,
        c = Math.floor(Math.random() * 6);
    p.push(new Flower(x, y, r, s, c));
  }
})();

p.sort(function(a, b) { return a.s - b.s; });

setInterval(function() {
  if(stop) {
    return;
  }
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  for(var i = 0, n = p.length; i < n; i++) {
    var pt = p[i];
    pt.r += 0.02;
    pt.y += 4 * (1.0 - pt.s) * (down ? 1: -1);
    pt.x += pt.vx;
    pt.draw();
    
    if(down) {
      if(pt.y > canvas.height + 60) {
        pt.y = -60;
        pt.x = Math.random() * 400;
      }
    } else {
      if(pt.y < -100) {
        pt.y = canvas.height + 60;
        pt.x = Math.random() * 400;
      }
    }
  }
  f += 0.02;
}, 1000 / 30);

      
      
      
      
