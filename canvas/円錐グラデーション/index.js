(function() {

var canvas = document.getElementById('world');
var ctx = canvas.getContext('2d');
var time = 0;
var rgba = function(r, g, b, a) { return 'rgba(' + (r^0) + ',' + g + ',' + b + ',' + a + ')'; };

setTimeout(function() {
    ctx.clearRect(0, 0, 400, 400);
    var d = 200;
    for(var i = 0; i < d; i++) {
        var r0 = time / 20 + Math.PI * i * 2 / d;
        var r1 = time / 20 + Math.PI * (i + 1) * 2 / d;
        var x0 = Math.cos(r0) * 200 + 200,
            y0 = Math.sin(r0) * 200 + 200,
            x1 = Math.cos(r1) * 200 + 200,
            y1 = Math.sin(r1) * 200 + 200;
        var grad3 = ctx.createLinearGradient(x0, y0, x1, y1);
        grad3.addColorStop(0, rgba(255 * i / d, 0, 0, 1));
        grad3.addColorStop(1, rgba(255 * (i + 1) / d, 0, 0, 1));
        ctx.fillStyle = grad3;
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, r0-0.01, r1+0.01, false);
        ctx.fill();
    }
    time += 1.0;
}, 1000/30);

})();