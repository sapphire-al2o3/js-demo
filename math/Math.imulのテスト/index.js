var timer = {
	time: function(tag) {
		this.tags[tag] = performance.now();
	},
	timeEnd: function(tag) {
		return performance.now() - this.tags[tag];
	},
	tags: {}
};


if(typeof Math.imul === 'undefined') {
    Math.imul = function(x, y) { return x * y; };
}

timer.time('imul');
var i = 0,
    s = 0;
for(; i < 10000; i++) {
    s = Math.imul(i, i);
}
var time0 = timer.timeEnd('imul');

timer.time('*');
for(i = 0; i < 10000; i++) {
    s = i * i;
}
var time1 = timer.timeEnd('*');

document.getElementById('helloWorld').innerHTML = 'imul' + time0 + '<br />*' + time1;
