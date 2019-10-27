var TO_RAD = Math.PI / 180,
    TO_DEG = 180 / Math.PI,
    EPS = 5.96e-08;

function $(e) {
    return document.getElementById(e);
}

function Matrix3() {
    this.data = new Array(9);
}

Matrix3.rotateXYZ = function(x, y, z) {
    var m = new Matrix3(),
	a = m.data,
	cx = Math.cos(x),
	sx = Math.sin(x),
	cy = Math.cos(y),
	sy = Math.sin(y),
	cz = Math.cos(z),
	sz = Math.sin(z);
    
    a[0] = cy * cz;
    a[1] = sx * sy * cz - cx * sz;
    a[2] = sx * sz + cx * sy * cz;
    
    a[3] = cy * sz;
    a[4] = sx * sy * sz + cx * cz;
    a[5] = cx * sy * sz - sx * cz;
    
    a[6] = -sy;
    a[7] = sx * cy;
    a[8] = cx * cy;
    
    return m;
};

Matrix3.prototype.getRotateXYZ = function(c) {
    var a = this.data,
	r = {};
    if(a[6] === -1) {
	r.y = Math.PI / 2;
	throw 'hogehoge';
    } else if(a[8] === 1) {
	r.y = -Math.PI / 2;
	throw 'hogehoge';
    } else {
	r.x = Math.atan2(a[7], a[8]);
	r.y = Math.asin(-a[6]);
	r.z = Math.atan2(a[3], a[0]);
    }
    return r;
};
var inx = $('in-x'),
    iny = $('in-y'),
    inz = $('in-z'),
    outx = $('out-x'),
    outy = $('out-y'),
    outz = $('out-z');
inx.onchange = iny.onchange = inz.onchange = function() {
    calc(inx.value * TO_RAD, iny.value * TO_RAD, inz.value * TO_RAD);
};

function calc(x, y, z) {
    var r = Matrix3.rotateXYZ(x, y, z);
    for(var i = 0; i < 3; i++) {
	for(var j = 0; j < 3; j++) {
	    $('m' + i + j + '').value = r.data[i * 3 + j].toFixed(3);
	}
    }
    var ir = r.getRotateXYZ();
    outx.textContent = (ir.x * TO_DEG).toFixed(3);
    outy.textContent = (ir.y * TO_DEG).toFixed(3);
    outz.textContent = (ir.z * TO_DEG).toFixed(3);
}
