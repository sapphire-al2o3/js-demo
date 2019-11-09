(function() {
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        width = canvas.width,
        height = canvas.height;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';

    function rand() {
        return Math.random();
    }
    
    var image = new Image();
    image.src = 'cat.jpg';
    image.onload = function() {
        
        ctx.drawImage(image, 0, 0);
        var data = ctx.getImageData(0, 0, width, height),
            gray = new Uint8Array(data.width * data.height);
        
        var sum = 0;
        for(var i = 0; i < data.data.length; i += 4) {
            gray[i / 4] = data.data[i];
            sum += data.data[i];
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var count = 0;
        
        requestAnimationFrame(function() {
            for(var i = 0; i < 100; i++) {
                var x;
                while(1) {
                    x = rand() * gray.length;
                    var y = rand() * 255;
                    if(gray[x | 0] < y) {
                        break;
                    }
                }
                ctx.fillRect(x % width | 0, x / width | 0, 1, 1);
                count++;
            }
            //				count += 100;
            if(count < 200000)
                requestAnimationFrame(arguments.callee);
        });
    };
})();