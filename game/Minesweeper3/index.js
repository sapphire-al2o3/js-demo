const tables = [];
const cells = [];
const elems = [];
let sizeX = 7;
let sizeY = 7;
let sizeZ = 3;
let count = 10;
let flagCount = count;
let finish = false;
let timer = 0;

// ?x=5&y=5&z=5&m=10
// ?x=7&y=7&z=3&m=10

const tableContainer = document.getElementById('tables');
const mineCountText = document.getElementById('mine-count');
const timerText = document.getElementById('timer');

let params = new URLSearchParams(document.location.search);

if (params.size > 0) {
    sizeX = parseInt(params.get('x') ?? '7', 10);
    sizeY = parseInt(params.get('y') ?? '7', 10);
    sizeZ = parseInt(params.get('z') ?? '3', 10);
    count = parseInt(params.get('m') ?? '10', 10);
}

function createTable(index) {
    let k = index * sizeX * sizeY;
    const table = document.createElement('table');
    for (let i = 0; i < sizeY; i++) {
        const tr = document.createElement('tr');

        for (let j = 0; j < sizeX; j++) {
            const td = document.createElement('td');
            td.setAttribute('x', j);
            td.setAttribute('y', i);
            td.setAttribute('z', index);
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
        table.appendChild(tr);
    }
    tables[index] = table;
    tableContainer.appendChild(table);
}

for (let i = 0; i < sizeZ; i++) {
    createTable(i);
}

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
    m += hasMine(x - 1, y, z - 1);
    m += hasMine(x - 1, y, z + 1);
    m += hasMine(x + 1, y, z - 1);
    m += hasMine(x + 1, y, z + 1);

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
        elems[i].classList.remove('flag');
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
                    // elems[k].classList.add('mine');
                    // elems[k].classList.remove('block');
                } else {
                    cells[k].hint = checkCell(x, y, z);
                    if (cells[k].hint > 0) {
                        // elems[k].textContent = cells[k].hint;
                        // cells[k] = 3;
                    }
                }
            }
        }
    }

    flagCount = count;
    mineCountText.textContent = count;
    timerText.textContent = 0;
}

setupMine(count);

function paint(x, y, z) {
    let w = sizeX,
        h = sizeY,
        d = sizeZ,
        c = cells[z * w * h + y * w + x];

     if (!c.block) {
        
        return;
    }

    (function f(x, y, z) {
        if (x >= w || x < 0) return;
        if (y >= h || y < 0) return;
        if (z >= d || z < 0) return;
        let k = z * w * h + y * w + x;
        if (cells[k].block) {
            cells[k].block = false;
            if (cells[k].flag) {
                cells[k].flag = false;
                flagCount++;
            }
            elems[k].classList.remove('flag');
            elems[k].classList.remove('block');
            if (cells[k].hint > 0) {
                elems[k].textContent = cells[k].hint;
            } else if(!cells[k].mine) {
                f(x - 1, y, z);
                f(x + 1, y, z);
                f(x, y - 1, z);
                f(x, y + 1, z);
                f(x, y, z - 1);
                f(x, y, z + 1);

                f(x - 1, y - 1, z);
                f(x - 1, y + 1, z);
                f(x + 1, y - 1, z);
                f(x + 1, y + 1, z);
                f(x, y - 1, z - 1);
                f(x, y - 1, z + 1);
                f(x, y + 1, z - 1);
                f(x, y + 1, z + 1);
                f(x - 1, y, z - 1);
                f(x - 1, y, z + 1);
                f(x + 1, y, z - 1);
                f(x + 1, y, z + 1);

                f(x - 1, y - 1, z - 1);
                f(x - 1, y - 1, z + 1);
                f(x - 1, y + 1, z - 1);
                f(x - 1, y + 1, z + 1);
                f(x + 1, y - 1, z - 1);
                f(x + 1, y - 1, z + 1);
                f(x + 1, y + 1, z - 1);
                f(x + 1, y + 1, z + 1);
            }
        }
    })(x, y, z);
}

function openCell(x, y, z) {
    paint(x, y, z);
}

function clickCell(e) {
    if (finish) {
        return;
    }

    if (e.target.tagName === 'TD') {
        let k = parseInt(e.target.getAttribute('k'));

        if (timer === 0) {
            startTimer();
        }

        if (!cells[k].block) {
            // opened
            return;
        }

        if (cells[k].flag) {
            return;
        }

        elems[k].classList.remove('block');
        
        let x = parseInt(e.target.getAttribute('x'));
        let y = parseInt(e.target.getAttribute('y'));
        let z = parseInt(e.target.getAttribute('z'));

        if (cells[k].mine) {
            // game over
            GameOver();
            finish = true;
        } else if (cells[k].hint > 0) {
            elems[k].textContent = cells[k].hint;
            cells[k].block = false;
        } else {
            openCell(x, y, z);
        }

        if (prev) {
            hoverOut(x, y, z);
            hoverIn(x, y, z);
        }

        if (checkComplete()) {
            complete.classList.add('show');
            finish = true;
            clearInterval(timer);
            timer = 0;
        }
    }
}

for (let i = 0; i < sizeZ; i++) {
    tables[i].addEventListener('click', clickCell);
}

function clickFlag(e) {
    e.preventDefault();
    
    if (finish) {
        return;
    }

    if (e.target.tagName === 'TD') {
        let k = parseInt(e.target.getAttribute('k'));

        if (timer === 0) {
            startTimer();
        }

        if (cells[k].block) {
            if (cells[k].flag) {
                e.target.classList.remove('flag');
                cells[k].flag = false;
                flagCount++;
            } else {
                e.target.classList.add('flag');
                cells[k].flag = true;
                flagCount--;
            }

            mineCountText.textContent = flagCount;
        }

        if (checkComplete()) {
            complete.classList.add('show');
            finish = true;
            clearInterval(timer);
            timer = 0;
        }
    }
    // e.stopPropagation();
}

for (let i = 0; i < sizeZ; i++) {
    tables[i].addEventListener('contextmenu', clickFlag);
}

function getElem(x, y, z) {
    if (x < 0 || x >= sizeX) return null;
    if (y < 0 || y >= sizeY) return null;
    if (z < 0 || z >= sizeZ) return null;
    let k = z * sizeX * sizeY + y * sizeX + x;
    return elems[k];
}

function getCell(x, y, z) {
    if (x < 0 || x >= sizeX) return null;
    if (y < 0 || y >= sizeY) return null;
    if (z < 0 || z >= sizeZ) return null;
    let k = z * sizeX * sizeY + y * sizeX + x;
    return cells[k];
}

let prev = null;
let prevX = 0;
let prevY = 0;
let prevZ = 0;

function hoverIn(x, y, z) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            for (let k = -1; k <= 1; k++) {
                if (i !== 0 || j !== 0 || k !== 0) {
                    let c = getCell(x + k, y + j, z + i);
                    if (c !== null && c.block) {
                        getElem(x + k, y + j, z + i)?.classList.add('hover');
                    }
                }
            }
        }
    }
}

function hoverOut(x, y, z) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            for (let k = -1; k <= 1; k++) {
                if (i !== 0 || j !== 0 || k !== 0) {
                    getElem(x + k, y + j, z + i)?.classList.remove('hover');
                }
            }
        }
    }
}

function mouseover(e) {
    if (e.target.tagName === 'TD') {
        if (prev) {
            // prev.classList.remove('hover');
            // getElem(prevX - 1, prevY, prevZ)?.classList.remove('hover');
            // getElem(prevX + 1, prevY, prevZ)?.classList.remove('hover');
            // getElem(prevX, prevY - 1, prevZ)?.classList.remove('hover');
            // getElem(prevX, prevY + 1, prevZ)?.classList.remove('hover');
            // getElem(prevX, prevY, prevZ - 1)?.classList.remove('hover');
            // getElem(prevX, prevY, prevZ + 1)?.classList.remove('hover');

            hoverOut(prevX, prevY, prevZ);
        }

        let x = parseInt(e.target.getAttribute('x'));
        let y = parseInt(e.target.getAttribute('y'));
        let z = parseInt(e.target.getAttribute('z'));

        // e.target.classList.add('hover');

        // getElem(x - 1, y, z)?.classList.add('hover');
        // getElem(x + 1, y, z)?.classList.add('hover');
        // getElem(x, y - 1, z)?.classList.add('hover');
        // getElem(x, y + 1, z)?.classList.add('hover');
        // getElem(x, y, z - 1)?.classList.add('hover');
        // getElem(x, y, z + 1)?.classList.add('hover');

        hoverIn(x, y, z);

        prev = e.target;
        prevX = x;
        prevY = y;
        prevZ = z;
    }
}

function mouseout(e) {
    if (e.target.tagName === 'TD') {

        if (prev) {
            // prev.classList.remove('hover');
            // getElem(prevX - 1, prevY, prevZ)?.classList.remove('hover');
            // getElem(prevX + 1, prevY, prevZ)?.classList.remove('hover');
            // getElem(prevX, prevY - 1, prevZ)?.classList.remove('hover');
            // getElem(prevX, prevY + 1, prevZ)?.classList.remove('hover');
            // getElem(prevX, prevY, prevZ - 1)?.classList.remove('hover');
            // getElem(prevX, prevY, prevZ + 1)?.classList.remove('hover');

            hoverOut(prevX, prevY, prevZ);
        }
    }
}

for (let i = 0; i < sizeZ; i++) {
    tables[i].addEventListener('mouseover', mouseover);
    tables[i].addEventListener('mouseout', mouseout);
}

const complete = document.getElementById('complete');
const bomb = document.getElementById('bomb');

function checkComplete() {

    for (let i = 0; i < cells.length; i++) {
        if (cells[i].mine ^ cells[i].flag) {
            return false;
        } else if (!cells[i].flag && cells[i].block) {
            return false;
        }
    }

    return flagCount === 0;
}

function GameOver() {
    bomb.classList.add('show');

    for (let i = 0; i < cells.length; i++) {
        if (cells[i].mine) {
            elems[i].classList.add('mine');
            elems[i].classList.remove('block');
            // elems[i].classList.remove('flag');
        }
    }

    clearInterval(timer);
    timer = 0;
}

document.getElementById('reset').addEventListener('click', e => {
    setupMine(count);
    finish = false;
    complete.classList.remove('show');
    bomb.classList.remove('show');

    clearInterval(timer);
    timer = 0;
}, false);

function startTimer() {
    clearInterval(timer);

    beginTime = Date.now();
    prevTime = 0;
    timer = setInterval(() => {
        let time = (Date.now() - beginTime) / 1000 ^ 0;
        if (time > 1000) {
            time = 999;
        }
        if (prevTime != time) {
            timerText.textContent = time;
            prevTime = time;
        }
    }, 500);
}

