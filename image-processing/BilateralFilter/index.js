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

    const size = width * height;
    for(let i = 0; i < size; i++) {
            
            let index = i * 4;
            let r = data[index];
            let g = data[index + 1];
            let b = data[index + 2];

            let sr, sg, sb, sw;
            sr = sg = sb = sw = 0;

            for(let k = 0; k < indices.length; k++) {
                let t = index + indices[k] * 4;
                let rr = data[t];
                let gg = data[t + 1];
                let bb = data[t + 2];

                sr += rr;
                sg += gg;
                sb += bb;
                sw += 0;
            }

            ret[index] = sr / sw ^ 0;
            ret[index + 1] = sg / sw ^ 0;
            ret[index + 2] = sb / sw ^ 0;
            ret[index + 3] = 255;
        }
    }

    ctx.putImageData(result, 0, 0);
};
