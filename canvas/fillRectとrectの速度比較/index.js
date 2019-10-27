var canvas0 = document.getElementById('canvas0'),
    canvas1 = document.getElementById('canvas1'),
    ctx0 = canvas0.getContext('2d'),
    ctx1 = canvas1.getContext('2d'),
    ret0 = document.getElementById('result0'),
    ret1 = document.getElementById('result1');

var time = Date.now();
console.time('fillRect');
	
for(var i = 0; i < 80; i++) {
    for(var j = 0; j < 80; j++) {
	ctx0.fillStyle = rgb(i * 255 / 80, j * 255 / 80, 0);
	ctx0.fillRect(j * 5, i * 5, 5, 5);
    }
}

console.timeEnd('fillRect');
time = Date.now() - time;
ret0.innerHTML = 'fillRect:' + time;

time = Date.now();
console.time('rect');

for(i = 0; i < 80; i++) {
	for(j = 0; j < 80; j++) {
		ctx1.fillStyle = rgb(j * 255 / 80, i * 255 / 80, 0);
		ctx1.beginPath();
		ctx1.rect(j * 5, i * 5, 5, 5);
		ctx1.fill();
	}
}

console.timeEnd('rect');
time = Date.now() - time;
ret1.innerHTML = 'rect:' + time;

function rgb(r, g, b) {
	return '#' + ('0' + (r^0).toString(16)).slice(-2) + ('0' + (g^0).toString(16)).slice(-2) + ('0' + (b^0).toString(16)).slice(-2);
}