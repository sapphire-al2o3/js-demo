
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
    this.px = 0;
    this.py = 0;
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
            var x = this.x + range(-24.0, 24.0),
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
        
        if(n > 2000) throw 'over';
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

var emitter = new Emitter(120, 50, Particle);
emitter.rate = 5;

// 線分と線分の当たり判定
function segToSeg(p0, v0, p1, v1) {
    let c0 = (p1.x - p0.x) * v0.y - (p1.y - p0.y) * v0.x,
        c1 = (p1.x + v1.x - p0.x) * v0.y - (p1.y + v1.y - p0.y) * v0.x,
        c2 = (p0.x - p1.x) * v1.y - (p0.y - p1.y) * v1.x,
        c3 = (p0.x + v0.x - p1.x) * v1.y - (p0.y + v0.y - p1.y) * v1.x;
    return c0 * c1 < 0 && c2 * c3 < 0;
}

function interSeg(p0, v0, p1, v1) {
    let d = v0.x * v1.y - v0.y * v1.x;
    if (d === 0) {
        return -1;
    }

    d = 1 / d;

    return (v1.y * (p1.x - p0.x) - v1.x * (p1.y - p0.y)) * d;
}

function reflect(v, n, r) {
    var d = (v.x * n.x + v.y * n.y) * 2.0;
    r = r || {};
    var s = 1 / (n.x * n.x + n.y * n.y);
    r.x = v.x - d * n.x * s;
    r.y = v.y - d * n.y * s;
    return r;
}

function seg2Normal(v) {
    return { x: v.y, y: -v.x };
}

function seg2Point(p, v, t) {
    return { x: p.x + v.x * t, y: p.y + v.y * t };
}

function length(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

function normalize(v) {
    let n = length(v);
    if(n === 0) return { x: 0, y: 0 };

    n = 1 / n;
    return { x: v.x * n, y: v.y * n };
}

function inRect(p0x, p0y, p1x, p1y, px, py) {
    let minx = Math.min(p0x, p1x),
        miny = Math.min(p0y, p1y),
        maxx = Math.max(p0x, p1x),
        maxy = Math.max(p0y, p1y);
    return px >= minx && maxx >= px && py >= miny && maxy >= py;
}

function hit(p, v, seg, out) {

    let t0 = interSeg(p, v, seg.p, seg.v),
        t1 = interSeg(seg.p, seg.v, p, v);

    if(t0 <= 1.0 && t0 >= 0 && t1 <= 1.0 && t1 >= 0) {
        let o = seg2Point(p, v, t0);

        let n = seg2Normal(seg.v);
        
        let r = reflect(v, n);
        let b = Math.random() * 0.2 + 0.5;
        out.vx = r.x * b;
        out.vy = r.y * b;
        let lx = p.x - o.x,
            ly = p.y - o.y,
            l = Math.sqrt(lx * lx + ly * ly);
        r = normalize(r);
        out.x = o.x + r.x * l;
        out.y = o.y + r.y * l;
        out.px = o.x;
        out.py = o.y;
    
    }
}

let segments = [
    { p: { x:  50, y:  75 }, v: { x: 100, y:  100 } },
    { p: { x: 250, y: 275 }, v: { x: 100, y: -100 } },
    { p: { x:  50, y: 275 }, v: { x: 100, y:  100 } }
];

console.log(interSeg(segments[0].p, segments[0].v,
    { x: 100, y: 100 }, { x: -100, y: 100 }));

canvas.addEventListener('click', function(e) {
    emitter.emit();
});

setInterval(function() {
    emitter.emit();
    emitter.update();
    emitter.particles.forEach(function(e, i) {

        let v = { x: e.x - e.px, y: e.y - e.py },
            p = { x: e.px, y: e.py };

        for(let i = 0; i < segments.length; i++) {
            hit(p, v, segments[i], e);
        }

        if(e.x > width + 10 || e.y > height + 10 || e.x < -10) e.life = 0;
    });
    ctx.clearRect(0, 0, width, height);
    
    emitter.draw(ctx);
    
    ctx.strokeStyle = 'rgb(219, 33, 219)';

    segments.forEach(e => {
        ctx.beginPath();
        ctx.moveTo(e.p.x, e.p.y);
        ctx.lineTo(e.p.x + e.v.x, e.p.y + e.v.y);
        ctx.stroke();
    });
    
}, 1000 / 30);
