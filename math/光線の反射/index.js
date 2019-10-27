CanvasRenderingContext2D.prototype.strokeLine = function(x0, y0, x1, y1) {
	this.beginPath();
	this.moveTo(x0, y0);
	this.lineTo(x1, y1);
	this.stroke();
};

function hsva(h, s, v, a) {
	var f=h/60,i=f^0,m=v-v*s,k=v*s*(f-i),p=v-k,q=k+m;
	return 'rgba('+[[v,p,m,m,q,v][i]*255^0,[q,v,v,p,m,m][i]*255^0,[m,m,q,v,v,p][i]*255^0,a].join(',')+')';
}

function rgba(r, g, b, a) {
    return 'rgba(' + [r, g, b, a].join(',') + ')';
}

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

function normal(a, b) {
	var d = sub(a, b);
	return normalize({ x: -d.y, y: d.x });
}
	
function reflect(v, n, r) {
	var d = dot(v, n) * 2.0;
	r = r || {};
	r.x = v.x - d * n.x;
	r.y = v.y - d * n.y;
	return r;
}
	
function sqrDistance(a, b) {
	return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
}

var canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d'),
	width = canvas.width,
	height = canvas.height;

var segments = [];
segments.push({ p0: { x:  10, y:  10 }, p1: { x: 300, y: 100 }});
segments.push({ p0: { x:  50, y: 200 }, p1: { x: 180, y: 240 }});
segments.push({ p0: { x: 350, y: 150 }, p1: { x: 320, y: 300 }});
segments.push({ p0: { x: 150, y: 150 }, p1: { x:  50, y: 200 }});
segments.push({ p0: { x:   5, y:  20 }, p1: { x:  20, y: 150 }});

var line = {};
line.p = { x: 200, y: 400 };
line.d = { x:   0, y:  -1 };

var collisionChains = [];
	
for(var i = 0, l = segments.length; i < l; i++) {
	var seg = segments[i];
	seg.n = normal(seg.p1, seg.p0);
}

// 描画
var render = function() {
	var px = line.p.x,
		py = line.p.y,
		x = line.p.x + line.d.x * 1000,
		y = line.p.y + line.d.y * 1000;
	//ctx.fillStyle = '#000';
    //ctx.fillRect(0, 0, width, height);
	ctx.clearRect(0, 0, width, height);
	
	// draw segment
    ctx.lineWidth = 1.0;
	for(var i = 0; i < segments.length; i++) {
		var seg = segments[i];
		ctx.strokeStyle = seg.hit ? '#F00' : '#000';
		ctx.strokeLine(seg.p0.x, seg.p0.y, seg.p1.x, seg.p1.y);
	}
	
	// draw lay
	var hue = 0;
	ctx.strokeStyle = '#0D0';
	var point = line.p;
	for(i = 0; i < collisionChains.length; i++) {
		var col = collisionChains[i];
		
		ctx.fillStyle = '#F00';
		ctx.beginPath();
		ctx.arc(col.x, col.y, 3.0, 0, Math.PI * 2.0, false);
		ctx.fill();
		
		//ctx.strokeStyle = rgba(0, 220, 0, 0.4);
        ctx.strokeStyle = hsva(hue, 0.8, 1.0, 1.0);
		ctx.strokeLine(point.x, point.y, col.x, col.y);
		point = col;
		x = point.x + col.dx * 1000;
		y = point.y + col.dy * 1000;
		hue += 30;
		hue = hue % 360;
	}
	ctx.strokeLine(point.x, point.y, x, y);
};

// line to segment
function intersection(line, seg) {
	var dx = seg.p1.x - seg.p0.x,
		dy = seg.p1.y - seg.p0.y,
		det = line.d.x * dy - line.d.y * dx,
		t = 1 / det * (dx * (line.p.y - seg.p0.y) - dy * (line.p.x - seg.p0.x)),
		s = 1 / det * (-line.d.y * (line.p.x - seg.p0.x) + line.d.x * (line.p.y - seg.p0.y));
	return {
		x: s * dx + seg.p0.x,
		y: s * dy + seg.p0.y,
		s: s,
		t: t
	};
}

function collision(line, seg) {
	var d0x = seg.p0.x - line.p.x,
		d0y = seg.p0.y - line.p.y,
		d1x = seg.p1.x - line.p.x,
		d1y = seg.p1.y - line.p.y,
		d0 = line.d.x * d0x + line.d.y * d0y,
		d1 = line.d.x * d1x + line.d.y * d1y,
		c = d0x * d1y - d0y * d1x,
		c0 = line.d.x * d0y - line.d.y * d0x,
		c1 = line.d.x * d1y - line.d.y * d1x;
	return c0 * c1 < 0;
}
	
// 一番近い交点を求める
var nearestIntersection = function(segments, line, index) {
	var min = 1000000,
		minSeg = -1,
		minPoint = null;
	for(var i = 0; i < segments.length; i++) {
		if(index === i) continue;
		var seg = segments[i];
		if(collision(line, seg)) {
			var point = intersection(line, seg);
			
			if(point.t >= 0) {
				seg.point = point;
				seg.distance = sqrDistance(point, line.p);
				
				if(min > seg.distance && point.s >= 0) {
					min = seg.distance;
					minSeg = i;
				}
			}
		}
	}
	
	if(minSeg >= 0) {
		segments[minSeg].hit = true;
	}
	
	return minSeg;
};

var update = function() {
	console.time('update');
	var l = {
		p: {
			x: line.p.x,
			y: line.p.y
		},
		d: {
			x: line.d.x,
			y: line.d.y
		}
	};
	
	for(var i = 0, n = segments.length; i < n; i++) {
		segments[i].hit = false;
	}
	collisionChains.length = 0;
	var index = -1,
		count = 0;
	for(i = 0; i < 128; i++) {
		index = nearestIntersection(segments, l, index);
		if(index >= 0) {
			var seg = segments[index];
			seg.reflection = reflect(l.d, seg.n);
			collisionChains.push({
				x: seg.point.x,
				y: seg.point.y,
				dx: seg.reflection.x,
				dy: seg.reflection.y
			});
			l.p = seg.point;
			l.d = seg.reflection;
			count++;
		} else {
			break;
		}
	}
	console.log(count);
	console.timeEnd('update');
};

update();
render();

canvas.addEventListener('click', function(e) {
	line.d = { x: e.offsetX - line.p.x, y: e.offsetY - line.p.y };
	update();
	render();
}, false);


document.getElementById('btn5').addEventListener('click', function(e) {
    var TO_RAD = Math.PI / 180.0,
        c = 200.0 * Math.cos(TO_RAD * 144.0),
        s = 200.0 * Math.sin(TO_RAD * 144.0),
        h = 200.0 * Math.cos(TO_RAD * 72.0),
        w = 200.0 * Math.sin(TO_RAD * 72.0);
    segments.length = 0;
    segments.push({ p0: { x: 200, y: 400 }, p1: { x: 200 + w, y: 200 + h }});
    segments.push({ p0: { x: 200, y: 400 }, p1: { x: 200 - w, y: 200 + h }});
    segments.push({ p0: { x: 200 + w, y: 200 + h }, p1: { x: 200 + s, y: 200 + c }});
    segments.push({ p0: { x: 200 - w, y: 200 + h }, p1: { x: 200 - s, y: 200 + c }});
    segments.push({ p0: { x: 200 + s, y: 200 + c }, p1: { x: 200 - s, y: 200 + c }});
    
    for(var i = 0, l = segments.length; i < l; i++) {
        var seg = segments[i];
        seg.n = normal(seg.p1, seg.p0);
    }
    
    update();
    render();

}, false);
