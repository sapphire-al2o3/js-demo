window.onload = () => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d', {willReadFrequently:true});

    const imgFrom = document.getElementById('img_from');
    const imgTo = document.getElementById('img_to');

    let w = canvas.width = imgFrom.width;
    let h = canvas.height = imgFrom.height;

    ctx.drawImage(imgFrom, 0, 0);
    let imgDataFrom = ctx.getImageData(0, 0, w, h);
    let dataFrom = imgDataFrom.data;

    ctx.drawImage(imgTo, 0, 0);
    let imgDataTo = ctx.getImageData(0, 0, w, h);
    let dataTo = imgDataTo.data;

    let imgResult = ctx.createImageData(w, h);
    let dataResult = imgResult.data;

    function distance2(x0, y0, x1, y1) {
        return (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
    }

    function dist(data, x, y) {
        let d = (w * w + h * h) * 2;
        let dx = w / 2;
        let dy = h / 2;
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                let k = (i * w + j) * 4;
                if (data[k] === 0) {
                    let t = distance2(j, i, x, y);
                    if (t === 0) {
                        return 0;
                    }
                    if (t < d) {
                        d = t;
                        dx = j;
                        dy = i;
                    }
                }
            }
        }
        return d;
    }

    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            let k = (i * w + j) * 4;
            let d = 255;
            if (dataFrom[k] === 0) {
                d = Math.sqrt(dist(dataTo, j, i)) * 20 ^ 0;
                // console.log(d);
            }
            dataResult[k] = d;//dataFrom[k];
            dataResult[k + 1] = d;//dataFrom[k];
            dataResult[k + 2] = d;//dataFrom[k];
            dataResult[k + 3] = 255;
        }
    }

    ctx.putImageData(imgResult, 0, 0);

    document.body.appendChild(createSlider('th', 0, v => {

    }));
};
