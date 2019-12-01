(function() {
    'use strict';

    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        width = canvas.width,
        height = canvas.height,
        centerX = width / 2,
        centerY = height / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    function draw0(image, r, g, b, a) {
        var data = image.data,
            w = image.width,
            h = image.height;
        
        for(var k = 0, l = data.length; k < l; k += 4) {
            data[k + 0] = r;
            data[k + 1] = g;
            data[k + 2] = b;
            data[k + 3] = a;
        }
    }

    function draw1(image, abgr) {
        var data = new Uint32Array(image.data.buffer),
            w = image.width,
            h = image.height;
        
        for(var i = 0, l = data.length; i < l; i++) {
            data[i] = abgr;
        }
    }
    
    function draw2(image, r, g, b, a) {
        var data = new Uint8Array(image.data.buffer),
            w = image.width,
            h = image.height;
        
        for(var k = 0, l = data.length; k < l; k += 4) {
            data[k + 0] = r;
            data[k + 1] = g;
            data[k + 2] = b;
            data[k + 3] = a;
        }
    }
    
    var timeA = 0;
    document.getElementById('a').addEventListener('click', function() {
        var image = ctx.createImageData(width, height);
        var r = Math.random() * 256 | 0;
        console.time('a');
        draw0(image, r, 255, 0, 255);
        console.timeEnd('a');
        ctx.putImageData(image, 0, 0);
    });
    
    document.getElementById('b').addEventListener('click', function() {
        var image = ctx.createImageData(width, height);
        var r = Math.random() * 256 | 0;
        console.time('b');
        draw1(image, 0xFF00FF00 | r);
        console.timeEnd('b');
        ctx.putImageData(image, 0, 0);
    });
    
    document.getElementById('c').addEventListener('click', function() {
        var image = ctx.createImageData(width, height);
        var r = Math.random() * 256 | 0;
        console.time('c');
        draw2(image, r, 255, 0, 255);
        console.timeEnd('c');
        ctx.putImageData(image, 0, 0);
    });

})();