(function() {
    'use strict';
    
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        channelCanvas = [document.getElementById('r'), document.getElementById('g'), document.getElementById('b'), document.getElementById('a')],
        channelCtx = channelCanvas.map(function(e) { return e.getContext('2d'); });
    
    canvas.addEventListener('drop', function(e) {
        var file = e.dataTransfer.files[0],
            reader = new FileReader();
        reader.onload = function(e) {
            load(reader.result);
        };
        reader.readAsDataURL(file);
        e.preventDefault();
    });
    
    canvas.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    load('tanuki.png');
    
    function load(src) {
        var img = new Image();
        img.onload = function(e) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            splitChannel();
        };
        img.src = src;
    }
    
    function splitChannel() {
        var image = ctx.getImageData(0, 0, canvas.width, canvas.height),
            data = image.data,
            channel = [],
            channelData = [];
        
        for(var k = 0; k < 4; k++) {
            channelCanvas[k].width = canvas.width;
            channelCanvas[k].height = canvas.height;
            channel[k] = ctx.createImageData(canvas.width, canvas.height);
            channelData[k] = channel[k].data;
        }
        
        for(var i = 0; i < image.height; i++) {
            for(var j = 0; j < image.width; j++) {
                var index = (image.width * i + j) * 4;
                for(k = 0; k < 4; k++) {
                    channelData[k][index] = channelData[k][index + 1] = channelData[k][index + 2] = data[index + k];
                    channelData[k][index + 3] = 255;
                }
            }
        }
        
        for(k = 0; k < 4; k++) {
            channelCtx[k].putImageData(channel[k], 0, 0);
            channelCanvas[k].style.display = 'inline';
        }
    }
    
})();