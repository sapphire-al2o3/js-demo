$(function() {
	var table = $('#palette table'),
		colors = [],
		cell = null,
		option = {hex: false},
		rbar, gbar, bbar;
	for(var i = 0; i < 16; i++) {
		var tr = $('<tr>');
		for(var j = 0; j < 16; j++) {
			var td = $('<td>');
			td.click(function(e) {
				$('#palette td').removeClass('selected');
				$(this).addClass('selected');
				cell = $(this);
				$('#front-color').css('background-color', cell.css('background-color'));
				var color = str2rgb(cell.css('background-color'));
				rbar.position(color[0] / 255);
				gbar.position(color[1] / 255);
				bbar.position(color[2] / 255);
				$('#val-r-text').val(color[0]);
				$('#val-g-text').val(color[1]);
				$('#val-b-text').val(color[2]);
			});
			td.css('background-color', 'black');
			tr.append(td);
			colors.push(td);
		}
		table.append(tr);
	}
	cell = $('tr:first-child td:first-child', table).addClass('selected');
	
	rbar = slider('r-bar', 150, function(e) {
		var color = str2rgb(cell.css('background-color')),
			r = rangeByte(e * 256),
			bc = rgb(r, color[1], color[2]);
		cell.css('background-color', bc);
		$('#front-color').css('background-color', bc);
		$(this).css('background-color', bc);
		gradient($('#val-r'), rgb(0, color[1], color[0]), rgb(255, color.g, color.b));
		gradient($('#val-g'), rgb(r, 0, color.b), rgb(r, 255, color.b));
		gradient($('#val-b'), rgb(r, color.g, 0), rgb(r, color.g, 255));
		$('#val-r-text').val(r);
	});
	gbar = slider('g-bar', 150, function(e) {
		var color = str2rgb(cell.css('background-color')),
			g = rangeByte(e * 256),
			bc = rgb(color[0], g, color[2]);
		cell.css('background-color', bc);
		$('#front-color').css('background-color', bc);
		$(this).css('background-color', bc);
		gradient($('#val-r'), rgb(0, g, color.b), rgb(255, g, color.b));
		gradient($('#val-g'), rgb(color.r, 0, color.b), rgb(color.r, 255, color.b));
		gradient($('#val-b'), rgb(color.r, g, 0), rgb(color.r, g, 255));
		$('#val-g-text').val(g);
	});
	bbar = slider('b-bar', 150, function(e) {
		var color = str2rgb(cell.css('background-color')),
			b = rangeByte(e * 256),
			bc = rgb(color[0], color[1], b);
		cell.css('background-color', bc);
		$('#front-color').css('background-color', bc);
		$(this).css('background-color', bc);
		$('#val-b-text').val(b);
	});
	
	gradient($('#val-r'), '#F00', '#0F0');
	
	$('#val-r-text').keyup(function() {
		var r = parseInt($(this).val(), 10),
			color = str2rgb(cell.css('background-color')),
			bc = rgb(r, color[1], color[2]);
		rbar.position(r/255);
		cell.css('background-color', bc);
		$('#front-color').css('background-color', bc);
	});
	$('#val-g-text').keyup(function() {
		var g = parseInt($(this).val(), 10),
			color = str2rgb(cell.css('background-color')),
			bc = rgb(color[0], g, color[2]);
		gbar.position(g/255);
		cell.css('background-color', bc);
		$('#front-color').css('background-color', bc);
	});
	$('#val-b-text').keyup(function() {
		var b = parseInt($(this).val(), 10),
			color = str2rgb(cell.css('background-color')),
			bc = rgb(color[0], color[1], b);
		bbar.position(b/255);
		cell.css('background-color', bc);
		$('#front-color').css('background-color', bc);
	});
});

function rgba(r, g, b, a) {
	return 'rgba(' + (r^0) + ',' + (g^0) + ',' + (b^0) + ',' + a + ')';
}
function rgb(r, g, b) {
	return '#' + ('0' + (r^0).toString(16)).slice(-2) + ('0' + (g^0).toString(16)).slice(-2) + ('0' + (b^0).toString(16)).slice(-2);
}

function str2rgb(str) {
	var c = str.match(/(\d+)/g);
	return [parseInt(c[0], 10), parseInt(c[1], 10), parseInt(c[2], 10)];
}

function rangeByte(n) {
	return Math.min(Math.max(n^0, 0), 255);
}

function gradient(e, start, stop) {
	var vendor = ['', '-moz-', '-webkit-', '-o-', '-ms-'];
		grad = 'linear-gradient(left,' + start + ',' + stop + ')';
	for(var i = 0, n = vendor.length; i < n; i++) {
		e.css('background', vendor[i] + grad);
	}
}

function slider(id, w, func) {
	var elm = document.getElementById(id);
	elm.style.width = w + 'px';
	elm.onmousedown = function(e) {
		var cur = this.firstChild,
			t = document,
			r = elm.getBoundingClientRect(),
			x = e.pageX - r.left,
			y = e.pageY - r.top,
			l = r.left;
		if(x < 0) x = 0; else if(x > w) x = w;
		cur.style.left = x - 4 + 'px';
		elm.value = x / w;
		
		t.onselectstart = function() { return false; };
		
		t.onmousemove = function(e) {
			var x = e.clientX - l;
			if(x < 0) x = 0;
			if(x > w) x = w;
			cur.style.left = x - 4 + 'px';
			elm.value = x / w;
			if(func) func(elm.value);
		};
		t.onmouseup = function(e) {
			t.onmousemove = null;
			t.onmouseup = null;
			t.onselectstart = null;
		};
		
		if(func) func(elm.value);
	};
	elm.value = 0;
	elm.position = function(x) {
		x *= w;
		if(x < 0) x = 0;
		if(x > w) x = w;
		elm.firstChild.style.left = x - 4 + 'px';
	};
	return elm;
}