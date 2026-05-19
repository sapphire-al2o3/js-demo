const table = document.querySelector('table');
const cells = [];
const elems = [];
const sizeX = 10;
const sizeY = 10;
const hintSizeX = sizeX / 2 ^ 0;
const hintSizeY = sizeY / 2 ^ 0;

const pixels = [
    0,0,1,1,1,1,1,1,0,0,
    0,1,0,1,0,0,1,0,1,0,
    1,0,0,0,1,1,0,0,0,1,
    1,0,0,1,0,0,1,0,0,1,
    1,0,0,0,0,0,0,0,0,1,
    0,1,1,0,0,0,0,1,1,0,
    0,1,0,1,1,1,1,0,1,0,
    0,1,0,1,0,0,1,0,1,0,
    1,0,0,1,0,0,1,0,0,1,
    0,0,1,0,0,0,0,1,0,0
];

//#fOz3P_-A48-fA_7zB-OBhuOBpOOBvA
// const pixels = [
//     0,0,1,1,1,1,1,0,0,0,
//     1,1,0,1,1,1,1,1,1,0,
//     1,1,1,1,1,1,1,1,1,1,
//     0,0,1,1,1,1,1,1,1,1,
//     0,0,0,0,0,0,0,1,1,1,
//     0,0,0,1,1,1,1,1,1,1,
//     0,0,1,1,1,1,1,1,1,0,
//     0,1,1,1,0,0,0,0,0,0,
//     0,1,1,1,1,1,1,1,1,1,
//     0,0,1,1,1,1,1,1,1,0
// ];

//#4MEP__z0U42ff23XDuOBn-OBkw

let hintX = [];
let hintY = [];
let hintXElm = [];
let hintYElm = [];

function generateHint(v) {
    hintX.length = 0;
    hintY.length = 0;
    for (let i = 0; i < sizeY; i++) {
        hintY.push([]);
        let b = 0;
        for (let j = 0; j < sizeX; j++) {
            let index = i * sizeX + j;
            if (pixels[index] === v) {
                b++;
            } else if(b > 0) {
                hintY[i].push(b);
                b = 0;
            }
        }
        if (b > 0) {
            hintY[i].push(b);
        }
    }
    for (let i = 0; i < sizeX; i++) {
        let y = hintSizeY - hintY[i].length;
        for (let j = 0; j < y; j++) {
            hintY[i].unshift(0);
        }
    }

    for (let j = 0; j < sizeX; j++) {
        hintX.push([]);
        let b = 0;
        for (let i = 0; i < sizeY; i++) {
            let index = i * sizeX + j;
            if (pixels[index] === v) {
                b++;
            } else if (b > 0) {
                hintX[j].push(b);
                b = 0;
            }
        }
        if (b > 0) {
            hintX[j].push(b);
        }
    }

    for (let i = 0; i < sizeY; i++) {
        let x = hintSizeX - hintX[i].length;
        for (let j = 0; j < x; j++) {
            hintX[i].unshift(0);
        }
    }
}

generateHint(1);

for (let i = 0; i < hintSizeY; i++) {
    const tr = document.createElement('tr');

    for (let j = 0; j < hintSizeX; j++) {
        const th = document.createElement('th');
        tr.appendChild(th);
    }

    hintXElm[i] = [];
    for (let j = 0; j < sizeX; j++) {
        const th = document.createElement('th');
        if (hintX[j][i] > 0) {
            th.textContent = hintX[j][i];
        }
        hintXElm[i].push(th);
        tr.appendChild(th);
    }
    table.appendChild(tr);
}

let k = 0;
for (let i = 0; i < sizeY; i++) {
    const tr = document.createElement('tr');

    hintYElm[i] = [];
    for (let j = 0; j < hintSizeX; j++) {
        const th = document.createElement('th');
        if (hintY[i][j] > 0) {
            th.textContent = hintY[i][j];
        }
        hintYElm[i].push(th);
        tr.appendChild(th);
    }

    for (let j = 0; j < sizeX; j++) {
        const td = document.createElement('td');
        td.setAttribute('x', j);
        td.setAttribute('y', i);
        td.setAttribute('k', k);

        if (i === 0) {
            td.classList.add('top_line5');
        }
        if (i % 5 === 4) {
            td.classList.add('bottom_line5');
        }
        if (j === 0) {
            td.classList.add('left_line5');
        }
        if (j % 5 === 4) {
            td.classList.add('right_line5');
        }

        tr.appendChild(td);
        elems.push(td);
        cells.push(0);
        k++;
    }
    table.appendChild(tr);
}

table.addEventListener('click', e => {
    if (e.target.tagName === 'TD') {
        e.target.classList.toggle('black');
        let k = parseInt(e.target.getAttribute('k'));
        cells[k] = 1 - cells[k];

        if (checkComplete()) {
            console.log('complete');
            complete.classList.add('show');
        }
    }
}, false);

const complete = document.getElementById('complete');

function checkComplete() {
    for (let i = 0; i < pixels.length; i++) {
        if (cells[i] !== pixels[i]) {
            return false;
        }
    }
    return true;
}


document.getElementById('reset').addEventListener('click', e => {
    for (let i = 0; i < cells.length; i++) {
        cells[i] = 0;
        elems[i].classList.remove('black');
    }
    complete.classList.remove('show');
}, false);

function printPixel() {
    let text = '';
    for (let i = 0; i < sizeY; i++) {
        for (let j = 0; j < sizeX; j++) {
            let k = i * sizeX + j;
            text += cells[k].toString() + ',';
        }
        text += '\n';
    }
    console.log(text);
}

if (window.location.hash === '#edit') {
    document.getElementById('editor').classList.add('show');
} else if (window.location.hash[0] === '#') {
    let hash = window.location.hash.slice(1);
    console.log(hash);

    let bytes = Uint8Array.fromBase64(hash, {
        alphabet: "base64url",
    });

    let length = (pixels.length / 8 ^ 0) + 1;
    let packedData = new Uint8Array(bytes.buffer, 0, length);
    unpack(packedData, pixels);

    const decoder = new TextDecoder();
    let text = decoder.decode(new Uint8Array(bytes.buffer, length));

    document.getElementById('answer').textContent = text;

    generateHint(1);
    setupHint();
}

const url = document.getElementById('url');
const title = document.getElementById('title');

url.addEventListener('focus', e => {
    url.select();
}, false);

function pack(data, p) {
    let k = 0;
    let i = 0;
    let n = data.length / 8 ^ 0;
    p = p || [];
    for (; i < n; i++) {
        p[i] = 0;
        for (let j = 0; j < 8; j++) {
            p[i] |= (data[k++] !== 0) << j;
        }
    }
    let m = data.length - n * 8;
    for (let j = 0; j < m; j++) {
        p[i] |= (data[k++] !== 0) << j;
    }

    return p;
}

function unpack(data, p, length) {
    let k = 0;
    p = p || [];
    length = length || p.length;
    for (let i = 0, n = data.length; i < n; i++) {
        for (let j = 0; j < 8; j++) {
            p[k++] = (data[i] >> j) & 1;
            length--;
            if (length === 0) {
                break;
            }
        }
    }
    return p;
}

function setupHint() {
    for (let i = 0; i < hintY.length; i++) {
        for (let j = 0; j < hintY[i].length; j++) {
            if (hintY[i][j] > 0) {
                hintYElm[i][j].textContent = hintY[i][j];
            } else {
                hintYElm[i][j].textContent = '';
            }
        }
    }
    for (let i = 0; i < hintX.length; i++) {
        for (let j = 0; j < hintX[i].length; j++) {
            if (hintX[i][j] > 0) {
                hintXElm[j][i].textContent = hintX[i][j];
            } else {
                hintXElm[j][i].textContent = '';
            }
        }
    }
}

document.getElementById('edit').addEventListener('click', e => {
    for (let i = 0; i < pixels.length; i++) {
        pixels[i] = cells[i];
    }

    generateHint(1);
    setupHint();


    let packedData = new Uint8Array((pixels.length / 8 ^ 0) + 1);
    pack(pixels, packedData);
    

    const encoder = new TextEncoder();
    let bytesTitle = encoder.encode(title.value);

    let bytes = new Uint8Array(packedData.length + bytesTitle.length);
    bytes.set(packedData);
    bytes.set(bytesTitle, packedData.length);

    let encodedData = bytes.toBase64({ alphabet: "base64url", omitPadding: true });
    complete.classList.remove('show');

    url.value = window.location.href + '#' + encodedData;
}, false);

document.querySelectorAll('a').forEach(v => v.addEventListener('click', e => {
    location.href = v.href;
    location.reload();
}, false));
