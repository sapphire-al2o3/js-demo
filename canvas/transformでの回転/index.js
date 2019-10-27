var rot = document.getElementById('rot'),
    classNames = ['rot0', 'rot90', 'rot180', 'rot270', 'rot360'],
    index = 1;



rot.addEventListener('click', function(e) {
    /*
    if(index >= classNames.length) {
        var tmp = rot.style['-webkit-transition'] = 'none';
        rot.className = 'rot360';
        rot.style['-webkit-transition'] = tmp;
        index = 0;
    }*/
    rot.className = classNames[index];
    index = (index + 1) % classNames.length;
}, false);