var a = [],
    b = [];

function log(m) {
    document.getElementById('console').value += m + '\n';
}

for(var i = 0; i < 5; i++) {
    a.push(i);
}

log('a = ' + a);
log('');

log('ただの代入');
b = a;
log('b = ' + b);
b[0] = 10;
// 元の値も書き換わる
log('a = ' + a);
log('b = ' + b);
log('');

a[0] = 0;
b = [];

log('forでコピー');
for(var j = 0, l = a.length; j < l; j++) {
    b.push(a[j]);
}
log('b = ' + b);
b[0] = 10;
log('a = ' + a);
log('b = ' + b);
log('');

log('sliceでコピー');
b = a.slice(0);
log('b = ' + b);
b[1] = 10;
log('a = ' + a);
log('b = ' + b);
log('');

log('concatでコピー');
b = a.concat();
log('b = ' + b);
b[2] = 10;
log('a = ' + a);
log('b = ' + b);
log('');

log('Array.applyでコピー');
b = Array.apply(null, a);
log('b = ' + b);
b[3] = 10;
log('a = ' + a);
log('b = ' + b);