document.getElementById('open').addEventListener('click', () => {
    window.open('page.html');
}, false);

// let t = new Uint32Array(1024);

window.getArray = () => {
    let a = [];
    for(let i = 0; i < 1024; i++) {
        a.push(i);
    }
    return a;
};

window.getTypedArray = () => {
    return new Uint32Array(1024);
};