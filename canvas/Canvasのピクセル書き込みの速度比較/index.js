(function() {
    'use strict';

    let canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        width = canvas.width,
        height = canvas.height,
        centerX = width / 2,
        centerY = height / 2;
    
    const timeLabel = document.getElementById('time');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    function printTime(time) {
        timeLabel.textContent = `${time.toFixed(2)} ms`;
    }

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
    document.getElementById('a').addEventListener('click', () => {
        var image = ctx.createImageData(width, height);
        var r = Math.random() * 256 | 0;
        console.time('a');
        let start = performance.now();
        draw0(image, r, 255, 0, 255);
        let span = performance.now() - start;
        console.timeEnd('a');
        printTime(span);
        ctx.putImageData(image, 0, 0);
        printTime(span);
    });
    
    document.getElementById('b').addEventListener('click', () => {
        var image = ctx.createImageData(width, height);
        var r = Math.random() * 256 | 0;
        console.time('b');
        let start = performance.now();
        draw1(image, 0xFF00FF00 | r);
        let span = performance.now() - start;
        console.timeEnd('b');
        printTime(span);
        ctx.putImageData(image, 0, 0);
    });
    
    document.getElementById('c').addEventListener('click', () => {
        var image = ctx.createImageData(width, height);
        var r = Math.random() * 256 | 0;
        console.time('c');
        let start = performance.now();
        draw2(image, r, 255, 0, 255);
        let span = performance.now() - start;
        console.timeEnd('c');
        printTime(span);
        ctx.putImageData(image, 0, 0);
    });

})();