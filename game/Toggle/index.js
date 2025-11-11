const map = [];
const sizeX = 5;
const sizeY = 5;

for (let i = 0; i < sizeY; i++) {
    map.push([]);
    for (let j = 0; j < sizeX; j++) {
        map[i].push(0);
    }
}

const table = document.querySelector('table');
const cells = [];

for (let i = 0; i < sizeY; i++) {
    const tr = document.createElement('tr');
    for (let j = 0; j < sizeX; j++) {
        const td = document.createElement('td');
        tr.appendChild(td);
        cells.push(td);
    }
    table.appendChild(tr);
}

const mapElm = [];

let k = 0;
for (let i = 0; i < sizeY; i++) {
    mapElm.push([]);
    for (let j = 0; j < sizeX; j++) {
        mapElm[i].push(cells[k]);
        cells[k].setAttribute('x', j);
        cells[k].setAttribute('y', i);
        let r = Math.random() * 2 ^ 0;
        // if (r === 1) {
        //     cells[k].classList.toggle('on');
        //     map[i][j] = 1;
        // }
        k++;
    }
}

table.addEventListener('click', e => {
    if (e.target.tagName === 'TD') {
        let x = parseInt(e.target.getAttribute('x'));
        let y = parseInt(e.target.getAttribute('y'));
        if (map[y][x] === 0) {
            mapElm[y][x].classList.toggle('on');
            map[y][x] = 1;
            if (y > 0) {
                mapElm[y - 1][x].classList.toggle('on');
                map[y - 1][x] = 1 - map[y - 1][x];
            }
            if (y < sizeY - 1) {
                mapElm[y + 1][x].classList.toggle('on');
                map[y + 1][x] = 1 - map[y + 1][x];
            }
            if (x > 0) {
                mapElm[y][x - 1].classList.toggle('on');
                map[y][x - 1] = 1 - map[y][x - 1];
            }
            if (x < sizeX - 1) {
                mapElm[y][x + 1].classList.toggle('on');
                map[y][x + 1] = 1 - map[y][x + 1];
            }
        }
    }
}, false);

