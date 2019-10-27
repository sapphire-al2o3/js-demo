(function() {
                
    var points = [],
        cells = [],
        grid = [],
        w = 10,
        h = 10;
    
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        width = canvas.width,
        height = canvas.height;
    
    function lerp(a, b, t) {
        return a * (1 - t) + b * t;
    }
    
    function ease(t) {
        t = 0.5*Math.sin((t-0.5)*Math.PI)+0.5;
//      return (t-0.5)*(t-0.5)*(t-0.5)*4+0.5;
        return t * t;
    }
    
    Array.prototype.randomForEach = function(fn) {
        var a = [];
            n = this.length;
        
        for(var i = 0; i < n; i++) {
            a.push(i);
        }
        
        for(; n > 0; n--) {
            var k = Math.random() * n ^ 0;
            fn(this[a[k]], a[k]);
            a[k] = a[n - 1];
        }
    };
                
    function Token(a) {
        this.a = a;
        this.length = this.a.length;
    }
                
    Token.prototype.pop = function() {
        if(this.length > 1) {
            var k = Math.random() * this.length | 0,
                v = this.a[k];
            this.a[k] = this.a[this.length - 1];
            this.a[this.length - 1] = v;
            this.length--;
            return v;
        } else if(this.length > 0) {
            this.length--;
            return this.a[0];
        }
    };
				
    Token.prototype.reset = function() {
        this.length = this.a.length;
    };
    
    var k = 0;
    for(var i = 0; i < h; i++) {
        grid[i] = [];
        for(var j = 0; j < w; j++) {
            if(Math.random() > 0.1) {
                grid[i][j] = k++;
                
                cells.push({
                    color: 'hsl(' + Math.random() * 360 + ', 100%, 85%)',
                    x: j,
                    y: i,
                    tx: j,
                    ty: i,
                    d: Math.random() * 4 | 0,
                    skip: false
                });
            } else {
                grid[i][j] = -1;
            }
        }
    }
    
    var moving = false,
        interval = 0,
        reverse = false;
    
    var n = cells.length,
        m = 0,
        l = 1,
        token = new Token([0, 1, 2, 3]);
    
    function update() {
        
        if(moving) {
            interval--;
            if(interval <= 0) {
                cells.forEach(function(cell, k) {
                    if(cell.x !== cell.tx || cell.y !== cell.ty) {
                        grid[cell.y][cell.x] = -1;
                        cell.x = cell.tx;
                        cell.y = cell.ty;
                        cell.skip = true;
                    }
                });
                moving = false;
            }
        } else {
            //for(var c = 0; c < n; c++) {
            //	var k = reverse ? n - c - 1 : c,
            //		cell = cells[k],
            cells.randomForEach(function(cell, k) {
                    x = cell.x,
                    y = cell.y;
                
                if(cell.skip) {
                    cell.skip = false;
                    //continue;
                    return;
                }
                
                token.reset();
                for(var i = 0; i < 4; i++) {
                    //var j = (cell.d + 1) % 4;
                    //cell.d = j;
                    var j = token.pop();
                    if(j === 0 && y > 0 && grid[y - 1][x] < 0) {
                        cell.ty = y - 1;
                        grid[y - 1][x] = k;
                        break;
                    }
                    if(j === 1 && y < h - 1 && grid[y + 1][x] < 0) {
                        cell.ty = y + 1;
                        grid[y + 1][x] = k;
                        break;
                    }
                    if(j === 2 && x > 0 && grid[y][x - 1] < 0) {
                        cell.tx = x - 1;
                        grid[y][x - 1] = k;
                        break;
                    }
                    if(j === 3 && x < w - 1 && grid[y][x + 1] < 0) {
                        cell.tx = x + 1;
                        grid[y][x + 1] = k;
                        break;
                    }
                }
            });
            moving = true;
            interval = 60;
            reverse = !reverse;
        }
        
        render();
    }
    
    var size = 40;
    
    function render() {
//					ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        cells.forEach(function(cell, k) {
            var t = ease(interval / 60),
                x = lerp(cell.x, cell.tx, 1 - t) * size,
                y = lerp(cell.y, cell.ty, 1 - t) * size;
            ctx.fillStyle = cell.color;
            ctx.fillRect(x, y, size, size);
        });
    }
    
    function setAnimFrame(callback, interval) {
        var elapsed = 0,
            time = Date.now(),
            stop = false;
        
        interval = interval || 0;
        
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
    };
    setAnimFrame(update);
    
})();