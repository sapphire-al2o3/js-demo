CanvasRenderingContext2D.prototype.fillCircle = function(x, y, r) {
    this.beginPath();
    this.arc(x, y, r, 0.0, Math.PI * 2.0, false);
    this.fill();
};
CanvasRenderingContext2D.prototype.strokeCircle = function(x, y, r) {
    this.beginPath();
    this.arc(x, y, r, 0.0, Math.PI * 2.0, false);
    this.stroke();
};
CanvasRenderingContext2D.prototype.strokeLine = function(x0, y0, x1, y1) {
    this.beginPath();
    this.moveTo(x0, y0);
    this.lineTo(x1, y1);
    this.stroke();
};

function rgba(r, g, b, a) {
    return 'rgba(' + [r, g, b, a].join(',') + ')';
}

function hsva(h, s, v, a) {
    let f=h/60,i=f^0,m=v-v*s,k=v*s*(f-i),p=v-k,q=k+m,c=255;
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

function distance(a, b) {
    var dx = b.x - a.x,
        dy = b.y - a.y;
    return dx * dx + dy * dy;
}

var Color = function(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
};
Color.prototype = {
    toString: function() {
        return '#'
            + ('0' + this.r.toString(16)).slice(-2).toUpperCase()
            + ('0' + this.g.toString(16)).slice(-2).toUpperCase()
            + ('0' + this.b.toString(16)).slice(-2).toUpperCase();
    }
};

let Hsv = function(h, s, v, a) {
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

(function() {
    let canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        width = canvas.width,
        height = canvas.height,
        node = [],
        path = [],
        down = false,
        p = {x: 0, y: 0},
        p0 = {x: 100, y: 100},
        p1 = {x: 150, y: 100},
        p2 = {x: 200, y: 200},
        p3 = {x: 250, y: 250},
        shapes = [p0, p1, p2, p3],
        x = 4.0,
        k = 0.9,
        active = null;
    
    for(let i = 0; i < 40; i++) {
        shapes.push({x: i * 10, y: i * 10});
    }
    
    function update(frame) {
        p0.hit = distance(p, p0) < 6 * 6;
        if(down) {
            if(p0.hit) {
                active = p0;
            }
            if(active) {
                active.x = p.x;
                active.y = p.y;
            }
        }
        
        for(let i = 1; i < shapes.length; i++) {
            let dx = shapes[i].x - shapes[i - 1].x,
                dy = shapes[i].y - shapes[i - 1].y,
                l = Math.sqrt(dx * dx + dy * dy),
                d = l - x,
                f = d * k;
            
            shapes[i].x -= dx / l * f;
            shapes[i].y -= dy / l * f;
        }
    }
    
    function render() {
        ctx.clearRect(0, 0, 400, 400);
        
        let hit = false;
        
        shapes.forEach(e => {
            const r = 8;
            
            if(e === p0) {
                ctx.lineWidth = 2.0;
                ctx.strokeStyle = e === p0 ? '#094' : '#ADD';
                ctx.strokeCircle(e.x, e.y, r);
            }
            if(e.hit) {
                hit = true;
            }
        });

        canvas.style['cursor'] = p0.hit || active ? 'pointer' : 'default';
        
        for(let i = 1; i < shapes.length; i++) {
            let e = shapes[i],
                s = shapes[i - 1];
            ctx.lineWidth = 1.0;
            ctx.strokeStyle = 'rgba(200, 100, 0, 1)';
            ctx.strokeLine(s.x, s.y, e.x, e.y);
        }
    }
    
    setInterval(() => {
        update();
        render();
    }, 1000 / 30);
    
    canvas.addEventListener('click', () => {
        if(path.length > 0) {
            startEffect();
        }
    }, false);
    
    canvas.addEventListener('mousedown', (e) => {
        const rect = e.target.getBoundingClientRect();
        p.x = e.clientX - rect.left;
        p.y = e.clientY - rect.top;
        down = true;
    }, false);
    
        
        
    canvas.addEventListener('mousemove', (e) => {
        const rect = e.target.getBoundingClientRect();
        p.x = e.clientX - rect.left;
        p.y = e.clientY - rect.top;
        e.stopPropagation();
    }, false);
        
    canvas.addEventListener('mouseup', (e) => {
        down = false;
        active = false;
    }, false);
        
    canvas.addEventListener('mouseout', (e) => {
        down = false;
        active = false;
    }, false);
    
    document.body.appendChild(createSlider('k', k, v => {
        k = v;
    }));
})();