var canvas = document.getElementById('world'),
    ctx = canvas.getContext('2d'),
    img = new Image(),
    down = false,
    px = 0,
    py = 0,
    strokeColor = rgba(0, 0, 0, 0.8),
    strokeWidth = 0.8;

// canvasの設定
ctx.strokeStyle = '#000';
ctx.fillStyle = rgba(0, 0, 0, 0.8);
ctx.lineWidth = 1.0;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

//line(0, 0, 10, 10);

function rgba(r, g, b, a) {
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

/*
var palette = document.getElementsByTagName('td');
for(var i = 0, n = palette.length; i < n; i++) {
  palette[i].addEventListener('click', function(e) {
    strokeColor = this.style.backgroundColor;
  }, false);  
}
*/

Array.prototype.slice.apply(document.getElementsByTagName('td')).forEach(function(i) {
  i.addEventListener('click', function(e) {
    strokeColor = this.style.backgroundColor;
  }, false);  
});

canvas.addEventListener('drop', function(e) {
  e.preventDefault();
  loadFile(e);
}, false);

canvas.addEventListener('dragover', function(e) {
  e.preventDefault();
}, false);

function loadFile(e) {
  var file = e.dataTransfer.files[0],
      reader = new FileReader();
  reader.onload = function(e) {
    img.src = reader.result;
    img.onload = function(e) {
      //ctx.drawImage(img, 0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 400, 400);
    };
  };
  reader.readAsDataURL(file);
}

canvas.addEventListener('mousedown', function(e) {
  var rect = e.target.getBoundingClientRect();
  down = true;
  px = e.clientX - rect.left;
  py = e.clientY - rect.top;
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = strokeColor;
  ctx.beginPath();
  ctx.moveTo(px, py);
}, false);

canvas.addEventListener('mousemove', function(e) {
  if(down) {
    canvas.style.cursor = 'default';
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left,
        y = e.clientY - rect.top;
    //ctx.beginPath();
    //ctx.moveTo(px, py);
    //ctx.lineTo(x, y);
    //ctx.closePath();
    //ctx.stroke();
    
    line(px, py, x, y);
    px = x;
    py = y;
  }
}, false);

canvas.addEventListener('mouseup', function(e) {
  if(down) {
    down = false;
    //ctx.closePath();
    //ctx.stroke();
  }
}, false);

function circle(x, y, r) {
  ctx.arc(x, y, r, 0, Math.PI * 2.0, false);
}

var seg = 20.0;

function line(x, y, ex, ey) {
  var dx = (ex - x) / 20.0,
      dy = (ey - y) / 20.0;
  ctx.beginPath();
  for(var i = 0; i < 20; i++) {
    circle(dx * i + x, dy * i + y, strokeWidth / 2.0);
  }
  ctx.fill();
}


