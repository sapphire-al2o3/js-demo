
var wideArea = function() {
    var text = $(this).val();
    var lines = text.split('\n');
    $(this).css('height', lines.length + 'em');
}

$('textarea')
    .keyup(wideArea)
    .keydown(wideArea)
    .focus(wideArea)
    .blur(function() { $(this).css('height', '1em'); });
