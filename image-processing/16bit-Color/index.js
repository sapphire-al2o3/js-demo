(function() {
    'use strict';
    
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        canvas16 = document.getElementById('canvas16'),
        ctx16 = canvas16.getContext('2d');
    
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
            convertRGBA16();
        };
        img.src = src;
    }
    
    function convertRGBA16() {
        var image = ctx.getImageData(0, 0, canvas.width, canvas.height),
            data = image.data;
        
        for(let i = 0; i < image.height; i++) {
            for(let j = 0; j < image.width; j++) {
                var index = (image.width * i + j) * 4;
                for(let k = 0; k < 4; k++) {
                    data[index + k] = (data[index + k] / 255 * 15 ^ 0) / 15 * 255 ^ 0;
                }
            }
        }
        
        ctx16.putImageData(image, 0, 0);
    }
    
})();