const table = document.querySelector('table');
const cells = [];
const elems = [];
const sizeX = 9;
const sizeY = 9;
const count = 20;
let flagCount = count;
let finish = false;
let timer = 0;
let beginTime = 0;
let prevTime = 0;

const mineCountText = document.getElementById('mine-count');
const timerText = document.getElementById('timer');

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
    table.appendChild(tr);
}

function rand(n) {
    return Math.random() * n ^ 0;
}

function checkCell(x, y) {
    let m = 0;
    let k = y * sizeX + x;
    if (x > 0 && cells[k - 1].mine) m++;
    if (x < sizeX - 1 && cells[k + 1].mine) m++;
    if (y > 0 && cells[k - sizeX].mine) m++;
    if (y < sizeY - 1 && cells[k + sizeX].mine) m++;
    if (x > 0 && y > 0 && cells[k - sizeX - 1].mine) m++;
    if (x < sizeX - 1 && y > 0 && cells[k - sizeX + 1].mine) m++;
    if (x > 0 && y < sizeY - 1 && cells[k + sizeX - 1].mine) m++;
    if (x < sizeX - 1 && y < sizeY - 1 && cells[k + sizeX + 1].mine) m++;

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

    for (let i = 0; i < sizeY; i++) {
        for (let j = 0; j < sizeX; j++) {
            let k = i * sizeX + j;
            if (cells[k].mine) {
                // elems[k].classList.add('mine');
                // elems[k].classList.remove('block');
            } else {
                // elems[k].classList.add('block');
                cells[k].hint = checkCell(j, i);
                if (cells[k].hint > 0) {
                    // elems[k].textContent = cells[k].hint;
                }
            }
        }
    }

    flagCount = count;
    mineCountText.textContent = count;
    timerText.textContent = getTime(0);
}

setupMine(count);

function paint(x, y) {
    let w = sizeX,
        h = sizeY,
        c = cells[y * w + x];

    if (!c.block) {
        
        return;
    }

    (function f(x, y) {
        if (x >= w || x < 0) return;
        if (y >= h || y < 0) return;
        let k = y * w + x;
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
                f(x - 1, y);
                f(x + 1, y);
                f(x, y - 1);
                f(x, y + 1);

                f(x - 1, y - 1);
                f(x + 1, y - 1);
                f(x - 1, y + 1);
                f(x + 1, y + 1);
            }
        }
    })(x, y);

    mineCountText.textContent = flagCount;
}

function openCell(x, y) {
    paint(x, y);
}

table.addEventListener('click', e => {
    if (finish) {
        return;
    }


    if (timer === 0) {
        startTimer();
    }

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
        let x = k % sizeX;
        let y = (k / sizeX) ^ 0;

        if (cells[k].mine) {
            // game over
            GameOver();
            finish = true;
        } else if (cells[k].hint > 0) {
            elems[k].textContent = cells[k].hint;
            cells[k].block = false;
        } else {
            openCell(x, y);
        }
        if (checkComplete()) {
            complete.classList.add('show');
            finish = true;
        }
    }

});

table.addEventListener('contextmenu', e => {
    e.preventDefault();
    
    if (finish) {
        return;
    }

    if (timer === 0) {
        startTimer();
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
            clearInterval(timer);
            timer = 0;
        }
    }
    // e.stopPropagation();
});

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
    clearInterval(timer);
    timer = 0;
    complete.classList.remove('show');
    bomb.classList.remove('show');
}, false);

function getTime(time) {
    let s = time % 60 ^ 0;
    let m = time / 60 ^ 0;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function startTimer() {
    clearInterval(timer);

    beginTime = Date.now();
    prevTime = 0;
    timer = setInterval(() => {
        let time = (Date.now() - beginTime) / 1000 ^ 0;
        if (time > 60 * 60) {
            time = 999;
        }
        if (prevTime != time) {
            timerText.textContent = getTime(time);
            prevTime = time;
        }
    }, 500);
}

