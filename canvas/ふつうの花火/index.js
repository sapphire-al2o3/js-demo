setTimeout(function() {
var canvas = document.getElementById('canvas'),
    screen = canvas.getContext('2d'),
    buffer = document.getElementById('buffer'),
    buf = buffer.getContext('2d', {'willReadFrequently': true}),
    back = document.getElementById('back'),
    ctx = back.getContext('2d'),
    points = [],
    down = false,
    count = 0,
    width = canvas.width,
    height = canvas.height,
    left = 0,
    top = 0,
    pos = {x: 0, y: 0},
    particle = [];

CanvasRenderingContext2D.prototype.circle = function(x, y, r) {
  this.beginPath();
  this.arc(x, y, r, 0, Math.PI * 2, false);
  this.closePath();
};

CanvasRenderingContext2D.prototype.fillCircle = function(x, y, r) {
  this.circle(x, y, r);
  this.fill();
};

(function () {
  var b = document.body,
      d = document.documentElement,
      r = canvas.getBoundingClientRect();
  left = r ? r.left : 0;
  top = r ? r.top : 0;
  width = Math.max(b.clientWidth , b.scrollWidth, d.scrollWidth, d.clientWidth);
  height = Math.max(b.clientHeight , b.scrollHeight, d.scrollHeight, d.clientHeight);
})();

//width = 200;
//height = 200;

canvas.width = width;
canvas.height = height;
back.width = width;
back.height = height;
pos.x = width / 2 - left;
pos.y = height;

ctx.lineWidth = 0.5;
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, width, height);
ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';

screen.fillRect(0, 0, width, height);

  for(var i = 0; i < 300; i++) {
    var a = Math.random() * Math.PI * 2,
      speed = 5 * Math.random(),
      color = rgba(255, 200, 0, 0.8);
    particle.push({
      x: pos.x,
      y: (height / 3) - top,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed,
      r: 0.5 * Math.random() + 1.2,
      g: 0.2 * Math.random() + 0.8,
      e: 100 + Math.floor(Math.random() * 100),
      c: color
    });
  }

  var shot = [];
  shot[0] = function() {
    count += 0.4;
    pos.x += Math.sin(count) + Math.random() * 0.5 - 0.25;
    pos.y -= 1.5;
    
    if(pos.y < 0) pos.y = 400;
    
    bloom();
    
    ctx.fillStyle = 'rgba(255, 200, 0, 0.8)';
    ctx.fillCircle(pos.x ,pos.y, 3);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    //if(count < 60) {
    if((height / 3) - top < pos.y) {
      requestAnimationFrame(arguments.callee);
    } else {
      //next();
      shot[1]();
    }
  };
  var frame = 0;
  shot[1] = function() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);

    //ctx.fillStyle = 'rgba(255, 200, 0, 0.8)';
    for(var i = 0; i < 300; i++) {
      var s = particle[i];
      
      if(!s) continue;
      
      s.x += s.vx;
      s.y += s.vy;
      s.vx *= 0.98;
      s.vy *= 0.98;
      s.y += s.g;
      s.r *= 0.98;

      if(s.r > 1.0) {
        ctx.fillStyle = rgba(255, 255, 255, 0.3 * s.r);
        ctx.fillCircle(s.x, s.y, s.r + 0.8);
      }
      ctx.fillStyle = frame & 1 ? s.c : rgba(255, 255, 255, 0.8);
      ctx.fillCircle(s.x, s.y, s.r);
      
      if(frame == 40) {
        s.r += 0.5;
      }
      
      if(s.r < 0.001) {
        particle[i] = null;        
      }
      
    }
    
    bloom();
    
    frame++;
    requestAnimationFrame(arguments.callee);
  };
  
  requestAnimationFrame(shot[0]);

function rgba(r, g, b, a) {
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

  var tmpImg = window.Uint32Array ? new Uint32Array(128 * 128 * 4) : new Array(128 * 128 * 4);
  
  function gaussBlur(img) {
    var d = img.data,
        p = 0,
        w = img.width;
    for(var i = 0; i < w; i++) {
      for(var j = 2; j < w - 2; j++) {
        p = (i * w + j) * 4;
        tmpImg[p] = d[p] * 2 + d[p - 4] + d[p + 4];
        tmpImg[p + 1] = d[p + 1] * 2 + d[p - 3] + d[p + 5];
        //d[p] = (d[p] * 4 + d[p - 4] * 2 + d[p + 4] * 2 + d[p - 8] + d[p + 8]) / 8;
        //d[p + 1] = (d[p + 1] * 4 + d[p - 3] * 2 + d[p + 5] * 2 + d[p - 7] + d[p + 9]) / 8;
        //d[p + 3] = 200;
      }
    }
    
    for(i = 0; i < w; i++) {
      for(j = 1; j < w - 1; j++) {
        p = (i * w + j) * 4;
        d[p] = (tmpImg[p] * 2 + tmpImg[p - w * 4] + tmpImg[p + w * 4]) / 16;
        d[p + 1] = (tmpImg[p + 1] * 2 + tmpImg[p - w * 4 + 1] + tmpImg[p + w * 4 + 1]) / 16;
      }
    }
  }

  function blur(ctx, x, y, w, h) {
    var img = ctx.getImageData(x, y, w, h);
    gaussBlur(img);
    ctx.putImageData(img, x, y);
  }
  
  function bloom() {
    buf.drawImage(back, 0, 0, width, height, 0, 0, 128, 128);
    
    buf.drawImage(buffer, 0, 0, 128, 128, 128, 0, 64, 64);
    //buf.drawImage(canvas, 0, 0, 400, 400, 192, 0, 32, 32);
    //buf.drawImage(canvas, 0, 0, 400, 400, 224, 0, 16, 16);
    
    buf.drawImage(buffer, 128, 0, 64, 64, 192, 0, 32, 32);
    buf.drawImage(buffer, 192, 0, 32, 32, 224, 0, 16, 16);

    /*
    var img = buf.getImageData(128, 0, 64, 64);
    gaussBlur(img);
    buf.putImageData(img, 128, 0);
    */
    blur(buf, 128, 0, 64, 64);
    blur(buf,  64, 0, 32, 32);
    
    screen.globalCompositeOperation = 'source-over';
    screen.clearRect(0, 0, width, height);
    screen.globalCompositeOperation = 'lighter';
    
    //test.drawImage(buffer, 350, 0, 25, 25, 0, 0, 400, 400);
    screen.drawImage(buffer, 192, 0, 32, 32, 0, 0, width, height);
    screen.drawImage(buffer, 128, 0, 64, 64, 0, 0, width, height);
    //test.drawImage(buffer, 0, 0, 128, 128, 0, 0, 400, 400);
    screen.drawImage(back, 0, 0, width, height, 0, 0, width, height);
    //ctx.globalCompositeOperation = 'source-over';
    //ctx.globalCompositeOperation = 'source-over';
    //screen.drawImage(back, width, height);
  }

},0);

(function (w, r) {
  w['r'+r] = w['r'+r] || w['webkitR'+r] || w['mozR'+r] || w['msR'+r] || w['oR'+r] || function(c){ w.setTimeout(c, 1000 / 60); };
})(window, 'equestAnimationFrame');







