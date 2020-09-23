window.onload = () => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const img = document.getElementById('image');

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0, img.width, img.height);

    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const result = ctx.createImageData(canvas.width, canvas.height);
    const data = image.data;
    const ret = result.data;

    const weight = [];

    let radius = 3,
        sigma = 0.5,
        g = -0.5 / (sigma * sigma);

    let width = image.width,
        height = image.height;
    

    let indices = [];
    
    for(let i = -radius; i <= radius; i++) {
        for(let j = -radius; j <= radius; j++) {
            let r = i * i + j * j;
            weight.push(r * g);
            indices.push(i * radius + j);
        }
    }

    for(let i = 0; i < height; i++) {
        for(let j = 0; j < width; j++) {
            
            for(let k = -radius; k <= radius; k++) {
                let y = i + k;
                for(let l = -radius; l <= radius; l++) {
                    let index = (y * wdith + j + l) * 4;
                    let r = data[index];
                    let g = data[index + 1];
                    let b = data[index + 2];
                    
                }
            }

            let index = (i * width + j) * 4;
            ret[index] = r;
            ret[index + 1] = g;
            ret[index + 2] = b;
            ret[index + 3] = 255;
        }
    }

    ctx.putImageData(result, 0, 0);
};
