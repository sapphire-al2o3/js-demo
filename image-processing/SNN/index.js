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

    let w = 2;

    for(let i = 0; i < image.height; i++) {
        for(let j = 0; j < image.width; j++) {
            let index = (i * image.width + j) * 4;
            let r = data[index],
                g = data[index + 1],
                b = data[index + 2],
                a = data[index + 3];
            for(let k = -w; k < w; k++) {
                let y = i + k;
                for(let l = -w; l < w; l++) {
                    let x = j + l;

                }
            }
            ret[index] = r;
            ret[index + 1] = g;
            ret[index + 2] = b;
            ret[index + 3] = a;
        }
    }

    ctx.putImageData(result, 0, 0);
};