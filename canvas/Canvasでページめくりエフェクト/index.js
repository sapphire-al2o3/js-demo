(function() {
    'use strict';
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d');
    
    var w = canvas.width,
        h = canvas.height;
    
    document.getElementById('size512').addEventListener('click', function() {
        w = h = canvas.width = canvas.height = 512;
    });
    
    var image0 = new Image();
    //image0.src = 'http://jsrun.it/assets/5/Q/R/o/5QRo7.jpg';
    image0.src = 'coast.jpg';
    image0.onload = function() {
        start();
    };
    
    var deg = 0,
        d = 0,
        t = 0.4;
    
    function move(x) {
        d = x;
        if(d > 89) d = 89;
        //render(image0);
    }
    
    canvas.addEventListener('mousemove', function(e) {
        var x = w - e.clientX;
        move(x * 0.5);
    });
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        e.stopPropagation();
		var touches = e.changedTouches;
		if(touches.length > 0) {
            var x = w - touches[0].pageX;
            move(x * 0.5);
        }
    });
    
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
    
    function start() {
        render(image0);
    }
    
    setAnimationFrame(function() {
        render(image0);
    }, 1000 / 60);
    
    function render(img) {
        
        if(Math.abs(deg - d) < 0.01) return;
        
        //				console.time('render');
        deg = deg * (1 - t) + d * t
        var rad = deg * Math.PI / 180;
        var x = h * Math.tan(rad);
        
        var x1 = w,
            y1 = 0;
        
        var x2 = w - x | 0,
            y2 = h;
        
        var x3 = w - x - Math.cos(rad * 2) * x | 0,
            y3 = h - Math.sin(rad * 2) * x | 0;
        
        var x4 = 0,
            y4 = h;
        
        var xx = x * Math.cos(rad);
        
        var x5 = w - xx * Math.cos(rad) | 0,
            y5 = h - xx * Math.sin(rad) | 0;
        
		// 画像で塗りつぶさない範囲だけクリアする
		ctx.clearRect(x2, 0, x, canvas.height);
        
        ctx.save();
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x4, y4);
        ctx.closePath();
        ctx.clip();
        
        ctx.drawImage(img, 0, 0);
        
        ctx.restore();
        
        // 折り返し
        var grad = ctx.createLinearGradient(x5, y5, x3, y3);
        grad.addColorStop(0.0, '#BBB');
        grad.addColorStop(0.1, '#999');
        grad.addColorStop(0.4, '#EEE');
        grad.addColorStop(1.0, '#FFF');
        
        // シャドウだと重いかもしれない
        ctx.shadowBlur = 32.0;
        ctx.shadowColor = '#000';
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        
        ctx.shadowBlur = 0.0;
        
        // 影をグラデーションでつける
        //				grad = ctx.createLinearGradient(x5, y5, w, h);
        //				grad.addColorStop(0.0, 'rgba(0, 0, 0, 0.6)');
        //				grad.addColorStop(0.3, 'rgba(0, 0, 0, 0.2)');
        //				grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
        //				
        //				ctx.beginPath();
        //				ctx.moveTo(w, 0);
        //				ctx.lineTo(w, h);
        //				ctx.lineTo(x2, y2);
        //				ctx.closePath();
        //				ctx.fillStyle = grad;
        //				ctx.fill();
        
        //				console.timeEnd('render');
    }
})();