const timer = {
    time: function(tag) {
        this.tags[tag] = performance.now();
    },
    timeEnd: function(tag) {
        return (tag, performance.now() - this.tags[tag]);
    },
    tags: {}
};

timer.time('test1');

const worker = new Worker('worker.js');
worker.addEventListener('message', e => {
    const time = timer.timeEnd('test1');
    document.getElementById('time').textContent = 'time : ' + time;
    document.getElementById('result').textContent = e.data;
});



