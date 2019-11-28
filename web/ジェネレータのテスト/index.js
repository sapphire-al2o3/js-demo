// nフレーム待つ
function* wait(n) {
    for(; n; n--) {
        yield n;
    }
}

var i = function*() {
    console.log('10フレームウェイト');
    yield* wait(10);
    console.log('5フレームウェイト');
    yield* wait(5);
    console.log('おわり');
}();

// タイマーで呼び出し
var timer = setInterval(function() {
    if(i.next().done) {
        clearInterval(timer);
    }
}, 1000 / 10);