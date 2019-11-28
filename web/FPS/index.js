var requestAnimationFrame = (function(w) {
    return w.mozRequestAnimationFrame || 
    w.webkitRequestAnimationFrame || 
    w.oRequestAnimationFrame ||
    w.msRequestAnimationFrame ||
    function(callback){
        w.setTimeout(callback, 16);
    };
    })(window);
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

var start = Date.now(),
    startTime = window.webkitAnimationStartTime,
    first = false;
console.log(startTime, start);
requestAnimationFrame(function(t) {
    var time = Date.now();
    ctx.clearRect(0, 0, 300, 300);
    ctx.fillText(1000.0 / (time - start), 0, 16);
    ctx.fillText(t, 0, 32);
    start = time;
    if(!first) {
	first = true;
	console.log(t, Date.now());
    }
    requestAnimationFrame(arguments.callee);
});