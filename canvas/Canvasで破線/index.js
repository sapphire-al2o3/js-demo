var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

ctx.clearRect(0, 0, canvas.width, canvas.height);
//ctx.lineJoin = 'round';
ctx.lineWidth = 12;
ctx.setLineDash([2, 2]);
ctx.lineDashOffset = 2;
ctx.strokeRect(100 + 0.5, 100 + 0.5, 200, 200);

function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
}

var offset = 2;

setInterval(function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //ctx.strokeRect(100 + 0.5, 100 + 0.5, 200, 200);
    
    for(var i = 0; i < 10; i++) {
        circle(200, 200, i * 20);
        ctx.setLineDash([8, 8]);
        ctx.lineDashOffset = offset * i * 10;
        ctx.strokeStyle = 'hsl(' + i * 30 + ',100%, 50%)';
        ctx.stroke();
    }
    offset += 0.1;
    if(offset > 100) offset = 0;
}, 1000 / 15);
