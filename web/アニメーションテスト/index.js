// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  

// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

var canvas, context, frame = 0, timer, stop = false;

init();
animate0();

function init() {
    canvas = document.getElementById('world');
    canvas.width = 256;
    canvas.height = 256;

    context = canvas.getContext('2d');
}

function startAnim(i) {
  clearInterval(timer);
  clearTimeout(timer);
  timer = 0;
  stop = true;
  //[animate0, animate1, animate2][i]();
  switch(i) {
  case 0:
    stop = false;
    animate0();
    break;
  case 1:
    animate1();
    break;
  case 2:
    animate2();
    break;
  default:
    break;
  }
}

function animate0() {
  if(!stop) {
    timer = requestAnimFrame(animate0);
    draw();
  }
}

function animate1() {
  timer = setTimeout(animate1, 1000 / 60);
  draw();  
}

function animate2() {
  timer = setInterval(draw, 1000 / 60);
}

function draw() {

    var time = frame * 0.05;
    var x = Math.sin( time ) * 96 + 128;
    var y = Math.cos( time * 0.9 ) * 96 + 128;

    context.fillStyle = 'rgb(245,245,245)';
    context.fillRect( 0, 0, 255, 255 );

    context.fillStyle = 'rgb(255,0,0)';
    context.beginPath();
    context.arc( x, y, 10, 0, Math.PI * 2, true );
    context.closePath();
    context.fill();
  frame++;
}
