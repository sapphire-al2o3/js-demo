const table = document.querySelector('table');
const cells = [];
const elems = [];
const sizeX = 10;
const sizeY = 10;
const hintSizeX = sizeX / 2 ^ 0;
const hintSizeY = sizeY / 2 ^ 0;



for (let i = 0; i < hintSizeY; i++) {
    const tr = document.createElement('tr');

    for (let j = 0; j < hintSizeX; j++) {
        const th = document.createElement('th');
        tr.appendChild(th);
    }

    for (let j = 0; j < sizeX; j++) {
        const th = document.createElement('th');
        th.textContent = '0';
        tr.appendChild(th);
    }
    table.appendChild(tr);
}

let k = 0;
for (let i = 0; i < sizeY; i++) {
    const tr = document.createElement('tr');

    for (let j = 0; j < hintSizeX; j++) {
        const th = document.createElement('th');
        th.textContent = '0';
        tr.appendChild(th);
    }

    for (let j = 0; j < sizeX; j++) {
        const td = document.createElement('td');
        td.setAttribute('x', j);
        td.setAttribute('y', i);
        td.setAttribute('k', k);

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
    }
}, false);
