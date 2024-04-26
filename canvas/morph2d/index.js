window.onload = () => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d', {willReadFrequently: true});

    const imgFrom = document.getElementById('img_from');
    const imgTo = document.getElementById('img_to');

    const map = document.getElementById('map');
    const mapCtx = map.getContext('2d', {willReadFrequently: true});

    let w = canvas.width = map.width = imgFrom.width;
    let h = canvas.height = map.height = imgFrom.height;

    ctx.drawImage(imgFrom, 0, 0);
    const imgDataFrom = ctx.getImageData(0, 0, w, h);
    let dataFrom = imgDataFrom.data;

    ctx.drawImage(imgTo, 0, 0);
    const imgDataTo = ctx.getImageData(0, 0, w, h);
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

    function genDistMap(dataFrom, dataTo, distMap) {
        let max = 0;
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                let k = (i * w + j) * 4;
                let d = -1;
                if (dataTo[k] === 0) {
                    d = Math.sqrt(dist(dataFrom, j, i));
                    if (d > max) {
                        max = d;
                    }
                }
                distMap[i * w + j] = d;
            }
        }
        return max;
    }

    const distMap = [];
    const distMapR = [];
    let max = genDistMap(dataFrom, dataTo, distMap);
    let maxR = genDistMap(dataTo, dataFrom, distMapR);

    let nega = false;
    let reverse = false;
    createMap();

    function getMapValue(k, r) {
        // 背景を255にしているので最大値を255にしない
        const valueMax = 255 - 15;
        let y = nega ? 0 : 255;
        let d = 0;
        let m = 1;
        if (r) {
            d = distMap[k];
            m = max;
        } else {
            d = distMapR[k];
            m = maxR;
        }
        if (d !== -1) {
            if (nega) {
                y = 255 - (d / m) * valueMax ^ 0;
            } else {
                y = (d / m) * valueMax ^ 0;
            }
        }
        return y;
    }

    function createMap() {
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                let y = getMapValue(i * w + j, reverse);
                let k = (i * w + j) * 4;
                dataResult[k] = y;
                dataResult[k + 1] = y;
                dataResult[k + 2] = y;
                dataResult[k + 3] = 255;
            }
        }
        mapCtx.putImageData(imgResult, 0, 0);
    }

    function render(th) {
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                let k = (i * w + j) * 4;
                let d = distMap[i * w + j];
                let y = 255;
                if (d !== -1) {
                    y = (d / max) * 255 ^ 0;
                    if (y > th) {
                        y = 255;
                    } else {
                        y = 0;
                    }
                }
                d = distMapR[i * w + j];
                let yy = 255;
                if (d !== -1) {
                    yy = 255 - (d / maxR) * 255 ^ 0;
                    if (yy < th) {
                        yy = 255;
                    } else {
                        yy = 0;
                    }
                }
                y = yy && y;
                dataResult[k] = y;
                dataResult[k + 1] = y;
                dataResult[k + 2] = y;
                dataResult[k + 3] = 255;
            }
        }
    
        ctx.putImageData(imgResult, 0, 0);
    }

    function dropImage(img, cb) {
        img.addEventListener('dragover', e => {
            e.preventDefault();
        }, false);

        img.addEventListener('drop', e => {
            const file = e.dataTransfer.files[0];
            const reader = new FileReader();
            reader.onload = e => {
                img.src = reader.result;
                img.onload = cb;
            };
            reader.readAsDataURL(file);
            e.preventDefault();
        }, false);
    }

    dropImage(imgFrom);
    dropImage(imgTo);

    document.getElementById('convert').addEventListener('click', e => {
        if (w != imgFrom.width || h != imgFrom.height) {
            w = canvas.width = imgFrom.width;
            h = canvas.height = imgFrom.height;

            imgResult = ctx.createImageData(w, h);
            dataResult = imgResult.data;
        }

        ctx.drawImage(imgFrom, 0, 0);
        const imgDataFrom = ctx.getImageData(0, 0, w, h);
        const dataFrom = imgDataFrom.data;

        ctx.drawImage(imgTo, 0, 0);
        const imgDataTo = ctx.getImageData(0, 0, w, h);
        const dataTo = imgDataTo.data;

        max = genDistMap(dataFrom, dataTo, distMap);
        maxR = genDistMap(dataTo, dataFrom, distMapR);

        createMap();
    });

    document.body.appendChild(createCheckbox('nega', v => {
        nega = v;
    }));

    document.body.appendChild(createCheckbox('BtoA', v => {
        reverse = v;
    }));

    document.body.appendChild(createSlider('th', 0, v => {
        let th = v * 255 ^ 0;
        render(th);
    }));
};
