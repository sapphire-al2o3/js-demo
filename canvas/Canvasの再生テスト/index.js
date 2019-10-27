var canvas = document.getElementById('world'),
    ctx = canvas.getContext('2d'),
    down = false,
    x = 0,
    y = 0,
    record = [],
    rec = false;

ctx.lineJoin = 'round';
ctx.lineCap = "round";
ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
ctx.save();

document.getElementById('rec').addEventListener('click', function(e) {
    rec = !rec;
    this.textContent = rec ? 'STOP' : 'REC';
    if(rec) {
	record = [];
	ctx.clearRect(0, 0, 400, 400);
	ctx.restore();
    }
}, false);

document.getElementById('play').addEventListener('click', function(e) {
    if(record.length > 0) {
	rec = false;
	document.getElementById('rec').textContent = 'REC';
	play();
    }
}, false);

canvas.addEventListener('mousedown', function(e) {
    down = true;
    x = e.pageX;
    y = e.pageY;
    rec && record.push({act: 'begin', x: x, y: y});
}, false);

canvas.addEventListener('mousemove', function(e) {
    if(down) {
	ctx.beginPath();
	ctx.moveTo(x, y);
	x = e.pageX;
	y = e.pageY;
	ctx.lineTo(x, y);
	ctx.stroke();
	ctx.closePath();
	rec && record.push({act: 'lineTo', x: x, y: y});
    }
}, false);

canvas.addEventListener('mouseup', function(e) {
    down = false;
}, false);

var colors = document.querySelectorAll('#colors li');
for(var i = 0; i < colors.length; i++) {
    colors[i].addEventListener('click', function() {
        var color = this.style.backgroundColor;
	ctx.strokeStyle = color;
	rec && record.push({act: 'strokeStyle', color: color});
    }, false);
}

var pen = 1.0;
document.getElementById('pen').addEventListener('click', function(e) {
    pen += 1.0;
    ctx.lineWidth = pen;
    setPenWidth(pen);
    rec && record.push({act: 'lineWidth', width: ctx.lineWidth});
}, false);

var penWidth = document.querySelector('#pen span');

function setPenWidth(p) {
    var s = penWidth.style;
    s.width = p + 'px';
    s.height = p + 'px';
    s.borderRadius = p * 0.5 + 'px';
    console.log(penWidth);
}

var stop = false,
    timer = 0;

function play() {
    var i = 0,
	l = record.length;
    ctx.clearRect(0, 0, 400, 400);
    ctx.restore();
    timer = setTimeout(function() {
	if(!stop && i < l) {
	    var c = record[i++];
	    command(c);
	    timer = setTimeout(arguments.callee, 1000 / 30);
	}
    }, 1000 / 30);
}

function command(c) {
    //console.log(c);
    switch(c.act) {
    case 'begin':
	x = c.x;
	y = c.y;
	break;
    case 'lineTo':
	ctx.beginPath();
	ctx.moveTo(x, y);
	x = c.x;
	y = c.y;
	ctx.lineTo(c.x, c.y);
	ctx.stroke();
	break;
    case 'strokeStyle':
	ctx.strokeStyle = c.color;
	break;
    case 'lineWidth':
	ctx.lineWidth = c.width;
	break;
    default:
	break;
    }
}