// #FFFと#FFFFFF形式の文字列をパースする
function parseColor(str) {
    var l = str.length,
        r = 0,
        g = 0,
        b = 0;
    if(l === 7) {
        r = parseInt(str.slice(1, 3), 16);
        g = parseInt(str.slice(3, 5), 16);
        b = parseInt(str.slice(5, 7), 16);
    } else if(l === 4) {
        var rr = str.slice(1, 2),
            gg = str.slice(2, 3),
            bb = str.slice(3, 4);
        r = parseInt(rr + rr, 16);
        g = parseInt(gg + gg, 16);
        b = parseInt(bb + bb, 16);
    }
    
    if(isNaN(r) || isNaN(g) || isNaN(b)) {
        r = g = b = 0;
    }
    
    return new Color(r, g, b);
}

function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

function rgba(r, g, b, a) {
    return 'rgba(' + [r^0, g^0, b^0, a].join(',') + ')';
}

function toHSV(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    var max = Math.max(r, g, b),
        c = max - Math.min(r, g, b),
        h = 0,
        s = 0,
        v = max;
    
    if(c != 0) {
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

var RGB = {};
// JPEG conversion
RGB.toYCrCb = function(r, g, b) {
    //		var y = 0.29891 * r + 0.58661 * g + 0.11448 * b,
    //			cr = 0.50000 * r - 0.41869 * g - 0.08131 * b,
    //			cb = -0.16874 * r - 0.33126 * g + 0.50000 * b;
    var y = 0.299 * r + 0.587 * g + 0.114 * b,
        cr = 0.5 * r - 0.4187 * g - 0.0813 * b + 128,
            cb = -0.1687 * r - 0.3313 * g + 0.5 * b + 128;
    return {'y': y, 'cr': cr, 'cb': cb};
};
RGB.toGrayscale = function(r, g, b) {
    //		return 0.298912 * r + 0.586611 * g + 0.114478 * b;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    //		var s = 2.2;
    //		r = Math.pow(r, s) * 0.222015;
    //		g = Math.pow(g, s) * 0.706655;
    //		b = Math.pow(b, s) * 0.071330;
    //		console.log(r);
    //		var y = Math.pow(r + g + b, 1.0 / s);
    //		y = y < 0 ? 0 : y > 255 ? 255 : y;
    return y;
};
var YCrCb = {};
YCrCb.toRGB = function(y, cr, cb) {
    var r = y + 1.402 * (cr - 128),
        g = y - 0.34414 * (cb - 128) - 0.71414 * (cr - 128),
            b = y + 1.772 * (cb - 128);
    if(r < 0) r = 0; else if(r > 255) r = 255;
    if(g < 0) g = 0; else if(g > 255) g = 255;
    if(b < 0) b = 0; else if(b > 255) b = 255;
    return {r: r, g: g, b: b};
};

function hsva(h,s,v,a){var f=h/60,i=f^0,m=v-v*s,k=v*s*(f-i),p=v-k,q=k+m;return 'rgba('+[[v,p,m,m,q,v][i]*255^0,[q,v,v,p,m,m][i]*255^0,[m,m,q,v,v,p][i]*255^0,a].join(',')+')'}


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

function lerp(a, b, t) {
    return a * (1.0 - t) + b * t;
}

document.getElementById('color-a').addEventListener('keyup', function() {
    console.time('color-a');
    a = parseColor(this.value);
    console.log(a);
    colorInterpolation(a, b);
    console.timeEnd('color-a');
}, false);

document.getElementById('color-b').addEventListener('keyup', function() {
    b = parseColor(this.value);
    colorInterpolation(a, b);
}, false);


var a = new Color(255, 0, 255),
    b = new Color(0, 255, 0);

function colorInterpolation(a, b) {
    var c = new Color(0, 0, 0),
        cell = document.querySelectorAll('#rgb-lerp>li');
    
    for(var i = 0; i < cell.length; i++) {
        var t = i / (cell.length - 1);
        c.r = lerp(a.r, b.r, t);
        c.g = lerp(a.g, b.g, t);
        c.b = lerp(a.b, b.b, t);
        cell[i].style['background-color'] = rgba(c.r, c.g, c.b, 1.0);
    }
    
    var hsvA = toHSV(a.r, a.g, a.b),
        hsvB = toHSV(b.r, b.g, b.b);
    
    if(hsvA.h > hsvB.h) {
        hsvB.h += 360;
    }
    
    cell = document.querySelectorAll('#hsv-lerp>li');
    
    for(var i = 0; i < cell.length; i++) {
        var t = i / (cell.length - 1),
            hsv = {};
        hsv.h = lerp(hsvA.h, hsvB.h, t) % 360;
        hsv.s = lerp(hsvA.s, hsvB.s, t);
        hsv.v = lerp(hsvA.v, hsvB.v, t);
        cell[i].style['background-color'] = hsva(hsv.h, hsv.s, hsv.v, 1.0);
    }
    
    
    var ycrcbA = RGB.toYCrCb(a.r, a.g, a.b),
        ycrcbB = RGB.toYCrCb(b.r, b.g, b.b);
    
    cell = document.querySelectorAll('#ycrcb-lerp>li');
    
    for(var i = 0; i < cell.length; i++) {
        t = i / (cell.length - 1);
        var ycrcb = {},
            rgb;
        ycrcb.y = lerp(ycrcbA.y, ycrcbB.y, t);
        ycrcb.cr = lerp(ycrcbA.cr, ycrcbB.cr, t);
        ycrcb.cb = lerp(ycrcbA.cb, ycrcbB.cb, t);
        rgb = YCrCb.toRGB(ycrcb.y, ycrcb.cr, ycrcb.cb);
        var y = RGB.toGrayscale(rgb.r, rgb.g, rgb.b) ^ 0;
        cell[i].style['background-color'] = rgba(rgb.r, rgb.g, rgb.b, 1.0);
        //		cell[i].style['background-color'] = rgba(y, y, y, 1.0);
    }
    
    function dot(a, b) {
        return a.r * b.r + a.g + b.g + a.b * b.b;
    }
    
    function slerp(a, b, t) {
        var d = dot(a, b),
            an = Math.sqrt(dot(a, a)),
            bn = Math.sqrt(dot(b, b)),
            c = d / (an * bn),
                o = Math.acos(c),
                    s = Math.sin(o),
                        k0 = o === 0 ? (1 - t) : Math.sin((1 - t) * o) / s,
                            k1 = o === 0 ? t : Math.sin(t * o) / s;
        return {
            r: k0 * a.r + k1 * b.r,
            g: k0 * a.g + k1 * b.g,
            b: k0 * a.b + k1 * b.b
        };
    }
    
    cell = document.querySelectorAll('#rgb-slerp>li');
    
    for(var i = 0; i < cell.length; i++) {
        var t = i / (cell.length - 1);
        c = slerp(a, b, t);
        cell[i].style['background-color'] = rgba(c.r, c.g, c.b, 1.0);
    }
    
    cell = document.querySelectorAll('#ycrcb-slerp>li');
    
    for(i = 0; i < cell.length; i++) {
        t = i / (cell.length - 1);
        aa = {};
        bb = {};
        ycrcb = {};
        aa.r = ycrcbA.y;
        aa.g = ycrcbA.cr;
        aa.b = ycrcbA.cb;
        bb.r = ycrcbB.y;
        bb.g = ycrcbB.cr;
        bb.b = ycrcbB.cb;
        ycrcb = slerp(aa, bb, t);
        ycrcb.y = ycrcb.r;
        ycrcb.cr = ycrcb.g;
        ycrcb.cb = ycrcb.b;
        c = YCrCb.toRGB(ycrcb.y, ycrcb.cr, ycrcb.cb);
        cell[i].style['background-color'] = rgba(c.r, c.g, c.b, 1.0);
    }
}

colorInterpolation(a, b);
