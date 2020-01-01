let page = null;

document.getElementById('open').addEventListener('click', () => {
    page = window.open('page.html');
    page.postMessage('hoge', '*');
}, false);

document.getElementById('send').addEventListener('click', () => {
    page.postMessage('send', '*');
}, false);

// let t = new Uint32Array(1024);

window.getArray = () => {
    let a = [];
    for(let i = 0; i < 1024; i++) {
        a.push(1);
    }
    return a;
};

function sendArray() {
    console.log(page.location.pathname);
    page.postMessage('a', '*', false);
}

// window.sendArray = () => {
//     let a = [];
//     for(let i = 0; i < 1024; i++) {
//         a.push(2);
//     }
//     // page.postMessage('a', '*');
// };

window.addEventListener('message', e => {
    let a = [];
    for(let i = 0; i < 1024; i++) {
        a.push(2);
    }
    e.source.postMessage(a, '*');
}, false);