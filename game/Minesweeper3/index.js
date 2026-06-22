const tables = document.querySelectorAll('table');
const cells = [];
const elems = [];
const sizeX = 5;
const sizeY = 5;
const sizeZ = 3;
const count = 5;
let mineCount = count;
let finish = false;

const mineCountText = document.getElementById('mine-count');

function createTable(index) {
    let k = index * sizeX * sizeY;
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

    mineCount = count;
    mineCountText.textContent = count;
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
            }
        }
    })(x, y, z);
}

function openCell(x, y, z) {
    paint(x, y, z);
}

function clickCell(e) {
    if (e.target.tagName === 'TD') {
        let k = parseInt(e.target.getAttribute('k'));

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
        if (checkComplete()) {
            complete.classList.add('show');
        }
    }
}
tables[0].addEventListener('click', clickCell);
tables[1].addEventListener('click', clickCell);
tables[2].addEventListener('click', clickCell);

function clickFlag(e) {
    e.preventDefault();
    
    if (finish) {
        return;
    }

    if (e.target.tagName === 'TD') {
        let k = parseInt(e.target.getAttribute('k'));

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
        }
    }
    // e.stopPropagation();
}

tables[0].addEventListener('contextmenu', clickFlag);
tables[1].addEventListener('contextmenu', clickFlag);
tables[2].addEventListener('contextmenu', clickFlag);


function getElem(x, y, z) {
    if (x < 0 || x >= sizeX) return null;
    if (y < 0 || y >= sizeY) return null;
    if (z < 0 || z >= sizeZ) return null;
    let k = z * sizeX * sizeY + y * sizeX + x;
    return elems[k];
}

let prev = null;
let prevX = 0;
let prevY = 0;
let prevZ = 0;

function mouseover(e) {
    if (e.target.tagName === 'TD') {
        if (prev) {
            // prev.classList.remove('hover');
            getElem(prevX - 1, prevY, prevZ)?.classList.remove('hover');
            getElem(prevX + 1, prevY, prevZ)?.classList.remove('hover');
            getElem(prevX, prevY - 1, prevZ)?.classList.remove('hover');
            getElem(prevX, prevY + 1, prevZ)?.classList.remove('hover');
            getElem(prevX, prevY, prevZ - 1)?.classList.remove('hover');
            getElem(prevX, prevY, prevZ + 1)?.classList.remove('hover');

        }

        let x = parseInt(e.target.getAttribute('x'));
        let y = parseInt(e.target.getAttribute('y'));
        let z = parseInt(e.target.getAttribute('z'));

        // e.target.classList.add('hover');

        getElem(x - 1, y, z)?.classList.add('hover');
        getElem(x + 1, y, z)?.classList.add('hover');
        getElem(x, y - 1, z)?.classList.add('hover');
        getElem(x, y + 1, z)?.classList.add('hover');
        getElem(x, y, z - 1)?.classList.add('hover');
        getElem(x, y, z + 1)?.classList.add('hover');

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
            getElem(prevX - 1, prevY, prevZ)?.classList.remove('hover');
            getElem(prevX + 1, prevY, prevZ)?.classList.remove('hover');
            getElem(prevX, prevY - 1, prevZ)?.classList.remove('hover');
            getElem(prevX, prevY + 1, prevZ)?.classList.remove('hover');
            getElem(prevX, prevY, prevZ - 1)?.classList.remove('hover');
            getElem(prevX, prevY, prevZ + 1)?.classList.remove('hover');
        }
    }
}

tables[0].addEventListener('mouseover', mouseover);
tables[1].addEventListener('mouseover', mouseover);
tables[2].addEventListener('mouseover', mouseover);
tables[0].addEventListener('mouseout', mouseout);
tables[1].addEventListener('mouseout', mouseout);
tables[2].addEventListener('mouseout', mouseout);

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
        }
    }
}

document.getElementById('reset').addEventListener('click', e => {
    setupMine(count);
    finish = false;
    complete.classList.remove('show');
    bomb.classList.remove('show');
}, false);
