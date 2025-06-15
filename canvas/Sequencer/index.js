(function run() {
    'use strict';
    
    const box = document.getElementById("box");
    
    const text = run.toString();
    
    // nフレーム待つ
    function* waitFrame(n) {
        for (; n; n--) {
            yield n;
        }
    }

    function* waitTime(t) {
        let start = time;
        while (t > time - start) {
            yield;
        }
    }
    
    // ジェネレータを作る
    const i = function*() {
        yield* waitTime(1000);
        
        for (let k = 0; k < text.length; k++) {
            box.textContent += text[k];
            yield* waitTime(50);
        }
    }();
    
    let elapsed = 0,
        time = Date.now(),
        lastTime = time;

    const update = () => {
        let now = Date.now(),
            delta = now - time;
        time = now;
        elapsed += delta;
        if (i.next().done) {
            
        } else {
            requestAnimationFrame(update);
        }
    };

    requestAnimationFrame(update);

})();
