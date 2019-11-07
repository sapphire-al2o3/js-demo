(function() {
    
    function hsl(h, s, l) { return 'hsl(' + h + ',' + s + '%,' + l + '%)'; }
    
    var setAnimFrame = function(callback, interval) {
        var elapsed = 0,
            time = Date.now(),
            stop = false;
        
        var update = function() {
            var delta = Date.now() - time;
            time = Date.now();
            elapsed += delta;
            if(elapsed >= interval) {
                var n = elapsed / interval ^ 0;
                elapsed -= n * interval;
                callback();
            }
            
            if(!stop) {
                requestAnimationFrame(update);
            }
        };
        
        update();
        
        return {
            play: function() {
                stop = false;
                update();
            },
            pause: function() {
                stop = true;
            },
            step: function() {
                stop = true;
                elapsed = interval;
                update();
            },
            toggle: function() {
                if(stop) {
                    this.play();
                } else {
                    this.pause();
                }
            }
        };
    };
    
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        width = canvas.width,
        height = canvas.height,
        centerX = width / 2,
        centerY = height / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    var t = 0.0,
        n = 16,
        a = 3,
        b = 4,
        s = 0.01,
        dot = false;
    
    function render() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for(var i = 0; i < n; i++) {
            var r = Math.PI * 2.0 / n * i;
            var x = Math.sin(a * (t + r)) * 100 + centerX,
                y = Math.sin(b * (t + r)) * 100 + centerY,
                px = Math.sin(a * (t + r - s)) * 100 + centerX,
                py = Math.sin(b * (t + r - s)) * 100 + centerY;
            
            if(dot) {
                ctx.fillStyle = hsl(t * 100 ^ 0, 100, 50);
                ctx.fillRect(x, y, 2, 2);
            } else {
                ctx.strokeStyle = hsl(t * 100 ^ 0, 100, 50);
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(px, py);
                ctx.stroke();
            }
        }
        t += s;
    }
    
    var hook = setAnimFrame(render, 1000 / 30),
        playing = true;
    
    canvas.addEventListener('click', function() {
        hook.toggle();
    }, false);
    
    document.body.appendChild(createSlider('a', 0.1, function(v) {
        a = v * 10 + 1;
    }));
    document.body.appendChild(createSlider('b', 0.1, function(v) {
        b = v * 10 + 1;
    }));
    document.body.appendChild(createSlider('n', n / 32, function(v) {
        n = v * 32 ^ 0 + 1;
    }));
    document.body.appendChild(createCheckbox('dot', function(v) {
        dot = v;
    }));
    
})();
