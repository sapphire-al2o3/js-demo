const table = document.querySelector('table');
const cells = [];
const elems = [];
const hints = [];
const sizeX = 9;
const sizeY = 9;
const count = 10;
let mineCount = count;
let flagCount = count;

const mineCountText = document.getElementById('mine-count');

let k = 0;
for (let i = 0; i < sizeY; i++) {
    const tr = document.createElement('tr');

    for (let j = 0; j < sizeX; j++) {
        const td = document.createElement('td');
        td.setAttribute('x', j);
        td.setAttribute('y', i);
        td.setAttribute('k', k);

        tr.appendChild(td);
        elems.push(td);
        cells.push(0);
        hints.push(0);
        // cells.push(pixels[k]);
        k++;
    }
    table.appendChild(tr);
}

function rand(n) {
    return Math.random() * n ^ 0;
}

function checkCell(x, y) {
    let m = 0;
    let k = y * sizeX + x;
    if (x > 0 && cells[k - 1] === 1) m++;
    if (x < sizeX - 1 && cells[k + 1] === 1) m++;
    if (y > 0 && cells[k - sizeX] === 1) m++;
    if (y < sizeY - 1 && cells[k + sizeX] === 1) m++;
    if (x > 0 && y > 0 && cells[k - sizeX - 1] === 1) m++;
    if (x < sizeX - 1 && y > 0 && cells[k - sizeX + 1] === 1) m++;
    if (x > 0 && y < sizeY - 1 && cells[k + sizeX - 1] === 1) m++;
    if (x < sizeX - 1 && y < sizeY - 1 && cells[k + sizeX + 1] === 1) m++;

    return m;
}

function setupMine(count) {
    let t = [];
    let n = sizeX * sizeY;
    for (let i = 0; i < n; i++) {
        t.push(i);
    }

    for (let i = 0; i < count; i++) {
        let k = rand(n - i);
        let m = t[i];
        t[i] = t[k];
        t[k] = m;
    }

    for (let i = 0; i < cells.length; i++) {
        cells[i] = 2;
        elems[i].classList.remove('mine');
        elems[i].classList.add('block');
        elems[i].textContent = '';
    }

    for (let i = 0; i < count; i++) {
        cells[t[i]] = 1;
    }

    for (let i = 0; i < sizeY; i++) {
        for (let j = 0; j < sizeX; j++) {
            let k = i * sizeX + j;
            if (cells[k] === 1) {
                // elems[k].classList.add('mine');
                // elems[k].classList.remove('block');
            } else {
                // elems[k].classList.add('block');
                hints[k] = checkCell(j, i);
                if (hints[k] > 0) {
                    // elems[k].textContent = hints[k];
                    cells[k] = 3;
                }
            }
        }
    }

    flagCount = count;
    mineCountText.textContent = count;
}

setupMine(count);

function paint(x, y) {
    let w = sizeX,
        h = sizeY,
        c = cells[y * w + x];

    if (c !== 2) {
        
        return;
    }

    (function f(x, y) {
        if (x >= w || x < 0) return;
        if (y >= h || y < 0) return;
        let k = y * w + x;
        if (cells[k] === 2) {
            cells[k] = 0;
            elems[k].classList.remove('block');
            f(x - 1, y);
            f(x + 1, y);
            f(x, y - 1);
            f(x, y + 1);

            f(x - 1, y - 1);
            f(x + 1, y - 1);
            f(x - 1, y + 1);
            f(x + 1, y + 1);
        } else if (cells[k] === 3) {
            elems[k].classList.remove('block');
            elems[k].textContent = hints[k];
        }
    })(x, y);
}

function openCell(x, y) {
    let k = y * sizeX + x;
    paint(x, y);
}

table.addEventListener('click', e => {
    if (e.target.tagName === 'TD') {
        e.target.classList.remove('block');
        let k = parseInt(e.target.getAttribute('k'));

        let x = k % sizeX;
        let y = (k / sizeX) ^ 0;

        if (cells[k] === 0) {
            // opened
        } else if (cells[k] === 1) {
            // game over
            GameOver();
        } else if (hints[k] > 0) {
            elems[k].textContent = hints[k];
            cells[k] = 0;
        } else {
            openCell(x, y);
        }
    }

});

table.addEventListener('contextmenu', e => {
    if (e.target.tagName === 'TD') {
        let k = parseInt(e.target.getAttribute('k'));

        if (cells[k] !== 0 && e.target.textContent === '') {
            e.target.classList.toggle('flag');
            flagCount--;

            mineCountText.textContent = flagCount;
        }

        if (checkComplete()) {
            console.log('complete');
            complete.classList.add('show');
        }
    }
    e.preventDefault();
    // e.stopPropagation();
});

const complete = document.getElementById('complete');
const bomb = document.getElementById('bomb');

function checkComplete() {
    return false;
}

function GameOver() {
    bomb.classList.add('show');

    for (let i = 0; i < cells.length; i++) {
        if (cells[i] === 1) {
            elems[i].classList.add('mine');
            elems[i].classList.remove('block');
        }
    }
}

document.getElementById('reset').addEventListener('click', e => {
    setupMine(count);
    complete.classList.remove('show');
    bomb.classList.remove('show');
}, false);
