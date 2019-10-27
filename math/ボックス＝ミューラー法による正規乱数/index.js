// forked from sapphire_al2o3's "Math.randomテスト" http://jsdo.it/sapphire_al2o3/jqZo
var canvas = document.getElementById('world'),
    ctx = canvas.getContext('2d'),
    count = 10000;

function randNormal() {
	var x = Math.random(),
		y = Math.random(),
		r = Math.sqrt(-2.0 * Math.log(x)) / 3.0,
		t = 2.0 * Math.PI * y;
	return {
		z: r * Math.cos(t),
		w: r * Math.sin(t)
	};
}

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
  for(var i = 0; i < 50; i++) {
    var r = randNormal(),
    	x = r.z * 100 + 100,
        y = r.w * 100 + 100;
    ctx.fillRect(x, y, 1, 1);
  }
  requestAnimFrame(arguments.callee);
});
