function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

function toHSV(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let c = max - min;
    let h, s, v;
    if(c == 0) {
        h = 0;
        s = 0;
        v = max;
    } else {
        v = max;
        s = c / v;
        if(max == r) {
            h = (g - b) / c;
        } else if(max == g) {
            h = (b - r) / c + 2;
        } else if(max == b) {
            h = (r - g) / c + 4;
        }
        h = 60 * h;
        if(h < 0) h += 360;
    }
    return {'h': h, 's': s, 'v': v};
}


function toYCrCb(r, g, b) {
    y = 0.299 * r + 0.587 * g + 0.114 * b;
    cr = 0.500 * r - 0.419 * g - 0.081 * b;
    cb = -0.169 * r - 0.332 * g + 0.500 * b;
    return {'y': y, 'cr': cr, 'cb': cb};
}

Color.prototype.toString = function() {
  return '#'
    + ('0' + this.r.toString(16)).slice(-2).toUpperCase()
    + ('0' + this.g.toString(16)).slice(-2).toUpperCase()
    + ('0' + this.b.toString(16)).slice(-2).toUpperCase();
};
Color.prototype.toHSV = function() {
    return toHSV(this.r, this.g, this.b);
};
Color.prototype.toYCrCb = function() {
    return toYCrCb(this.r, this.g, this.b);
};

function randColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return new Color(r, g, b);
}

function draw() {
    ctx.clearRect(0, 0, 400, 400);
    
    var base = randColor();
    
    var colors = [];
    for(var i = 0; i < 15; i++) {
        colors.push(randColor());
    }
    
    function comp(a, b) {
        return colors.cache[a.toString()] - colors.cache[b.toString()];
    }
    
    // SSD
    colors.cache = {};
    colors.forEach(function(e) {
        var dr = e.r - base.r;
        var dg = e.g - base.g;
        var db = e.b - base.b;
        this.cache[e.toString()] = dr * dr + dg * dg + db * db;
    }, colors);
    colors.sort(comp);
    
    ctx.fillStyle = base.toString();
    ctx.fillRoundRect(16, 12, 32, 16, 6);
    ctx.fillStyle = '#000';
    ctx.fillText(base, 54, 24);
    
    for(var i = 0; i < 15; i++) {
        var c = colors[i].toString();
        ctx.fillStyle = c;
        ctx.fillRoundRect(16, 24 * i + 36, 32, 16, 6);
        ctx.fillStyle = '#000';
        ctx.fillText(c, 54, 24 * i + 48);
    }
    
    // SAD
    colors.forEach(function(e) {
        var dr = Math.abs(e.r - base.r);
        var dg = Math.abs(e.g - base.g);
        var db = Math.abs(e.b - base.b);
        this.cache[e.toString()] = dr + dg + db;
    }, colors);
    colors.sort(comp);
    
    for(var i = 0; i < 15; i++) {
        var c = colors[i].toString();
        ctx.fillStyle = c;
        ctx.fillRoundRect(120, 24 * i + 36, 32, 16, 6);
    }
    
    // NCC
    var n = Math.sqrt(base.r * base.r + base.g * base.g + base.b * base.b);
    colors.forEach(function(e) {
        var d = e.r * base.r + e.g * base.g + e.b * base.b;
        var en = Math.sqrt(e.r * e.r + e.g + e.g + e.b * e.b);
        colors.cache[e.toString()] = 1.0 - d / (en * n);
    });
    colors.sort(comp);
    
    for(var i = 0; i < 15; i++) {
        var c = colors[i].toString();
        ctx.fillStyle = c;
        ctx.fillRoundRect(180, 24 * i + 36, 32, 16, 6);
    }
    
    // ZNCC
    n = base.r * base.r + base.g * base.g + base.b * base.b;
    var y = (base.r + base.g + base.b) / 3.0;
    var r = base.r - y;
    var g = base.g - y;
    var b = base.b - y;
    n = Math.sqrt(r * r + g * g + b * b);
    colors.forEach(function(e) {
        var ey = (e.r + e.g + e.b) / 3.0;
        var vr = (e.r - ey) * (base.r - y);
        var vg = (e.g - ey) * (base.g - y);
        var vb = (e.b - ey) * (base.b - y);
        var d = vr + vg + vb;
        var dr = e.r - ey;
        var dg = e.g - ey;
        var db = e.b - ey;
        var en = Math.sqrt(dr * dr + dg * dg + db * db);
        colors.cache[e.toString()] = 1.0 - d / (en * n);
    });
    colors.sort(comp);
    for(var i = 0; i < 15; i++) {
        ctx.fillStyle = colors[i].toString();
        ctx.fillRoundRect(240, 24 * i + 36, 32, 16, 6);
    }
    
    // HSV
    var hsv = base.toHSV();
    colors.forEach(function(e) {
        var ehsv = e.toHSV();
        var dh = ehsv.h - hsv.h;
        dh = dh > 180.0 ? 360.0 - dh : dh;
        var ds = ehsv.s - hsv.s;
        var dv = ehsv.v - hsv.v;
        colors.cache[e.toString()] = dh * dh + ds * ds + dv * dv;
    });
    colors.sort(comp);
    
    for(var i = 0; i < 15; i++) {
        var c = colors[i].toString();
        ctx.fillStyle = c;
        ctx.fillRoundRect(300, 24 * i + 36, 32, 16, 6);
    }
    
    // YCrCb
    var c0 = base.toYCrCb();
    colors.forEach(function(e) {
        var c1 = e.toYCrCb();
        var dy = c1.y - c0.y
        var dcr = c1.cr - c0.cr;
        var dcb = c1.cb - c0.cb;
        colors.cache[e.toString()] = dy * dy + dcr * dcr + dcb * dcb;
    });
    colors.sort(comp);
    for(var i = 0; i < 15; i++) {
        var c = colors[i].toString();
        ctx.fillStyle = c;
        ctx.fillRoundRect(360, 24 * i + 36, 32, 16, 6);
        //ctx.fillStyle = '#000';
        //ctx.fillText(colors.cache[c]^0, 340, 24 * i + 48);
    }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.font = '9pt consolas, VL Gothic';
draw();
