var canvas = document.getElementById('world'),
    ctx = canvas.getContext('2d'),
    width = canvas.width,
    height = canvas.height;

function cross(a, b) {
	return a.x * b.y - a.y * b.x;
}
	
function dot(a, b) {
	return a.x * b.x + a.y * b.y;
}

function mul(a, s) {
	a.x *= s;
	a.y *= s;
}

function sub(a, b) {
	return { x: a.x - b.x, y: a.y - b.y };
}

function normalize(v) {
	var n = Math.sqrt(v.x * v.x + v.y * v.y);
	if(n === 0.0) throw '0 length';
	v.x /= n;
	v.y /= n;
	return v;
}

// 線分の法線を求める
function normal(a, b) {
	var d = sub(a, b);
	return normalize({ x: -d.y, y: d.x });
}

// 反射ベクトルを求める
function reflect(v, n) {
	var d = dot(v, n) * 2.0;
	return {
		x: v.x - d * n.x,
		y: v.y - d * n.y
	};
}

// 線分
var segments = [];
segments.push({ p0: { x: 150, y:   0 }, p1: { x:   0, y: 150 }});
segments.push({ p0: { x: 250, y:   0 }, p1: { x: 400, y: 150 }});

// 直線
var line = {};
line.p = { x: 200, y: 400 };
line.d = { x:   0, y:  -1 };

for(var i = 0, l = segments.length; i < l; i++) {
	var seg = segments[i];
	seg.n = normal(seg.p1, seg.p0);
}

var render = function() {
	var x = line.p.x + line.d.x * 1000,
		y = line.p.y + line.d.y * 1000;
    
	ctx.clearRect(0, 0, width, height);
	
	for(var i = 0; i < segments.length; i++) {
		var seg = segments[i];
		
		ctx.strokeStyle = seg.hit ? '#F00' : '#000';
		ctx.beginPath();
		ctx.moveTo(seg.p0.x, seg.p0.y);
		ctx.lineTo(seg.p1.x, seg.p1.y);
		ctx.stroke();
		
		if(seg.hit) {
			ctx.fillStyle = '#F00';
			ctx.beginPath();
			ctx.arc(seg.point.x, seg.point.y, 3.0, 0, Math.PI * 2.0, false);
			ctx.fill();
            
			x = seg.point.x;
			y = seg.point.y;
			ctx.strokeStyle = '#FA0';
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(seg.point.x + seg.reflection.x * 1000, seg.point.y + seg.reflection.y * 1000);
			ctx.stroke();
		}
	}
    
	ctx.strokeStyle = '#0A0';
	ctx.beginPath();
	ctx.moveTo(line.p.x, line.p.y);
	ctx.lineTo(x, y);
	ctx.stroke();
};

function intersection(line, seg) {
	var dx = seg.p1.x - seg.p0.x,
		dy = seg.p1.y - seg.p0.y;
	var det = line.d.x * dy - line.d.y * dx;
	var s = 1 / det * (-line.d.y * (line.p.x - seg.p0.x) + line.d.x * (line.p.y - seg.p0.y));
	console.log(s, dy);
	return {
		x: s * dx + seg.p0.x,
		y: s * dy + seg.p0.y
	};
}

var update = function() {
	for(var i = 0; i < segments.length; i++) {
		var seg = segments[i];
	
		var c0 = cross(line.d, sub(seg.p0, line.p)),
			c1 = cross(line.d, sub(seg.p1, line.p));
		if(c0 * c1 < 0) {
			seg.hit = true;
		} else {
			seg.hit = false;
		}
		
		if(seg.hit) {
			var point = intersection(line, seg);
			seg.point = point;
            seg.reflection = reflect(line.d, seg.n);
		}
	}
};

update();
render();

canvas.addEventListener('click', function(e) {
	line.d.x = e.offsetX - line.p.x;
    line.d.y = e.offsetY - line.p.y;
	update();
	render();
}, false);