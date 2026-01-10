
function removeListItem(e) {
    document.getElementById('wrapper').removeChild(e.target.parentNode);
}

let index = 0;
document.getElementById('add').addEventListener('click', e => {
    let input = document.createElement('input');
    let item = document.createElement('div');
    let removeButton = document.createElement('span');
    input.setAttribute('type', 'text');
    removeButton.innerText = '✖';
    removeButton.addEventListener('click', removeListItem);
    item.setAttribute('id', 'item-' + index.toString())
    item.appendChild(input);
    item.appendChild(removeButton);
    document.getElementById('wrapper').appendChild(item);
    index++;
});
