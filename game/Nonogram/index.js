const table = document.querySelector('table');
const cells = [];
const elems = [];
const sizeX = 10;
const sizeY = 10;
const hintSizeX = sizeX / 2 ^ 0;
const hintSizeY = sizeY / 2 ^ 0;

// const pixels = [
//     0,0,0,1,1,1,1,0,0,0,
//     0,0,1,0,0,0,0,1,0,0,
//     0,1,0,0,0,0,0,0,1,0,
//     0,1,0,0,0,0,0,0,1,0,
//     1,0,0,0,0,0,0,0,0,1,
//     1,0,0,0,0,0,0,0,0,1,
//     0,1,1,1,1,1,1,1,1,0,
//     0,1,0,1,0,0,1,0,1,0,
//     1,0,0,1,0,0,1,0,0,1,
//     0,0,1,0,0,0,0,1,0,0
// ];

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

let hintX = [];
let hintY = [];

function generateHint(v) {
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

    for (let j = 0; j < sizeX; j++) {
        const th = document.createElement('th');
        if (hintX[j][i] > 0) {
            th.textContent = hintX[j][i];
        }
        tr.appendChild(th);
    }
    table.appendChild(tr);
}

let k = 0;
for (let i = 0; i < sizeY; i++) {
    const tr = document.createElement('tr');

    for (let j = 0; j < hintSizeX; j++) {
        const th = document.createElement('th');
        if (hintY[i][j] > 0) {
            th.textContent = hintY[i][j];
        }
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

        if (pixels[k] === 1) {
            // td.classList.toggle('black');
        }

        tr.appendChild(td);
        elems.push(td);
        cells.push(0);
        // cells.push(pixels[k]);
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
        }
    }
}, false);

function checkComplete() {
    for (let i = 0; i < pixels.length; i++) {
        if (cells[i] !== pixels[i]) {
            return false;
        }
    }
    return true;
}
