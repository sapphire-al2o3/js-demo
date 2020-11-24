var timer = {
    time: function(tag) {
        this.tags[tag] = performance.now();
    },
    timeEnd: function(tag) {
        return (tag, performance.now() - this.tags[tag]);
    },
    tags: {}
};

timer.time('test1');

var pi = 0,
    n = 10000;
for(var i = 0; i <= n; i++) {
    var t = i / n;
    pi += 4 / (1 + t * t);
}

pi /= n;

var time = timer.timeEnd('test1');
document.getElementById('time').textContent = 'time : ' + time;
document.getElementById('result').textContent = pi;
