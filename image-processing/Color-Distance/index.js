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
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return new Color(r, g, b);
}

function draw() {
    ctx.clearRect(0, 0, 400, 400);
    
    let base = randColor();
    
    let colors = [];
    for(let i = 0; i < 15; i++) {
        colors.push(randColor());
    }
    
    function comp(a, b) {
        return colors.cache[a.toString()] - colors.cache[b.toString()];
    }
    
    // SSD
    colors.cache = {};
    colors.forEach(function(e) {
        let dr = e.r - base.r;
        let dg = e.g - base.g;
        let db = e.b - base.b;
        this.cache[e.toString()] = dr * dr + dg * dg + db * db;
    }, colors);
    colors.sort(comp);
    
    ctx.fillStyle = base.toString();
    ctx.fillRoundRect(16, 12, 32, 16, 6);
    ctx.fillStyle = '#000';
    ctx.fillText(base, 54, 24);
    
    for(let i = 0; i < 15; i++) {
        let c = colors[i].toString();
        ctx.fillStyle = c;
        ctx.fillRoundRect(16, 24 * i + 36, 32, 16, 6);
        ctx.fillStyle = '#000';
        ctx.fillText(c, 54, 24 * i + 48);
    }
    
    // SAD
    colors.forEach(function(e) {
        let dr = Math.abs(e.r - base.r);
        let dg = Math.abs(e.g - base.g);
        let db = Math.abs(e.b - base.b);
        this.cache[e.toString()] = dr + dg + db;
    }, colors);
    colors.sort(comp);
    
    for(let i = 0; i < 15; i++) {
        let c = colors[i].toString();
        ctx.fillStyle = c;
        ctx.fillRoundRect(120, 24 * i + 36, 32, 16, 6);
    }
    
    // NCC
    let n = Math.sqrt(base.r * base.r + base.g * base.g + base.b * base.b);
    colors.forEach((e) => {
        let d = e.r * base.r + e.g * base.g + e.b * base.b;
        let en = Math.sqrt(e.r * e.r + e.g + e.g + e.b * e.b);
        colors.cache[e.toString()] = 1.0 - d / (en * n);
    });
    colors.sort(comp);
    
    for(let i = 0; i < 15; i++) {
        const c = colors[i].toString();
        ctx.fillStyle = c;
        ctx.fillRoundRect(180, 24 * i + 36, 32, 16, 6);
    }
    
    // ZNCC
    n = base.r * base.r + base.g * base.g + base.b * base.b;
    let y = (base.r + base.g + base.b) / 3.0;
    let r = base.r - y;
    let g = base.g - y;
    let b = base.b - y;
    n = Math.sqrt(r * r + g * g + b * b);
    colors.forEach(function(e) {
        let ey = (e.r + e.g + e.b) / 3.0;
        let vr = (e.r - ey) * (base.r - y);
        let vg = (e.g - ey) * (base.g - y);
        let vb = (e.b - ey) * (base.b - y);
        let d = vr + vg + vb;
        let dr = e.r - ey;
        let dg = e.g - ey;
        let db = e.b - ey;
        let en = Math.sqrt(dr * dr + dg * dg + db * db);
        colors.cache[e.toString()] = 1.0 - d / (en * n);
    });
    colors.sort(comp);
    for(let i = 0; i < 15; i++) {
        ctx.fillStyle = colors[i].toString();
        ctx.fillRoundRect(240, 24 * i + 36, 32, 16, 6);
    }
    
    // HSV
    const hsv = base.toHSV();
    colors.forEach((e) => {
        let ehsv = e.toHSV();
        let dh = ehsv.h - hsv.h;
        dh = dh > 180.0 ? 360.0 - dh : dh;
        let ds = ehsv.s - hsv.s;
        let dv = ehsv.v - hsv.v;
        colors.cache[e.toString()] = dh * dh + ds * ds + dv * dv;
    });
    colors.sort(comp);
    
    for(let i = 0; i < 15; i++) {
        const c = colors[i].toString();
        ctx.fillStyle = c;
        ctx.fillRoundRect(300, 24 * i + 36, 32, 16, 6);
    }
    
    // YCrCb
    const c0 = base.toYCrCb();
    colors.forEach((e) => {
        const c1 = e.toYCrCb();
        let dy = c1.y - c0.y
        let dcr = c1.cr - c0.cr;
        let dcb = c1.cb - c0.cb;
        colors.cache[e.toString()] = dy * dy + dcr * dcr + dcb * dcb;
    });
    colors.sort(comp);
    for(let i = 0; i < 15; i++) {
        const c = colors[i].toString();
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
