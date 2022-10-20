(function() {
    'use strict';
    
    let canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        canvas16 = document.getElementById('canvas16'),
        ctx16 = canvas16.getContext('2d');
    
    canvas.addEventListener('drop', e => {
        let file = e.dataTransfer.files[0],
            reader = new FileReader();
        reader.onload = function(e) {
            load(reader.result);
        };
        reader.readAsDataURL(file);
        e.preventDefault();
    });
    
    canvas.addEventListener('dragover', e => {
        e.preventDefault();
    });
    
    load('autumn.png');
    
    function load(src) {
        let img = new Image();
        img.onload = e => {
            canvas.width = img.width;
            canvas.height = img.height;
            canvas16.width = canvas.width;
            canvas16.height = canvas.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            convertCMYK();
        };
        img.src = src;
    }
    
    function convertCMYK() {
        let image = ctx.getImageData(0, 0, canvas.width, canvas.height),
            data = image.data;
        
        for(let i = 0; i < image.height; i++) {
            for(let j = 0; j < image.width; j++) {
                let index = (image.width * i + j) * 4;
                let r = data[index];
                let g = data[index + 1];
                let b = data[index + 2];
                let c = 255 - r;
                let m = 255 - g;
                let y = 255 - b;
                let k = Math.min(c, m, y);
                c = c - k;
                m = m - k;
                y = y - k;

                c = c * 0.9;
                m = m * 0.8;
                y = y * 0.7;

                r = 255 - c - k;
                g = 255 - m - k;
                b = 255 - y - k;

                data[index] = r;
                data[index + 1] = g;
                data[index + 2] = b;
            }
        }
        
        ctx16.putImageData(image, 0, 0);
    }
    
})();