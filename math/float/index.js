
const $f = document.getElementById('float');
const $i = document.getElementById('int');

function convertF2I()
{
    let v = parseFloat($f.value);
    let floatArray = new Float32Array([v]);
    let intArray = new Uint32Array(floatArray.buffer);
    $i.value = intArray[0].toString(16);
}

function convertI2F()
{
    let v = parseInt($f.value);
    let floatArray = new Float32Array([v]);
    let intArray = new Uint32Array(floatArray.buffer);
    $i.value = intArray[0].toString(16);
}

document.getElementById('convert').addEventListener('click', e => {
    convertF2I();
}, false);
