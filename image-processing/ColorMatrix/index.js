'use strict';

window.onload = () => {

    const canvas = document.getElementById('result');
    const ctx = canvas.getContext('2d');

    const src = document.getElementById('source');
    const srcCtx = src.getContext('2d');

    const img = document.getElementById('image');

    src.width = canvas.width = img.width;
    src.height = canvas.height = img.height;

    srcCtx.drawImage(img, 0, 0, img.width, img.height);

    const image = srcCtx.getImageData(0, 0, canvas.width, canvas.height);
    const result = ctx.createImageData(canvas.width, canvas.height);
    const data = image.data;
    const ret = result.data;

    let matrix = [
        0, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 0, 0
    ];

    let inputMatrix = [
        document.getElementById('m00'),
        document.getElementById('m01'),
        document.getElementById('m02'),
        document.getElementById('m03'),
        document.getElementById('m10'),
        document.getElementById('m11'),
        document.getElementById('m12'),
        document.getElementById('m13'),
        document.getElementById('m20'),
        document.getElementById('m21'),
        document.getElementById('m22'),
        document.getElementById('m23'),
    ];

    const changeInput = (v) => {
        getValue();
        render();
    };

    for (let i = 0; i < inputMatrix.length; i++) {
        inputMatrix[i].addEventListener('change', changeInput);
    }

    document.getElementById('original').addEventListener('click', () => {
        matrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
        ];
        setValue();
        render();
    });

    document.getElementById('grayscale').addEventListener('click', () => {
        matrix = [
            0.299, 0.587, 0.114, 0,
            0.299, 0.587, 0.114, 0,
            0.299, 0.587, 0.114, 0,
        ];
        setValue();
        render();
    });

    document.getElementById('sepia').addEventListener('click', () => {
        matrix = [
            0.393, 0.769, 0.189, 0,
            0.349, 0.686, 0.168, 0,
            0.272, 0.534, 0.131, 0,
        ];
        setValue();
        render();
    });

    document.getElementById('nega').addEventListener('click', () => {
        matrix = [
            -1, 0, 0, 255,
            0, -1, 0, 255,
            0, 0, -1, 255,
        ];
        setValue();
        render();
    });

    function str2rgb(str) {
        if (str[0] === '#') {
            if (str.length === 7) {
                return [parseInt(str.slice(1, 3), 16), parseInt(str.slice(3, 5), 16), parseInt(str.slice(5), 16)];
            } else if (str.length === 4) {
                return [parseInt(str[1] + str[1], 16), parseInt(str[2] + str[2], 16), parseInt(str[3] + str[3], 16)];
            }
        } else {
            var c = str.match(/(\d+)/g);
            return [parseInt(c[0], 10), parseInt(c[1], 10), parseInt(c[2], 10)];
        }
    }

    document.getElementById('blend').addEventListener('click', () => {
        const a = parseFloat(document.getElementById('alpha').value);
        const color = str2rgb(document.getElementById('color').value);
        matrix = [
            1 - a, 0, 0, a * color[0],
            0, 1 - a, 0, a * color[1],
            0, 0, 1 - a, a * color[2],
        ];
        setValue();
        render();
    });

    function setValue() {
        for(let i = 0; i < matrix.length; i++) {
            inputMatrix[i].value = matrix[i];
        }
    }

    function getValue(m) {
        for(let i = 0; i < matrix.length; i++) {
            matrix[i] = parseFloat(inputMatrix[i].value);
        }
    }

    function clamp(v) {
        return v < 0 ? 0 : v > 255 ? 255 : v;
    }

    function multiplyMatrix(m, r, g, b) {
        let rr = m[0] * r + m[1] * g + m[2] * b + m[3],
            gg = m[4] * r + m[5] * g + m[6] * b + m[7],
            bb = m[8] * r + m[9] * g + m[10] * b + m[11];
        return [rr, gg, bb];
    }

    function render() {
        let width = image.width,
            height = image.height;

        for(let i = 0; i < height; i++) {
            for(let j = 0; j < width; j++) {
                let index = (i * width + j) * 4;
                let r = data[index],
                    g = data[index + 1],
                    b = data[index + 2],
                    a = data[index + 3];
                
                [r, g, b] = multiplyMatrix(matrix, r, g, b);
                ret[index] = clamp(r) ^ 0;
                ret[index + 1] = clamp(g) ^ 0;
                ret[index + 2] = clamp(b) ^ 0;
                ret[index + 3] = a;
            }
        }

        ctx.putImageData(result, 0, 0);
    }

    setValue();
    render();
};
