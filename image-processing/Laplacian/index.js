window.onload = () => {

    function sqdist(r0, g0, b0, r1, g1, b1) {
        return (r0 - r1) * (r0 - r1) + (g0 - g1) * (g0 - g1) + (b0 - b1) * (b0 - b1);
    }

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

    let w = 4;

    let width = image.width,
        height = image.height;

    const filter = [1, 1, 1, 1, -8, 1, 1, 1, 1]

    for(let i = 1; i < height - 1; i++) {
        for(let j = 1; j < width - 1; j++) {
            let rr, gg, bb;
            rr = gg = bb = 0;
            for(let y = -1; y <= 1; y++) {
                for(let x = -1; x <= 1; x++) {
                    let k = filter[(y + 1) * 3 + (x + 1)];
                    let n = ((i + y) * width + (j + x)) * 4; 
                    rr += data[n] * k;
                    gg += data[n + 1] * k;
                    bb += data[n + 2] * k;
                }
            }
            let index = (i * width + j) * 4; 
            ret[index] = rr;
            ret[index + 1] = gg;
            ret[index + 2] = bb;
            ret[index + 3] = 255
        }
    }

    ctx.putImageData(result, 0, 0);
};
