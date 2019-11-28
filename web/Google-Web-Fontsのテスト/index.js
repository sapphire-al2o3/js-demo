var ctx = document.getElementById('world').getContext('2d');
ctx.font = '32pt Jura';
ctx.fillText('Google Web Fonts', 0, 32);
ctx.strokeText('Google Web Fonts', 0, 64);

var grad = ctx.createLinearGradient(0, 0, 400, 0);
grad.addColorStop(0, '#F00');
grad.addColorStop(0.5, '#FF0');
grad.addColorStop(1.0, '#0F0');

ctx.fillStyle = grad;
ctx.fillText('Google Web Fonts', 0, 96);