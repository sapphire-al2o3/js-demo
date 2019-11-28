// forked from sapphire_al2o3's "画像ファイルのエンコード" http://jsdo.it/sapphire_al2o3/8zXe
var area = document.getElementById('box');

area.addEventListener('drop', function(e) {
    e.preventDefault();
    loadFile(e, document.getElementById('text').checked);
}, false);

area.addEventListener('dragover', function(e) {
    e.preventDefault();
}, false);

function loadFile(e, t) {
    var file = e.dataTransfer.files[0];
    
    if(!file.type.match(/image\/svg/)) {
        return;
    }
    
    var reader = new FileReader();
    reader.onload = function(e) {
        var text = reader.result;
        box.innerHTML = (t ? 'data:image/svg+xml,' + encodeURIComponent(text) : text);
    };
    if(t) {
        reader.readAsText(file);
    } else {
        reader.readAsDataURL(file);
    }
}
