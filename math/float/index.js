
const $f = document.getElementById('float');
const $b = document.getElementById('binary');

convertF2I();

function convertF2I()
{
    let v = parseFloat($f.value);
    let floatArray = new Float32Array([v]);
    let intArray = new Uint32Array(floatArray.buffer);
    $b.value = intArray[0].toString(16);
}

function convertI2F()
{
    let v = parseInt($b.value, 16);
    let intArray = new Uint32Array([v]);
    let floatArray = new Float32Array(intArray.buffer);
    $f.value = floatArray[0];
}

document.getElementById('f2i').addEventListener('click', e => {
    convertF2I();
}, false);

document.getElementById('i2f').addEventListener('click', e => {
    convertI2F();
}, false);
