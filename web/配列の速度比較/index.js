var count = 1600000;

if(window.Array) {
    var start = Date.now();
    testArray(new Array(count), count);
    $('#array').text(Date.now() - start);
} else {
    $('#array').text('×');
}

if(window.ImageData || CanvasRenderingContext2D.prototype.createImageData) {
    var ctx = $('<canvas>').get(0).getContext('2d'),
	image;
    image = ctx.createImageData(count / 4, 1);
    start = Date.now();
    testArray(image.data, count);
    $('#image-array').text(Date.now() - start);
} else {
    $('#image-array').text('×');
}

if(window.ArrayBuffer) {
    start = Date.now();
    testArray(new ArrayBuffer(count), count);
    $('#array-buffer').text(Date.now() - start);
} else {
    $('#array-buffer').text('×');
}

if(window.Int8Array) {
    start = Date.now();
    testArray(new Int8Array(count), count);
    $('#int8array').text(Date.now() - start);
} else {
    $('#int8array').text('×');
}

if(window.Uint8Array) {
    start = Date.now();
    testArray(new Uint8Array(count), count);
    $('#uint8array').text(Date.now() - start);
} else {
    $('#uint8array').text('×');
}

if(window.Uint8ClampedArray) {
    start = Date.now();
    testArray(new Uint8ClampedArray(count), count);
    $('#uint8clampedarray').text(Date.now() - start);
} else {
    $('#uint8clampedarray').text('×');
}

if(window.Int16Array) {
    start = Date.now();
    testArray(new Int16Array(count), count);
    $('#int16array').text(Date.now() - start);
} else {
    $('#int16array').text('×');
}

if(window.Uint16Array) {
    start = Date.now();
    testArray(new Uint16Array(count), count);
    $('#uint16array').text(Date.now() - start);
} else {
    $('#uint16array').text('×');
}
if(window.Int32Array) {
    start = Date.now();
    testArray(new Int32Array(count), count);
    $('#int32array').text(Date.now() - start);
} else {
    $('#int32array').text('×');
}

setTimeout(function() {
if(window.Float32Array) {
    start = Date.now();
    testArray(new Float32Array(count), count);
    $('#float32array').text(Date.now() - start);
} else {
    $('#float32array').text('×');
}}, 1000);

function testArray(data, n) {
    for(var i = 0; i < n; i++) {
    	data[i] = i & 0xFF;
    }
}