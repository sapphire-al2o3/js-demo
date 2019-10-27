var ctx = document.getElementById('world').getContext('2d');

ctx.lineWidth = 20.0;
ctx.lineCap = 'round';

ctx.beginPath();
ctx.moveTo(100, 40);
ctx.lineTo(100, 240);

ctx.lineTo(150, 360);

ctx.stroke();

ctx.beginPath();
ctx.moveTo(160, 40);
ctx.lineTo(160, 240);
ctx.closePath();
ctx.stroke();

