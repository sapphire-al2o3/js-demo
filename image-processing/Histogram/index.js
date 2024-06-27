(function() {
    'use strict';
    
    let canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        histCanvas = document.getElementById('histogram'),
        histCtx = histCanvas.getContext('2d');
    
    canvas.addEventListener('drop', (e) => {
        let file = e.dataTransfer.files[0],
            reader = new FileReader();
        reader.onload = function(e) {
            load(reader.result);
        };
        reader.readAsDataURL(file);
        e.preventDefault();
    });
    
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    
    load('coast.jpg');
    
    function load(src) {
        let img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            histogram();
        };
        img.src = src;
    }
    
    function histogram() {
        let image = ctx.getImageData(0, 0, canvas.width, canvas.height),
            data = image.data,
            hist = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)];
        
        for (let i = 0; i < image.height; i++) {
            for (let j = 0; j < image.width; j++) {
                let k = (image.width * i + j) * 4;
                hist[0][data[k]]++;
                hist[1][data[k + 1]]++;
                hist[2][data[k + 2]]++;
            }
        }
        
        
        let max = [0, 0, 0];
        for (let i = 0; i < hist[0].length; i++) {
            for (let j = 0; j < 3; j++) {
                if (hist[j][i] > max[j]) max[j] = hist[j][i];
            }
        }
        
        let color = ['#FF0000', '#00FF00', '#0000FF'];
        
        histCtx.clearRect(0, 0, histCanvas.width, histCanvas.height);
        histCtx.globalAlpha = 0.5;
        
        for (let j = 0; j < 3; j++) {
            histCtx.fillStyle = color[j];
            for(let i = 0; i < hist[j].length; i++) {
                hist[j][i] = hist[j][i] * 256 / max[j];
                histCtx.fillRect(i, histCanvas.height, 1, -hist[j][i]);
            }
        }
        
        histCanvas.style.display = 'inline';
    }
    
})();