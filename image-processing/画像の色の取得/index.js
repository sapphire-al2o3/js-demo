let canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    img = new Image();

canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    loadFile(e);
}, false);

canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
}, false);

function loadFile(e) {
    let file = e.dataTransfer.files[0],
        reader = new FileReader();
    reader.onload = (e) => {
        img.src = reader.result;
        img.onload = () => {
            drawColors();
        };
    };
  reader.readAsDataURL(file);
}

function drawColors() {
    let imageWidth = img.width,
        imageHeight = img.height;
        ctx.drawImage(img, 0, 0);
    let image = ctx.getImageData(0, 0, imageWidth, imageHeight),
        indexData = new Uint8Array(imageWidth * imageHeight),
        paletteData = new Uint8Array(256 * 4),
        palette = getIndexedImage(image, { data: indexData}, { data: paletteData }),
        elm = document.getElementById('colors'),
        colorList = '';
    ctx.clearRect(0, 0, 300, 300);
    for(let i = 0; i < palette.length; i++) {
        ctx.fillStyle = palette[i];
        ctx.fillRect(i % 16 * 10, ((i / 16)^0) * 10, 10, 10);
        colorList += '<li>' + palette[i] + '</li>';
    }
    elm.innerHTML = colorList;
}

function rgb(r, g, b) {
    return '#' + ('0' + (r^0).toString(16)).slice(-2) + ('0' + (g^0).toString(16)).slice(-2) + ('0' + (b^0).toString(16)).slice(-2);
}

function getIndexedImage(src, image, palette) {
    let count = 0,
        pal = [],
        data = src.data,
        indexData = image.data,
        paletteData = palette.data;
    for(let i = 0, j = 0, n = data.length; i < n; i += 4, j++) {
        let r = data[i],
            g = data[i + 1],
            b = data[i + 2],
            a = data[i + 3],
            color = rgb(r, g, b),
            index = pal.indexOf(color);
        if(index < 0) {
            pal.push(color);
            index = count;
            count += 1;
            let p = index * 4;
            paletteData[p] = r;
            paletteData[p + 1] = g;
            paletteData[p + 2] = b;
            paletteData[p + 3] = 255;
            if(count >= 256) {
                break;
            }
        }
        indexData[j] = index;
    }
    return pal;
}
