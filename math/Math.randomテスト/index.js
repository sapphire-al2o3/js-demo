var canvas = document.getElementById('world'),
    ctx = canvas.getContext('2d'),
    count = 10000;

ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';

window.requestAnimFrame = (function(){
  return window.requestAnimationFrame  ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(callback, element){
      window.setTimeout(callback, 1000 / 60);
    };
})();

requestAnimFrame(function() {
  for(var i = 0; i < 10; i++) {
    var x = Math.random() * 200,
        y = Math.random() * 200;
    ctx.fillRect(x, y, 1, 1);
  }
  requestAnimFrame(arguments.callee);
});
