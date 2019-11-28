$('.button, .left, .right').click(function(e) {
    var target = $(this).attr('for'),
	radix = $('#' + target).attr('radix') ? 16 : 10;
    var val = parseInt($('#' + target).val(), radix),
	step = parseInt($(this).attr('step'), radix);
    val = isNaN(val) ? 0 : val + step;
    $('#' + target).val(val.toString(radix).toUpperCase());
});