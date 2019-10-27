//(function() {
  var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    points = [],
    down = false,
    count = 0;
  
  function hsva(h,s,v,a){var f=h/60,i=f^0,m=v-v*s,k=v*s*(f-i),p=v-k,q=k+m;return 'rgba('+[[v,p,m,m,q,v][i]*255^0,[q,v,v,p,m,m][i]*255^0,[m,m,q,v,v,p][i]*255^0,a].join(',')+')';}
  
  function catmullRom(x0, y0, x1, y1, x2, y2, x3, y3, t, c) {
    var vx0 = (x2 - x0) * 0.5 * c,
        vy0 = (y2 - y0) * 0.5 * c,
        vx1 = (x3 - x1) * 0.5 * c,
        vy1 = (y3 - y1) * 0.5 * c;
    return {
      x: (2.0 * x1 - 2.0 * x2 + vx0 + vx1) * t * t * t
        + (-3 * x1 + 3 * x2 - 2 * vx0 - vx1) * t * t
        + vx0 * t + x1,
      y: (2 * y1 - 2 * y2 + vy0 + vy1) * t * t * t
        + (-3 * y1 + 3 * y2 - 2 * vy0 - vy1) * t * t
        + vy0 * t + y1
    };
  }
  
  function catmullRomCurve(x0, y0, x1, y1, x2, y2, x3, y3, c) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    for(var i = 1; i <= 10; i++) {
      var p = catmullRom(x0, y0, x1, y1, x2, y2, x3, y3, i / 10.0, c);
      if(x0 === NaN) {
        console.log(x0);
        }
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }
  var x = [], y = [];
  var mousePosition = new Vector2(0, 0),
      update = false;
  canvas.onmousemove = function(e) {
    count++;
    if(count > 360) count = 0;
    
    if(update) {
      mousePosition.x = e.pageX;
      mousePosition.y = e.pageY;
      update = false;
    }
  };
  
  setInterval(function() {
    ctx.strokeStyle = hsva(count % 360, 1.0, 1.0, 0.2);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 400, 400);
    
    if(x.length >= 50) {
      var v0 = new Vector2(x[10], y[10]),
          v1 = new Vector2(x[20], y[20]),
          v2 = new Vector2(x[30], y[30]),
          v3 = new Vector2(x[40], y[40]);
      
      //catmullRomCurve(x[0], y[0], v0.x, v0.y, v1.x, v1.y, v2.x, v2.y, r1);
      catmullRomCurve(v0.x, v0.y, v0.x, v0.y, v1.x, v1.y, v2.x, v2.y, 1.0);
      catmullRomCurve(v0.x, v0.y, v1.x, v1.y, v2.x, v2.y, v3.x, v3.y, 1.0);
      catmullRomCurve(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y, v3.x, v3.y, 1.0);
      //catmullRomCurve(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y, x[50], y[50], r1);
      //catmullRomCurve(v2.x, v2.y, v3.x, v3.y, x[40], y[40], x[40], y[40], r1);
      
      for(var i = 1; i < 4; i++) {
        var n1 = v2.sub(v0).orthogonal().normalize().mul(i * 2),
            n2 = v3.sub(v1).orthogonal().normalize().mul(i * 2),
            v4 = v1.add(n1),
            v5 = v1.sub(n1),
            v6 = v2.add(n2),
            v7 = v2.sub(n2);
        catmullRomCurve(v0.x, v0.y, v0.x, v0.y, v4.x, v4.y, v6.x, v6.y, 1.0);
        catmullRomCurve(v0.x, v0.y, v4.x, v4.y, v6.x, v6.y, v3.x, v3.y, 1.0);
        catmullRomCurve(v4.x, v4.y, v6.x, v6.y, v3.x, v3.y, v3.x, v3.y, 1.0);
        
        catmullRomCurve(v0.x, v0.y, v0.x, v0.y, v5.x, v5.y, v7.x, v7.y, 1.0);
        catmullRomCurve(v0.x, v0.y, v5.x, v5.y, v7.x, v7.y, v3.x, v3.y, 1.0);
        catmullRomCurve(v5.x, v5.y, v7.x, v7.y, v3.x, v3.y, v3.x, v3.y, 1.0);
      }
    }
    
    x.push(mousePosition.x);
    y.push(mousePosition.y);
    
    if(x.length > 50) {
      x.shift();
      y.shift();
    }
    
    update = true;
  }, 1000 / 60);
  
  ctx.lineWidth = 2.0;
  ctx.fillStyle = '#000';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(0, 0, 400, 400);
//})();
