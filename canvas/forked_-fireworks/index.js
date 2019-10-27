// forked from kyo_ago's "fireworks" http://jsdo.it/kyo_ago/fireworks
// forked from zarkswerk's "fireworx" http://jsdo.it/zarkswerk/fireworx
// forked from zarkswerk's "fireworks" http://jsdo.it/zarkswerk/3598

setTimeout(function () {
    var hanabi = {
      // 火花の数
        // particle　quantity
    'quantity' : 300,
    // 火花の大きさ
        // particle size
    'size' : 3,

    // 減衰力（花火自体の大きさに影響
        // hanabi size
    'circle' : 0.97,

    // 重力
        // gravity
    'gravity' : 1.1,
    // 火花の速度
        // particle spped
    'speed' : 5,

    // 爆発縦位置
        // explosion point(top)
    'top' : 3,
    // 爆発横位置
        // explosion point(left)
    'left' : 2,

    // 花火の色。cssと同じ形式で指定可能（rgba(200, 200, 200, 0.5)形式も可能）。'random'でランダム色
        // particle color(#ffffff or rgba(255, 255, 255, 1) or black or random)
        'color' : '#ffff00'
  };

  // 以下花火の制御コードです

  Math.Radian = Math.PI * 2;
  var hibana = [/*{
    'pos_x' : left,
    'pos_y' : top,
    'vel_x' : Math.cos(angle) * speed,
    'vel_y' : Math.sin(angle) * speed
  }, ...*/];
  var cvs = {
    // canvas element
    'elem' : undefined,
    // canvas width(window max)
    'width' : 0,
    // canvas width(window height)
    'height' : 0,
    // 2d context
    'ctx' : undefined,
    // element offset(left)
    'left' : 0,
    // element offset(top)
    'top' : 0,
    // explode point(x)
    'pos_x' : 0,
    // explode point(y)
    'pos_y' : 0
  };

  setTimeout(function () {
    cvs.pos_y = (cvs.height / hanabi.top) - cvs.top;
    cvs.pos_x = cvs.width / hanabi.left - cvs.left;
    for (var i = 0; i < hanabi.quantity; ++i) {
      var angle = Math.random() * Math.Radian;
      var speed = Math.random() * hanabi.speed;
      hibana.push({
        'pos_x' : cvs.pos_x,
        'pos_y' : cvs.pos_y,
        'vel_x' : Math.cos(angle) * speed,
        'vel_y' : Math.sin(angle) * speed
      });
    };
    requestAnimationFrame(render0);
  }, 0)

  function clear_point (x, y, size) {
    setTimeout(function () {
      requestAnimationFrame(function () {
        cvs.ctx.save();
        cvs.ctx.beginPath();
        cvs.ctx.arc(x, y, size*1.2, 0, Math.Radian, true);
        cvs.ctx.clip();
        cvs.ctx.clearRect(0, 0, cvs.width, cvs.height);
        cvs.ctx.restore();
      });
    }, 50)
  };

  var frame = 0;
  if (hanabi.color === 'random') {
    hanabi.color = colorz.randHsl(100, 90, 60, 50, 90, 70).toString();
  };
  function render () {
    if (!hibana.length) {
      return;
    };
    var clear = 0;
    frame++;
    cvs.ctx.fillStyle = (frame % 2) ? "rgba(256, 256, 256, 0.8)" : hanabi.color;
    for (var i = 0, len = hibana.length; i < len; i++) {
      var s = hibana[i];
      clear_point(s.pos_x, s.pos_y, hanabi.size);
      s.pos_x += s.vel_x;
      s.pos_y += s.vel_y;
      s.vel_x *= hanabi.circle;
      s.vel_y *= hanabi.circle;
      s.pos_y += hanabi.gravity;
      if (hanabi.size < 0.1 || !s.pos_x || !s.pos_y || s.pos_x > cvs.width || s.pos_y > cvs.height) {
        hibana[i] = undefined;
        if (len < ++clear) {
          try { window.parent.endAnimation(location.href); } catch (e) {}
        }
        return;
      };
      cvs.ctx.beginPath();
      cvs.ctx.arc(s.pos_x, s.pos_y, hanabi.size, 0, Math.Radian, true);
      cvs.ctx.fill();
    };
    hanabi.size *= hanabi.circle;
    cvs.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    cvs.ctx.fillRect(0, 0, cvs.width, cvs.height);
    requestAnimationFrame(render);
  }

var pos = {x:0, y: 0}
    count = 0;
function render0() {
  pos.x += Math.sin(count) + Math.random() * 0.5 - 0.25;
  pos.y -= 2.2;
  count += 0.4;
  
  cvs.ctx.fillStyle = 'rgba(255, 200, 0, 0.8)';
  cvs.ctx.beginPath();
  cvs.ctx.arc(pos.x, pos.y, 2, 0, Math.Radian, true);
  cvs.ctx.fill();
  cvs.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  cvs.ctx.fillRect(0, 0, cvs.width, cvs.height);
  
  console.log(pos.y);
  console.log((cvs.height / hanabi.top) - cvs.top);
  
  if((cvs.height / hanabi.top) - cvs.top < pos.y) {
    requestAnimationFrame(render0);
  } else {
    requestAnimationFrame(render);    
  }
}

  cvs.elem = document.getElementById('hanabi');
  if (!cvs.elem || !cvs.elem.getContext) {
    return alert('require canvas support');
  };
  (function () {
    var b = document.body;
    var d = document.documentElement;
    cvs.width = Math.max(b.clientWidth , b.scrollWidth, d.scrollWidth, d.clientWidth);
    cvs.height = Math.max(b.clientHeight , b.scrollHeight, d.scrollHeight, d.clientHeight);
  })();
  cvs.elem.height = cvs.height;
  cvs.elem.width = cvs.width;
  cvs.ctx = cvs.elem.getContext('2d');
  cvs.left = cvs.elem.getBoundingClientRect
    ? cvs.elem.getBoundingClientRect().left
    : 0
  ;
  cvs.top = cvs.elem.getBoundingClientRect
    ? cvs.elem.getBoundingClientRect().top
    : 0
  ;
pos.y = cvs.height;
pos.x = cvs.width / hanabi.left - cvs.left;
}, 0);

//set window.requestAnimationFrame
(function (w, r) {
  w['r'+r] = w['r'+r] || w['webkitR'+r] || w['mozR'+r] || w['msR'+r] || w['oR'+r] || function(c){ w.setTimeout(c, 1000 / 60); };
})(window, 'equestAnimationFrame');











