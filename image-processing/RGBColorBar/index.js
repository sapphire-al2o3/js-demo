// forked from sapphire_al2o3's "inputのnumber的なもの" http://jsdo.it/sapphire_al2o3/5uY0
$('.button, .left, .right').click(function(e) {
    var target = $(this).attr('for'),
	radix = $('#' + target).attr('radix') ? 16 : 10,
	val = parseInt($('#' + target).val(), radix),
	step = parseInt($(this).attr('step'), radix),
	max = 255,
	min = 0;
    val = isNaN(val) ? 0 : val + step;
    val = val < min ? 0 : val > max ? max : val;
    $('#' + target).val(val.toString(radix).toUpperCase());
    changeColor();
    e.preventDefault();
});

$('.color-bar').mousedown(function(e) {
    var border = 2,
        target = $(e.target);
    var x = e.pageX - target.position().left - border,
        v = range(x / target.width(), 0.0, 1.0);
    $('#' + target.attr('for')).val(v * 255 ^ 0);
    changeColor();
});

$('input').change(function(e) {
    changeColor();
});

function setGrad(elm, start, end) {
    var bender = ['-moz-', '-webkit-', '-o-', '-ms-', ''];
    for(var i = 0, l = bender.length; i < l; i++) {
        elm.css('background', bender[i] + 'linear-gradient(left,' + start + ',' + end + ')');
    }
}

function setGradBar(r, g, b) {
    setGrad($('#r-bar'), rgb(0, g, b), rgb(255, g, b));
    setGrad($('#g-bar'), rgb(r, 0, b), rgb(r, 255, b));
    setGrad($('#b-bar'), rgb(r, g, 0), rgb(r, g, 255));
}

function roundByte(v) {
    return Math.min(Math.max(parseInt(v, 10), 0), 255);
}
function changeColor() {
    var r = roundByte($('#num1').val()),
        g = roundByte($('#num2').val()),
        b = roundByte($('#num3').val()),
        color = rgb(r, g, b);
    $('body').css('background-color', color);
    $('p').text(color.toUpperCase());
    $('p').css('color', gray(r, g, b) > 128 ? '#000' : '#FFF');
    setGradBar(r, g, b);
}

function rgba(r, g, b, a) {
    return 'rgb(' + r + ',' + g + ',' + b + ',' + a + ')';
}

function rgb(r, g, b) {
    return '#' + ('0' + (r^0).toString(16)).slice(-2) + ('0' + (g^0).toString(16)).slice(-2) + ('0' + (b^0).toString(16)).slice(-2);
}

function gray(r, g, b) {
    return 0.298912 * r + 0.586611 * g + 0.114478 * b;
}

function range(v, min, max) {
    return v > max ? max : v < min ? min : v;
}
