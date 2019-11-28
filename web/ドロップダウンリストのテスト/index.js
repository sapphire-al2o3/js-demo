$('select').change(function() {
    var target = $(this).attr('target');
    $(target).toggle();
});