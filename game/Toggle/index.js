
const map = [];

for (let i = 0; i < 3; i++) {
    map.push([]);
    for (let j = 0; j < 3; j++) {
        map[i].push(0);
    }
}

const table = document.querySelector('table');
const cells = document.querySelectorAll('td');

const mapElm = [];

let k = 0;
for (let i = 0; i < 3; i++) {
    mapElm.push([]);
    for (let j = 0; j < 3; j++) {
        mapElm[i].push(cells[k]);
        cells[k].setAttribute('x', j);
        cells[k].setAttribute('y', i);
        let r = Math.random() * 2 ^ 0;
        if (r === 1) {
            cells[k].classList.toggle('on');
        }
        k++;
    }
}

table.addEventListener('click', e => {
    if (e.target.tagName === 'TD') {
        let x = parseInt(e.target.getAttribute('x'));
        let y = parseInt(e.target.getAttribute('y'));
        mapElm[y][x].classList.toggle('on');
        if (y > 0) {
            mapElm[y - 1][x].classList.toggle('on');
        }
        if (y < 2) {
            mapElm[y + 1][x].classList.toggle('on');
        }
        if (x > 0) {
            mapElm[y][x - 1].classList.toggle('on');
        }
        if (x < 2) {
            mapElm[y][x + 1].classList.toggle('on');
        }

        // e.target.classList.toggle('on');
    }
}, false);

