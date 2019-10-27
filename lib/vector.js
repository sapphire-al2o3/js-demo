// 2次元ベクトル
function Vector2(x, y) {
  if(!(this instanceof Vector2)) {
    return new Vector2(x, y);
  }
  this.x = x;
  this.y = y;
}

// 3次元ベクトル
function Vector3(x, y, z) {
  if(!(this instanceof Vector3)) {
    return new Vector3(x, y, z);
  }
  this.x = x;
  this.y = y;
  this.z = z;
}

// 角度の変換
function degToRad(a) {
  return a * Math.PI / 180.0;
}
function radToDeg(a) {
  return a * 180.0 / Math.PI;
}

Vector2.prototype = {
  add: function(v) {
    return new Vector2(this.x + v.x, this.y + v.y);
  },
  sub: function(v) {
    return new Vector2(this.x - v.x, this.y - v.y);
  },
  mul: function(s) {
    return new Vector2(this.x * s, this.y * s);
  },
  div: function(s) {
    return new Vector2(this.x / s, this.y / s);
  },
  dot: function(v) {
    return this.x * v.x + this.y * v.y;
  },
  length: function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },
  squaredLength: function() {
    return this.x * this.x + this.y * this.y;
  },
  normalize: function() {
    var n = this.length();
    if(n !== 0) n = 1.0 / n;
    return this.mul(n);
  },
  distance: function(v) {
    return this.sub(v).length();
  },
  squaredDistance: function(v) {
    return this.sub(v).squaredLength();
  },
  reflect: function(v) {
    var n = this.dot(v.normalize());
    return this.sub(v.mul(2 * n));
  },
  orthogonal: function() {
    return new Vector2(this.y, -this.x);
  },
    cross: function(v) {
	return this.x * v.y - this.y * v.x;
    },
  equal: function(v) {
    return this.x == v.x && this.y == y;
  },
  clone: function(v) {
    return new Vector2(this.x, this.y);
  },
  toString: function() {
    return '' + this.x + ',' + this.y;
  }
};

Vector2.zero = new Vector2(0, 0);
//Vector2.unitX = new Vector2(1, 0);
//Vector2.unitY = new Vector2(0, 1);

Vector3.prototype = {
  add: function(v) {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  },
  sub: function(v) {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  },
  mul: function(s) {
    return new Vector3(this.x * s, this.y * s, this.z * s);
  },
  div: function(s) {
    return new Vector3(this.x / s, this.y / s, this.z / s);
  },
  abs: function(s) {
    return new Vector3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
  },
  dot: function(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  },
  cross: function(v) {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  },
  length: function() {
    return Math.sqrt(this.dot(this));
  },
  cos: function(v) {
    var n = this.dot(v);
    return n / (this.length() * v.length());
  },
  normalize: function() {
    var n = this.length();
  if(n > 0) {
    n = 1.0 / n;
  }
    return this.mul(n);
  },
    rotate: function(r, a) {
        var v0 = this.mul(Math.cos(a)),
			v1 = r.cross(this.mul(Math.sin(a))),
			v2 = r.mul(r.dot(this)).mul(1 - Math.cos(a));
		return v0.add(v1).add(v2);
	},
  toString: function() {
    return '' + this.x + ',' + this.y + ',' + this.z;
  }
};

Vector3.up = new Vector3(0, 1, 0);

function Matrix4() {
  this.data = new Float32Array(16);
}

//  0  1  2  3
//  4  5  6  7
//  8  9 10 11
// 12 13 14 15
Matrix4.prototype = {
  apply: function(v) {
    var a = this.data,
      w = a[12] * v.x + a[13] * v.y + a[14] * v.z + a[15];
    if(w !== 0) {
      return new Vector3(
        (a[0] * v.x + a[1] * v.y + a[2] * v.z + a[3]) / w,
        (a[4] * v.x + a[5] * v.y + a[6] * v.z + a[7]) / w,
        (a[8] * v.x + a[9] * v.y + a[10] * v.z + a[11]) / w
      );
    } else {
      return new Vector3(0, 0, 0);
    }
  },
  mul: function(m) {
    var a = this.data,
      b = m.data,
      r = new Matrix4(),
      c = r.data,
      m00 = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12],
      m01 = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13],
      m02 = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14],
      m03 = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15],
      m10 = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12],
      m11 = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13],
      m12 = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14],
      m13 = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15],
      m20 = a[8] * b[0] + a[9] * b[4] + a[2] * b[8] + a[11] * b[12],
      m21 = a[8] * b[1] + a[9] * b[5] + a[2] * b[9] + a[11] * b[13],
      m22 = a[8] * b[2] + a[9] * b[6] + a[2] * b[10] + a[11] * b[14],
      m23 = a[8] * b[3] + a[9] * b[7] + a[2] * b[11] + a[11] * b[15],
      m30 = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12],
      m31 = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13],
      m32 = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14],
      m33 = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15];
    c[0] = m00;
    c[1] = m01;
    c[2] = m02;
    c[3] = m03;
    c[4] = m10;
    c[5] = m11;
    c[6] = m12;
    c[7] = m13;
    c[8] = m20;
    c[9] = m21;
    c[10] = m22;
    c[11] = m23;
    c[12] = m30;
    c[13] = m31;
    c[14] = m32;
    c[15] = m33;
    return r;
  },
  toString: function() {
    var a = this.data,
      str = '';
    for(var i = 0; i < 4; i++) {
      var l = [];
      for(var j = 0; j < 4; j++) {
        l.push(a[i * 4 + j]);
      }
      str += l.join(',') + '\n';
    }
    return str;
  }
};

Matrix4.identity = function() {
  var m = new Matrix4(),
    a = m.data;
  a[0] = a[5] = a[10] = a[15] = 1.0;
  a[1] = a[2] = a[3] = a[4] = a[6] = a[7] = a[8] = a[9] = a[11] = a[12] = a[13] = a[14];
  return m;
};

Matrix4.scale = function(x, y, z) {
  var m = new Matrix4(),
    a = m.data;
  a[0] = x;
  a[5] = y;
  a[10] = z;
  a[15] = 1.0;
  a[1] = a[2] = a[3] = a[4] = a[6] = a[7] = a[8] = a[9] = a[11] = a[12] = a[13] = a[14];
};

Matrix4.perspective = function(fovy, aspect, near, far) {
  var f = Math.cos(fovy * 0.5) / Math.sin(fovy * 0.5),
    m = new Matrix4(),
    a = m.data;
  a[0] = f / aspect;
  a[1] = 0;
  a[2] = 0;
  a[3] = 0;
  
  a[4] = 0;
  a[5] = f;
  a[6] = 0;
  a[7] = 0;
  
  a[8] = 0;
  a[9] = 0;
  a[10] = (near + far) / (near - far);
  a[11] = 2.0 * near * far / (near - far);
  
  a[12] = 0;
  a[13] = 0;
  a[14] = -1.0;
  a[15] = 0;
  return m;
};

Matrix4.lookAt = function(p, t, u) {
  var z = p.sub(t).normalize(),
    x = u.cross(z).normalize(),
    y = z.cross(x),
    m = new Matrix4(),
    a = m.data;
  a[0] = x.x;
  a[1] = x.y;
  a[2] = x.z;
  a[3] = -p.x * x.x - p.y * x.y - p.z * x.z;
  a[4] = y.x;
  a[5] = y.y;
  a[6] = y.z;
  a[7] = -p.x * y.x - p.y * y.y - p.z * y.z;
  a[8] = z.x;
  a[9] = z.y;
  a[10] = z.z;
  a[11] = -p.x * z.x - p.y * z.y - p.z * z.z;
  a[12] = 0.0;
  a[13] = 0.0;
  a[14] = 0.0;
  a[15] = 1.0;
  return m;
};

Matrix4.viewport = function(w, h, n, f) {
  var x = 0,
    y = 0,
    m = new Matrix4(),
    a = m.data;
  
  a[0] = w / 2;
  a[1] = 0;
  a[2] = 0;
  a[3] = (x + w) / 2;
  
  a[4] = 0;
  a[5] = -h / 2;
  a[6] = 0;
  a[7] = (y + h) / 2;
  
  a[8] = 0;
  a[9] = 0;
  a[10] = (f - n) / 2;
  a[11] = (n + f) / 2;
  
  a[12] = 0;
  a[13] = 0;
  a[14] = 0;
  a[15] = 1;
  return m;
};

