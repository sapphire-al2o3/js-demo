$('#t1').append($('<tr>'));

var t2 = document.getElementById('t2');

t2.appendChild(document.createElement('tr'));

$('tr').each(function() {
    $(this).text(this.rowIndex + ':' + this.sectionRowIndex);
});
