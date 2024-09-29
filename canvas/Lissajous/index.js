(function() {
    
    function hsl(h, s, l) { return 'hsl(' + h + ',' + s + '%,' + l + '%)'; }
    
    let setAnimFrame = (callback, interval) => {
        let elapsed = 0,
            time = Date.now(),
            stop = false;
        
        let update = function() {
            let delta = Date.now() - time;
            time = Date.now();
            elapsed += delta;
            if (elapsed >= interval) {
                let n = elapsed / interval ^ 0;
                elapsed -= n * interval;
                callback();
            }
            
            if (!stop) {
                requestAnimationFrame(update);
            }
        };
        
        update();
        
        return {
            play: () => {
                stop = false;
                update();
            },
            pause: () => {
                stop = true;
            },
            step: () => {
                stop = true;
                elapsed = interval;
                update();
            },
            toggle: function() {
                if (stop) {
                    this.play();
                } else {
                    this.pause();
                }
            }
        };
    };
    
    let canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        width = canvas.width,
        height = canvas.height,
        centerX = width / 2,
        centerY = height / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let t = 0.0,
        n = 16,
        a = 3,
        b = 4,
        s = 0.01,
        dot = false;
    
    function render() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < n; i++) {
            let r = Math.PI * 2.0 / n * i;
            let x = Math.sin(a * (t + r)) * 100 + centerX,
                y = Math.sin(b * (t + r)) * 100 + centerY,
                px = Math.sin(a * (t + r - s)) * 100 + centerX,
                py = Math.sin(b * (t + r - s)) * 100 + centerY;
            
            if (dot) {
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
    
    let hook = setAnimFrame(render, 1000 / 30);
    
    canvas.addEventListener('click', () => {
        hook.toggle();
    }, false);
    
    document.body.appendChild(createSlider('a', 0.1, (v) => {
        a = v * 10 + 1;
    }));
    document.body.appendChild(createSlider('b', 0.1, (v) => {
        b = v * 10 + 1;
    }));
    document.body.appendChild(createSlider('n', n / 32, (v) => {
        n = v * 32 ^ 0 + 1;
    }));
    document.body.appendChild(createCheckbox('dot', (v) => {
        dot = v;
    }));
    
})();
