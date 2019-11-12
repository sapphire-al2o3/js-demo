

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

var Particle = function(x, y) {
    this.x = x;
    this.y = y;
    this.vx = range(-1.0, 1.0);
    this.vy = range(-3.0, -0.0);
    this.a = 0.5;
    this.r = range(1.0, 3.0);
    this.life = 300;
    this.color = rgba(0, 100, 255, 0.5);
};

var G = 9.8;

Particle.prototype = {
    update: function(t) {
        this.px = this.x;
        this.py = this.y;
        this.x += this.vx;
        this.y += this.vy;
        this.vy += G / 30;
        this.a = 0.5;
        //this.r = max(this.r - 0.02, 0);
        this.life--;
    },
    draw: function(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2.0, false);
        ctx.fill();
    }
};

var Emitter = function(x, y, Particle) {
    this.Particle = Particle;
    this.particles = [];
    this.rate = 1;
    this.time = 0.0;
    this.x = x;
    this.y = y;
    this.vy = 0;
};

Emitter.prototype = {
    emit: function() {
        var ps = this.particles;
        for(var i = 0; i < this.rate; i++) {
            var x = this.x + range(-42.0, 42.0),
                y = this.y + range(-8.0, 8.0),
                    p = new this.Particle(x, y);
            ps.push(p);
        }
    },
    removePaticle: function(i) {
        var ps = this.particles;
        ps[i] = ps[ps.length - 1];
        ps.pop();
    },
    update: function(t) {
        var ps = this.particles,
            n = ps.length;
        
        this.y += this.vy;
        
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

var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    width = canvas.width,
    height = canvas.height;


ctx.lineWidth = 12.0;
ctx.lineCap = "round";
ctx.strokeStyle = '#365dff';

function distance(a, b) {
    var dx = b.x - a.x,
        dy = b.y - a.y;
    return dx * dx + dy * dy;
}

var counter = document.getElementById('counter');

var emitter = new Emitter(200, 100, Particle);
emitter.rate = 5;

//				var worker = new Worker('worker.js');
//				worker.postMessage(emitter);

// 2次方程式の解の公式
function solve2(a, b, c) {
    if(a === 0) {
        return b === 0 ? [] : [-c / b];
    }
    
    var d = b * b - 4 * a * c;
    if(d < 0) return [];
    
    var ia = 0.5 / a;
    
    if(d === 0) {
        return [-b * ia];
    }
    
    var sd = Math.sqrt(d);
    return [(-b + sd) * ia, (-b - sd) * ia];
}

function reflect(v, n, r) {
    var d = (v.x * n.x + v.y * n.y) * 2.0;
    r = r || {};
    var s = 1 / (n.x * n.x + n.y * n.y);
    r.x = v.x - d * n.x * s;
    r.y = v.y - d * n.y * s;
    return r;
}

function Bezier2(p0, p1, p2) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.a = p0.x - 2 * p1.x + p2.x;
    this.b = 2 * (p1.x - p0.x);
    this.c = p0.x;
    this.d = p0.y - 2 * p1.y + p2.y;
    this.e = 2 * (p1.y - p0.y);
    this.f = p0.y;
}

function bezier2(p0, p1, p2, t) {
    if(t !== undefined) {
        return {
            x: (1 - t) * (1 - t) * p0.x + 2 * t * (1 - t) * p1.x + t * t * p2.x,
            y: (1 - t) * (1 - t) * p0.y + 2 * t * (1 - t) * p1.y + t * t * p2.y
        };
    } else {
        return {
            a: p0.x - 2 * p1.x + p2.x,
            b: 2 * (p1.x - p0.x),
            c: p0.x
        };
    }
}

function bezier2Normal(p0, p1, p2, t) {
    var x = 2 * (p2.x - 2 * p1.x + p0.x) * t + 2 * (p1.x - p0.x),
        y = 2 * (p2.y - 2 * p1.y + p0.y) * t + 2 * (p1.y - p0.y);
    return { x: y, y: -x };
}

// 二次ベジェ曲線と半直線の当たり判定
function rayToBezier2(p0, p1, p2, v, p) {
    var a = p0.x - 2 * p1.x + p2.x,
        b = 2 * (p1.x - p0.x),
        c = p0.x,
        d = p0.y - 2 * p1.y + p2.y,
        e = 2 * (p1.y - p0.y),
        f = p0.y;
    
    var t = solve2(
        a * v.y - v.x * d,
        b * v.y - v.x * e,
        v.y * c - v.y * p.x - v.x * f + v.x * p.y
    );
    
    var t0 = t[0];
    return t0;
}

function length(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

function normalize(v) {
    var n = length(v);
    if(n === 0) return { x: 0, y: 0 };
    
    n = 1 / n;
    return { x: v.x * n, y: v.y * n };
}

function inRect(p0x, p0y, p1x, p1y, px, py) {
    var minx = Math.min(p0x, p1x),
        miny = Math.min(p0y, p1y),
        maxx = Math.max(p0x, p1x),
        maxy = Math.max(p0y, p1y);
    return px >= minx && maxx >= px && py >= miny && maxy >= py;
}

function hit(p, p0, p1, p2) {
    var v = { x: p.x - p.px, y: p.y - p.py };
    var t = rayToBezier2(p0, p1, p2, v, { x: p.px, y: p.py });
    
    if(t <= 1.0 && t >= 0) {
        var o = bezier2(p0, p1, p2, t);
        
        if(inRect(p.x, p.y, p.px, p.py, o.x, o.y)) {
        
            var n = bezier2Normal(p0, p1, p2, t);
            var r = reflect(v, n);
            var b = Math.random() * 0.2 + 0.4;
            p.vx = r.x * b;
            p.vy = r.y * b;
            var lx = p.px - o.x,
                ly = p.py - o.y;
            var l = Math.sqrt(lx * lx + ly * ly);
            r = normalize(r);
            p.x = o.x + r.x * l;
            p.y = o.y + r.y * l;
            p.px = o.x;
            p.py = o.y;
        }
    }
    return t;
}



var p0 = { x: 100, y: 300 },
    p1 = { x: 200, y: 200 },
    p2 = { x: 300, y: 300 };

var seg = { x: 200, y: 200, vx: -50, vy: 200 };

var t = hit(seg, p0, p1, p2);


var p = bezier2(p0, p1, p2, t),
    n = bezier2Normal(p0, p1, p2, t);

canvas.addEventListener('click', function(e) {
    emitter.emit();
});

setInterval(function() {
    emitter.emit();
    emitter.update();
    emitter.particles.forEach(function(e, i) {
        //if(e.y > width) e.vy *= -1;
        hit(e, p0, p1, p2);
        
        if(e.x > 400 || e.y > 400 || e.x < 0) e.life = 0;
    });
    ctx.clearRect(0, 0, width, height);
    //ctx.fillStyle = rgba(0, 0, 0, 0.2);
    //ctx.fillRect(0, 0, width, height);
    
    emitter.draw(ctx);
    
    ctx.strokeStyle = 'rgb(219, 33, 219)';
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
    ctx.stroke();
    
}, 1000 / 30);
