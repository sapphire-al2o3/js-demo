CanvasRenderingContext2D.prototype.fillCircle = function(x, y, r) {
    this.beginPath();
    this.arc(x, y, r, 0.0, Math.PI * 2.0, false);
    this.fill();
};

function rgba(r, g, b, a) {
    return 'rgba(' + [r, g, b, a].join(',') + ')';
}

function hsva(h, s, v, a) {
    var f=h/60,i=f^0,m=v-v*s,k=v*s*(f-i),p=v-k,q=k+m,c=255;
    return rgba([v,p,m,m,q,v][i]*255^0,[q,v,v,p,m,m][i]*255^0,[m,m,q,v,v,p][i]*255^0,a);
}

function max(a, b) {
    return a > b ? a : b;
}

function min(a, b) {
    return a > b ? b : a;
}

function range(a, b) {
    return Math.random() * (b - a) + a;
}

function lerp(a, b, t) {
    return a * (1.0 - t) + b * t;
}

var Color = function(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
};
Color.prototype = {
    toString: function() {
        return '#' +
            ('0' + this.r.toString(16)).slice(-2).toUpperCase() +
            ('0' + this.g.toString(16)).slice(-2).toUpperCase() +
            ('0' + this.b.toString(16)).slice(-2).toUpperCase();
    }
};

var Hsv = function(h, s, v, a) {
    this.h = h;
    this.s = s;
    this.v = v;
    this.a = a;
};
Hsv.prototype.toRgb = function() {
    return hsva(this.h, this.s, this.v, this.a);
};

Hsv.lerp = function(a, b, t) {
    return new Hsv(lerp(a.h, b.h, t), lerp(a.s, b.s, t), lerp(a.v, b.v, t));
};

// パーティクル
var Particle = function(x, y) {
    this.x = x;
    this.y = y;
    this.vx = range(-0.7, 0.7);
    this.vy = 1.0;
    this.a = 0.5;
    this.r = range(3.0, 6.0);
    this.life = 60;
    this.color = rgba(0, 100, 255, 0.5);
};

Particle.prototype = {
    update: function(t) {
        this.x += this.vx;
        this.y += this.vy;
        this.a = 0.5;
        this.r = max(this.r - 0.1, 0);
        this.life--;
    },
    draw: function(ctx) {
        ctx.globalAlpha = this.a;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2.0, false);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
};

// エミッター
var Emitter = function(x, y) {
    this.particles = [];
    this.rate = 8;
    this.time = 0.0;
    this.x = x;
    this.y = y;
    this.vy = -2.5;
};
Emitter.prototype = {
    update: function(t) {
        var ps = this.particles,
            n = ps.length;
        
        //					this.x = Math.cos(this.time * 0.08) * 100.0 + 200.0;
        //					this.y = Math.sin(this.time * 0.08) * 100.0 + 200.0;
        this.y += this.vy;
        
        for(var i = 0; i < this.rate; i++) {
            var x = this.x + range(-16.0, 16.0),
                y = this.y + range(-8.0, 8.0),
                    p = new Particle(x, y);
            //						p.color = hsva(this.time % 360, 0.8, 1.0, 0.5);
            p.color = hsva(range(220, 240), range(0.2, 0.9), range(0.7, 1.0), 1.0);
            ps.push(p);
        }
        n += this.rate;
        if(n > 1000) throw 'over';
        for(i = 0; i < n; i++) {
            ps[i].update(t);
        }
        var tail = n;
        for(i = 0; i < tail; i++) {
            if(ps[i].life <= 0) {
                tail--;
                ps[i] = ps[tail];
                ps.pop();
            }
        }
        this.time += 1.0;
    },
    draw: function(ctx) {
        for(var i = 0, n = this.particles.length; i < n; i++) {
            this.particles[i].draw(ctx);
        }
    }
};

(function() {
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        width = canvas.width,
        height = canvas.height,
        name = 'ささみさん',
        //name = 'あいうえお',
        message = '＠がんばらない',
        //message = 'かきくけこさし',
        node = [];
    ctx.clearRect(0, 0, 400, 400);
    ctx.fillStyle = '#EDEFEF';
    ctx.fillRect(0, 0, 400, 400);
    ctx.font = '28px GanbaranaiFont';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#44E';
    ctx.lineWidth = 6.0;
    ctx.shadowBlur = 6.0;
    ctx.shadowColor = '#007';
    ctx.fillStyle = '#FFF';
    
    // 名前部分の作成
    function createName(name) {
        var chars = [],
            l = name.length,
            baseX = 200,
            baseY = 0,
            y = 0,
            c;
        
        for(var i = 0; i < l; i++) {
            c = {};
            c.size = range(30 + (l - i), 30 + (l - i) * 6);
            y += c.size * 0.85;
            c.offsetX = range(2, 12) + baseX;
            c.offsetY = y + baseY;
            c.char = name[i];
            chars.push(c);
        }
        
        baseY = 220 - y;
        y = 0;
        for(i = 0; i < l; i++) {
            c = chars[i].size;
            y += c * 0.85;
            chars[i].offsetY = y + baseY;
        }
        
        return chars;
    }
    
    // メッセージ部分の作成
    function createMessage(message) {
        var chars = [],
            y = 0,
            size = [72, 46, 38, 44, 42, 34, 32],
            baseX = 150,
            baseY = 250,
            offsetX = [ 8,  0, 10,  2,  2,  12, 8],
            offsetY = [ 0, 20, 42, 74, 100, 124, 140];
        for(var i = 0; i < message.length; i++) {
            var c = {};
            c.size = size[i];
            c.offsetX = offsetX[i] + baseX;
            c.offsetY = offsetY[i] + baseY;
            c.char = message[i];
            chars.push(c);
        }
        return chars;
    }
    
    // テキストの描画
    function drawText(text) {
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#FFF';
        ctx.shadowColor = '#007';
        ctx.shadowBlur = 6.0;
        var c;
        for(var i = 0; i < text.length; i++) {
            c = text[i];
            ctx.font = '' + c.size + 'px GanbaranaiFont';
            ctx.strokeText(c.char, c.offsetX, c.offsetY);
        }
        ctx.shadowBlur = 0.0;
        for(i = 0; i < text.length; i++) {
            c = text[i];
            ctx.font = '' + c.size + 'px GanbaranaiFont';
            ctx.fillText(c.char, c.offsetX, c.offsetY);
        }
    }
    
    
    // フォントのロード後に表示したい
    var start = function() {
        var n = createName(name),
            m = createMessage(message);
        drawText(n);
        drawText(m);
        node = [].concat(n, m);
    };
    setTimeout(start, 1000 / 10);
    
    var emitter = null;
    
    function nearNode(y) {
        for(var l = node.length - 1; l >= 0; l--) {
            var n = node[l];
            if(y > n.offsetY - n.size) {
                return n.offsetX + n.size * 0.5;
            }
        }
        return -1;
    }
    
    function update(frame) {
        emitter.y -= 3;
        var x = nearNode(emitter.y);
        if(x < 0) emitter.rate = 0;
        emitter.x = x;
        emitter.update();
        
    }
    
    function render() {
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#EDEFEF';
        ctx.shadowBlur = 0.0;
        if(emitter.rate > 0) {
            ctx.fillRect(0, emitter.y, width, height);
            var grad = ctx.createLinearGradient(0, emitter.y - 16, width, emitter.y);
            grad.addColorStop(0, 'rgba(237, 239, 239, 0.0)');
            grad.addColorStop(1, '#EDEFEF');
            ctx.fillStyle = grad;
            ctx.fillCircle(emitter.x, emitter.y + 32, 48);
        } else {
            ctx.fillRect(0, 0, width, height);
        }
        emitter.draw(ctx);
    }
    
    var timer = 0,
        frame = 0;
    function effect() {
        update(frame);
        render();
        frame++;
        if(frame < 200) {
            timer = setTimeout(arguments.callee, 1000 / 30);
        } else {
            start();
        }
    }
    
    canvas.addEventListener('click', function() {
        var l = node.length,
            n = node[l - 1];
        
        frame = 0;
        emitter = new Emitter(n.offsetX, n.offsetY + n.size);
        emitter.y = 400;
        
        clearTimeout(timer);
        timer = 0;
        
        effect();
    }, false);
    
    document.getElementById('name').addEventListener('keyup', function(e) {
        if(name.text !== e.target.value) {
            name = e.target.value;
            ctx.fillStyle = '#EDEFDF';
            ctx.fillRect(0, 0, width, height);
            var n = createName(name),
                m = createMessage('＠がんばらない');
            drawText(n);
            drawText(m);
            
            node = [].concat(n, m);
        }
    }, false);
    
})();