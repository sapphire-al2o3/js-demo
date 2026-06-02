const table = document.querySelector('table');
const cells = [];
const elems = [];
const sizeX = 9;
const sizeY = 9;
const count = 10;


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
        // cells.push(pixels[k]);
        k++;
    }
    table.appendChild(tr);
}

function rand(n) {
    return Math.random() * n ^ 0;
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

    for (let i = 0; i < count; i++) {
        cells[t[i]] = 1;
    }

    for (let i = 0; i < sizeY; i++) {
        for (let j = 0; j < sizeX; j++) {
            let k = i * sizeX + j;
            if (cells[k] === 1) {
                elems[k].classList.add('mine');
            }
        }
    }
}

setupMine(count);

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
    return false;
}


document.getElementById('reset').addEventListener('click', e => {
    for (let i = 0; i < cells.length; i++) {
        cells[i] = 0;
        elems[i].classList.remove('black');
    }
    complete.classList.remove('show');
}, false);
