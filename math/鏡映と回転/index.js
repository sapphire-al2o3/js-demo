var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

ctx.font = 'bold 280pt Meiryo';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('あ', 200, 200);

var image = ctx.getImageData(0, 0, canvas.width, canvas.height);

document.getElementById('r90').addEventListener('click', function(e) {
    rotate90R(image);
    ctx.putImageData(image, 0, 0);
}, false);

document.getElementById('rx').addEventListener('click', function(e) {
    flipX(image);
    ctx.putImageData(image, 0, 0);
}, false);

document.getElementById('ry').addEventListener('click', function(e) {
    flipY(image);
    ctx.putImageData(image, 0, 0);
}, false);


document.getElementById('ryx').addEventListener('click', function(e) {
    flipXY(image);
    ctx.putImageData(image, 0, 0);
}, false);

function rotate90R(image) {
    let data = image.data,
        w = image.width,
        h = image.height;
    
	for(let i = 1; i < h; i++) {
        let y = i * w;
        for(let j = i; j < w; j++) {
            let s = (y + j) * 4,
                t = (j * w + i) * 4;
                r = data[s],
                g = data[s + 1],
                b = data[s + 2],
                a = data[s + 3];
            data[s] = data[t];
            data[s + 1] = data[t + 1];
            data[s + 2] = data[t + 2];
            data[s + 3] = data[t + 3];
            data[t] = r;
            data[t + 1] = g;
            data[t + 2] = b;
            data[t + 3] = a;
        }
    }
    
    for(let i = 0; i < h; i++) {
        let y = i * w;
        let x = y + w - 1;
        for(let j = 0; j < w / 2; j++) {
            let s = (y + j) * 4,
                t = (x - j) * 4,
                r = data[s],
                g = data[s + 1],
                b = data[s + 2],
                a = data[s + 3];
            data[s] = data[t];
            data[s + 1] = data[t + 1];
            data[s + 2] = data[t + 2];
            data[s + 3] = data[t + 3];
            data[t] = r;
            data[t + 1] = g;
            data[t + 2] = b;
            data[t + 3] = a;
        }
    }
}

function flipX(image) {
    var data = image.data,
        w = image.width,
        h = image.height;
    
    for(let i = 0; i < h; i++) {
        let y = i * w;
        let x = y + w - 1;
        for(let j = 0; j < w / 2; j++) {
            let s = (y + j) * 4,
                t = (x - j) * 4,
                r = data[s],
                g = data[s + 1],
                b = data[s + 2],
                a = data[s + 3];
            data[s] = data[t];
            data[s + 1] = data[t + 1];
            data[s + 2] = data[t + 2];
            data[s + 3] = data[t + 3];
            data[t] = r;
            data[t + 1] = g;
            data[t + 2] = b;
            data[t + 3] = a;
        }
    }
}

function flipY(image) {
    let data = image.data,
        w = image.width,
        h = image.height;
    
    for(let i = 0; i < h / 2; i++) {
        let y = i * w;
        let x = (h - i - 1) * w;
        for(let j = 0; j < w; j++) {
            let s = (y + j) * 4,
                t = (x + j) * 4,
                r = data[s],
                g = data[s + 1],
                b = data[s + 2],
                a = data[s + 3];
            data[s] = data[t];
            data[s + 1] = data[t + 1];
            data[s + 2] = data[t + 2];
            data[s + 3] = data[t + 3];
            data[t] = r;
            data[t + 1] = g;
            data[t + 2] = b;
            data[t + 3] = a;
        }
    }
}

function flipXY(image) {
    let data = image.data,
        w = image.width,
        h = image.height;
    
    for(let i = 1; i < h; i++) {
        let y = i * w;
        for(let j = i; j < w; j++) {
            let s = (y + j) * 4,
                t = (j * w + i) * 4;
                r = data[s],
                g = data[s + 1],
                b = data[s + 2],
                a = data[s + 3];
            data[s] = data[t];
            data[s + 1] = data[t + 1];
            data[s + 2] = data[t + 2];
            data[s + 3] = data[t + 3];
            data[t] = r;
            data[t + 1] = g;
            data[t + 2] = b;
            data[t + 3] = a;
        }
    }
}
