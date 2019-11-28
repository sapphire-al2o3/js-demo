(function run() {
    'use strict';
    
    var box = document.getElementById("box");
    
    var text = run.toString();
    
    // nフレーム待つ
    function* wait(n) {
        for(; n; n--) {
            yield n;
        }
    }
    
    // ジェネレータを作る
    var i = function*() {
        yield* wait(10);
        
        for(var k = 0; k < text.length; k++) {
            box.textContent += text[k];
            yield* wait(1);
        }
    }();
    
    // タイマーで呼び出し
    var timer = setInterval(function() {
        if(i.next().done) {
            clearInterval(timer);
        }
    }, 1000 / 10);
    
})();
