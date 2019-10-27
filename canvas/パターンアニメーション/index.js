window.onload = function() {
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    tex = [],
    x = 10,
    y = 10;
    
canvas.addEventListener('click', function(e) {
  var rect = e.target.getBoundingClientRect();
  x = e.clientX - rect.left;
  y = e.clientY - rect.top;
}, false);
    
  
tex = document.getElementsByTagName('img');
  
    var sprites = [];
    sprites.push(new Anim(ctx, tex[0]));
    sprites.push(new Anim(ctx, tex[1]));
    var f = 0;
    setInterval(function() {
      ctx.clearRect(0, 0, 400, 400);
      sprites[0].draw(x, y, f);
      sprites[1].draw(x, y + 40, f);
      f++;
    }, 1000/10);
};

function Anim(ctx, img) {
  this.src = img;
  this.ctx = ctx;
  this.pattern = img.width > img.height ? Math.floor(img.width / img.height) : Math.floor(img.height/ img.height);
  this.width = img.width > img.height ? img.width / this.pattern : img.width;
  this.height = img.height;
}

Anim.prototype.draw = function(x, y, f) {
  var frame = f % this.pattern;
  this.ctx.drawImage(this.src, this.width * frame, 0, this.width, this.height, x, y, this.width, this.height);
};
