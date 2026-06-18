const tables = document.querySelectorAll('table');
const cells = [];
const elems = [];
const sizeX = 5;
const sizeY = 5;
const sizeZ = 3;
const count = 10;
let mineCount = count;
let finish = false;

const mineCountText = document.getElementById('mine-count');

function createTable(index) {
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
            cells.push({
                hint: 0,
                flag: false,
                mine: false,
                block: true
            });
            k++;
        }
        tables[index].appendChild(tr);
    }
}

createTable(0);
createTable(1);
createTable(2);

function rand(n) {
    return Math.random() * n ^ 0;
}

function hasMine(x, y, z) {
    if (x < 0 || x >= sizeX) return false;
    if (y < 0 || y >= sizeY) return false;
    if (z < 0 || z >= sizeZ) return false;
    let k = z * sizeX * sizeY + y * sizeX + x;
    return cells[k].mine ? 1 : 0;
}
function checkCell(x, y, z) {
    let m = 0;
    m += hasMine(x - 1, y, z);
    m += hasMine(x + 1, y, z);
    m += hasMine(x, y - 1, z);
    m += hasMine(x, y + 1, z);
    m += hasMine(x, y, z - 1);
    m += hasMine(x, y, z + 1);

    m += hasMine(x - 1, y - 1, z);
    m += hasMine(x - 1, y + 1, z);
    m += hasMine(x + 1, y - 1, z);
    m += hasMine(x + 1, y + 1, z);
    m += hasMine(x, y - 1, z - 1);
    m += hasMine(x, y - 1, z + 1);
    m += hasMine(x, y + 1, z - 1);
    m += hasMine(x, y + 1, z + 1);

    m += hasMine(x - 1, y - 1, z - 1);
    m += hasMine(x - 1, y - 1, z + 1);
    m += hasMine(x - 1, y + 1, z - 1);
    m += hasMine(x - 1, y + 1, z + 1);
    m += hasMine(x + 1, y - 1, z - 1);
    m += hasMine(x + 1, y - 1, z + 1);
    m += hasMine(x + 1, y + 1, z - 1);
    m += hasMine(x + 1, y + 1, z + 1);


    return m;
}

function setupMine(count) {
    finish = false;
    let t = [];
    let n = sizeX * sizeY * sizeZ;
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
        cells[i].block = true;
        cells[i].mine = false;
        cells[i].flag = false;
        cells[i].hint = 0;
        elems[i].classList.remove('mine');
        elems[i].classList.add('block');
        elems[i].textContent = '';
    }

    for (let i = 0; i < count; i++) {
        cells[t[i]].mine = true;
    }

    for (let z = 0; z < sizeZ; z++) {
        for (let y = 0; y < sizeY; y++) {
            for (let x = 0; x < sizeX; x++) {
                let k = z * sizeX * sizeY + y * sizeX + x;
                if (cells[k].mine) {
                    elems[k].classList.add('mine');
                    elems[k].classList.remove('block');
                } else {
                    cells[k].hint = checkCell(x, y, z);
                    if (cells[k].hint > 0) {
                        elems[k].textContent = cells[k].hint;
                        // cells[k] = 3;
                    }
                }
            }
        }
    }

    mineCount = count;
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

function clickCell(e) {
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
}
tables[0].addEventListener('click', clickCell);

tables[0].addEventListener('contextmenu', e => {
    if (e.target.tagName === 'TD') {
        e.target.classList.remove('block');
        let k = parseInt(e.target.getAttribute('k'));

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

    finish = true;
}

document.getElementById('reset').addEventListener('click', e => {
    setupMine(count);
    complete.classList.remove('show');
    bomb.classList.remove('show');
}, false);
