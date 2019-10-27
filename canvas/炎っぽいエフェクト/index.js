(function() {

function Xor128() {
    if(arguments.length > 0) {
    	var a = [],
            s = arguments[0];
        for(var i = 1; i <= 4; i++) {
            a[i - 1] = s = 1812433253 * (s ^ (s >> 30)) + i;
        }
        this.x = a[0];
        this.y = a[1];
        this.z = a[2];
        this.w = a[3];
    } else {
        this.x = 1812433254;
        this.y = 3713160357;
        this.z = 3109174145;
        this.w = 64984499;
    }
}

Xor128.prototype.random = function() {
    var t = this.x ^ (this.x << 11);
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    this.w = this.w ^ (this.x >> 19) ^ (t ^ (t >> 8));
    return this.w / 0xFFFFFFFF + 0.5;
};

var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    width = canvas.width,
    height = canvas.height,
    tex = document.getElementById('tex'),
    tex2 = document.getElementById('tex2'),
    tex3 = document.getElementById('tex3'),
    particles = [],
    cx = width / 2,
    cy = height / 2;

var emitter = {
    // 放出量
    emitmax: 4,
    emitmin: 2,
    // 放出間隔
    interval: 0,
    // 座標
    xmax: cx + 2,
    xmin: cx - 2,
    ymax: cy + 2,
    ymin: cy - 2,
    // 範囲
    r: 8
};

var particleProp = {
    // 大きさ
    sizexmax: 1.0,
    sizexmin: 1.0,
    sizeymax: 1.0,
    sizeymin: 1.0,
    // 寿命
    lifemax: 40,
    lifemin: 20,
    // 速度
    vxmin: -0.8,
    vxmax: 0.8,
    vymin: -3.0,
    vymax: -2.2,
    // α減衰
    amin: 0.01,
    amax: 0.01,
    // 回転
    //rmax: 0.1,
    //rmin: 0.1,
    // スケール
    smax: -0.4,
    smin: -0.1,
    // ブレンド
    blend: 'lighter'
};

ctx.fillRect(0, 0, width, height);
ctx.globalCompositeOperation = 'lighter';

var frame = 0,
    rg = new Xor128(123456),
    play = true;

function Particle(x, y, emitterProp, particleProp) {
    this.x = x;
    this.y = y;
    this.vx = rangep(particleProp, 'vx');
    this.vy = rangep(particleProp, 'vy');
    this.s = range(particleProp.smin, particleProp.smax);
    this.life = rangep(particleProp, 'life');
    this.a = 1.0;
    this.sw = tex.height;
    this.sh = tex.width;
    var sizex = rangep(particleProp, 'sizex'),
        sizey = rangep(particleProp, 'sizey');
    this.dw = this.sw * sizex;
    this.dh = this.sh * sizey;
    this.t = tex;
    this.blend = particleProp.blend;
}

for(var i = 0; i < 100; i++) {
    var x = range(emitter.xmin, emitter.xmax),
        y = range(emitter.ymin, emitter.ymax);
    //particles.push(new Particle(x, y, emitter, particleProp));
}

Particle.prototype.draw = function() {
    ctx.globalAlpha = this.a;
    ctx.globalCompositeOperation = this.blend;
    ctx.drawImage(this.t, 0, 0, this.sw, this.sh, this.x - this.dw / 2, this.y - this.dh / 2, this.dw, this.dh);
};

function clamp(x) {
    return x > 1 ? 1 : x < 0 ? 0 : x;
}

function range(min, max) {
    var d = max - min;
    return min + d * rg.random();
}

function rangep(p, v) {
    var d = p[v + 'max'] - p[v + 'min'];
    return p[v + 'min'] + d * rg.random();
}

Particle.prototype.update = function(t) {
    this.x += this.vx;
    this.y += this.vy;
    this.a = clamp(this.life / 60);
    this.dw += this.s;
    this.dh += this.s;
    if(this.dw < 1) this.dw = 1;
    if(this.dh < 1) this.dh = 1;
	this.life -= t;
};

function emit(e) {
    var n = rangep(emitter, 'emit');
    for(var i = 0; i < n; i++) {
        var x = range(emitter.xmin, emitter.xmax),
            y = range(emitter.ymin, emitter.ymax);
        particles.push(new Particle(x, y, emitter, particleProp));
    }
}

var render = function() {
    ctx.clearRect(0, 0, width, height);
    for(var i = particles.length; i--;) {
        p = particles[i];
        p.update(1);
        p.draw();
        
        if(p.life < 0) {
            var x = range(emitter.xmin, emitter.xmax),
                y = range(emitter.ymin, emitter.ymax);
            particles[i] = particles.pop();// = new Particle(x, y, emitter, particleProp);
        }
    }

    if(emitter.interval < frame) {
        emit(emitter);
        frame = 0;
    }
    frame++;
    if(play) {
        setTimeout(arguments.callee, 33);
    }
};

function createPropertyTable(id, property) {
    var t = document.getElementById(id);
    for(var e in property) {
        if(/min$/.test(e)) {
            if(e.replace(/min$/, 'max') in property) {
                continue;
            }
        }
        var row = t.insertRow(t.rows.length),
            th = document.createElement("th");
        th.innerHTML = '<label>' + e.replace(/max$/, '') + '</label>';
        row.appendChild(th);
        var max = document.createElement('input'),
            name = e;
        max.type = 'text';
        max.value = property[e];
        max.onchange = (function(n) {
            return function(e) {
                if(typeof property[n] == 'number') {
                    property[n] = parseFloat(this.value);
                } else {
                    property[n] = this.value;
                }
            };
        })(e);
        row.insertCell(1).appendChild(max);
        if(/max$/.test(e) && e.replace(/max$/, 'min') in property) {
            var m = e.replace(/max$/, 'min'),
                min = document.createElement('input');
            min.type = 'text';
            min.value = property[m];
            min.onchange = (function(m) {
                return function(e) {
                    property[m] = parseFloat(this.value);
                };
            })(m);
            row.insertCell(2).appendChild(min);
        }
    }
}

document.getElementById('play').onclick = function(e) {
    if(!play) {
        play = true;
        setTimeout(render, 33);
    }
};
document.getElementById('stop').onclick = function(e) {
    play = false;
};
document.getElementById('step').onclick = function(e) {
    play = false;
    setTimeout(render, 33);
};
createPropertyTable('emitter', emitter);
createPropertyTable('particle', particleProp);
render();

})();
