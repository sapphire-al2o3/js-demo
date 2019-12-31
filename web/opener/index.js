document.getElementById('open').addEventListener('click', () => {
    window.open('page.html');
}, false);

window.getArray = () => {
    return [1, 2, 3];
};

window.getTypedArray = () => {
    return new Uint32Array([1, 2, 3]);
};