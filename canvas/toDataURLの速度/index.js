(function() {
    'use strict';
    
    var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    function fillRandom() {
        var image = ctx.createImageData(canvas.width, canvas.height),
            data = image.data;
        
        for(var i = 0, n = data.length; i < n; i++) {
            data[i] = Math.random() * 256;
        }
        
        ctx.putImageData(image, 0, 0);
    }
    
    function fill() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    var types = ['image/png', 'image/jpeg'];
    
    function test(s, f, t, q) {
        return function() {
            canvas.width = canvas.height = s;
            f();
            var t = Date.now();
            canvas.toDataURL(types[t], q);
            return Date.now() - t;
        };
    }
    
    var tests = [
        test(256, fill, 0),
        test(512, fill, 0),
        test(1024, fill, 0),
        
        test(256, fillRandom, 0),
        test(512, fillRandom, 0),
        test(1024, fillRandom, 0),
        
        test(250, fill, 0),
        test(500, fill, 0),
        test(1000, fill, 0),
        
        test(256, fill, 1, 1.0),
        test(512, fill, 1, 1.0),
        test(1024, fill, 1, 1.0),
        
        test(256, fill, 1, 0.5),
        test(512, fill, 1, 0.5),
        test(1024, fill, 1, 0.5)
    ];
    
    var i = 0;
    
    function start() {
        var result = tests[i]();
        document.getElementById('r' + i).textContent = result;
        i++;
        if(i < tests.length) {
            setTimeout(start, 1000 / 30)
        }
    }
    
    document.getElementById('test').addEventListener('click', function() {
        i = 0;
        start()
    });
    
})();
