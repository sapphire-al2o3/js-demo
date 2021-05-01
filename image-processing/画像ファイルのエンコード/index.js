var area = document.getElementById('box');

area.addEventListener('drop', function(e) {
    e.preventDefault();
    loadFile(e);
}, false);

area.addEventListener('dragover', function(e) {
    e.preventDefault();
}, false);

function loadFile(e) {
    var file = e.dataTransfer.files[0],
        reader = new FileReader();
    reader.onload = function(e) {
        box.innerHTML = reader.result;
    };
    reader.readAsDataURL(file);
}
