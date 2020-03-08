
const $f = document.getElementById('float');
const $b = document.getElementById('binary');
const $s = document.getElementById('sign');
const $e = document.getElementById('exponent');
const $fraction = document.getElementById('fraction');

convertF2I();

function convertF2I()
{
    let v = parseFloat($f.value);
    let floatArray = new Float32Array([v]);
    let intArray = new Uint32Array(floatArray.buffer);
    $b.value = intArray[0].toString(16);

    $s.textContent = (intArray[0] >> 31) & 0x1;
    $e.textContent = (intArray[0] >> 23) & ((1 << 8) - 1);
    $fraction.textContent = intArray[0] & ((1 << 23) - 1);
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

document.getElementById('inf').addEventListener('click', e => {
    let v = Infinity;
    let floatArray = new Float32Array([v]);
    let intArray = new Uint32Array(floatArray.buffer);
    $b.value = intArray[0].toString(16);
    $f.value = v;
}, false);

document.getElementById('ninf').addEventListener('click', e => {
    let v = -Infinity;
    let floatArray = new Float32Array([v]);
    let intArray = new Uint32Array(floatArray.buffer);
    $b.value = intArray[0].toString(16);
    $f.value = v;
}, false);

document.getElementById('nan').addEventListener('click', e => {
    let v = NaN;
    let floatArray = new Float32Array([v]);
    let intArray = new Uint32Array(floatArray.buffer);
    $b.value = intArray[0].toString(16);
    $f.value = v;
}, false);
