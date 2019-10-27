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

// 線分
var segments = [];
segments.push({ p0: { x:  10, y:  10 }, p1: { x: 100, y: 100 }});
segments.push({ p0: { x: 100, y: 200 }, p1: { x: 150, y: 200 }});
segments.push({ p0: { x: 350, y: 150 }, p1: { x: 350, y: 300 }});
segments.push({ p0: { x: 250, y:  90 }, p1: { x:  50, y: 100 }});
segments.push({ p0: { x:  10, y: 100 }, p1: { x:  50, y: 300 }});

var line = {};
line.p = { x: 200, y: 400 };
line.d = { x:   0, y:  -1 };

var render = function() {
	ctx.clearRect(0, 0, width, height);
	
	ctx.strokeStyle = '#0A0';
	ctx.beginPath();
	ctx.moveTo(line.p.x, line.p.y);
	ctx.lineTo(line.p.x + line.d.x * 1000, line.p.y + line.d.y * 1000);
	ctx.stroke();
	
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
		}
	}
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