function createSlider(id, callback, initial = 0) {
    let wrapper = document.createElement('div'),
        slider = document.createElement('div'),
        thumb = document.createElement('span'),
        label = document.createElement('label');
    
    const w = 120;
    
    wrapper.appendChild(slider);
    wrapper.appendChild(label);
    label.textContent = id;
    slider.setAttribute('id', id);
    slider.appendChild(thumb);
    slider.classList.add('slider');
    slider.style.width = w + 'px';
    thumb.style.left = initial * (w - 12) + 'px';
    
    slider.addEventListener('pointerdown', e => {
        let cur = thumb,
            t = document,
            r = slider.getBoundingClientRect(),
            x = e.pageX - r.left,
            l = r.left;
        
        if(x > w - 12) x = w - 12;
        cur.style.left = x + 'px';
        slider.value = x / (w - 12);
        
        if(slider.value > 1.0) slider.value = 1.0;
        if(slider.value < 0.0) slider.value = 0.0;
        t.onselectstart = () => { return false; };
        t.onpointermove = e => {
            let x = e.clientX - l;
            if(x < 0) x = 0;
            if(x > w - 12) x = w - 12;
            cur.style.left = x + 'px';
            slider.value = x / (w - 12);
            if(callback) {
                callback(slider.value, id);
            }
        }
        t.onpointerup = e => {
            t.onpointermove = null;
            t.ontouchmove = null;
            t.onpointerup = null;
            t.onselectstart = null;
        };
        
        if(callback) {
            callback(slider.value, id);
        }
        
    }, false);
    slider.value = 1.0;
    
    return wrapper;
}

function createCheckbox(id, callback, initial = false) {
    const wrapper = document.createElement('div'),
        label = document.createElement('label'),
        input = document.createElement('input');
    
    wrapper.classList.add('checkbox');
    label.setAttribute('for', id);
    label.textContent = id;
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', id);
    input.checked = initial;

    input.addEventListener('click', e => {
        if(callback) {
            callback(e.target.checked, id);
        }
    }, false);
    
    wrapper.appendChild(input);
    wrapper.appendChild(label);
    
    return wrapper;
}

function createRadio(ids, callback, initial = 0) {
    let wrapper = document.createElement('div');
    
    for(let i = 0; i < ids.length; i++) {
        let button = document.createElement('div'),
            label = document.createElement('label'),
            input = document.createElement('input'),
            id = ids[i];

        wrapper.classList.add('checkbox');
        label.setAttribute('for', id);
        label.textContent = id;
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'radio-' + ids[0]);
        input.setAttribute('id', id);

        if(i === initial) {
            input.checked = true;
        }
        
        input.addEventListener('click', e => {
            if(callback) {
                callback(e.target.checked, e.target.id, i);
            }
        }, false);

        button.appendChild(input);
        button.appendChild(label);
        wrapper.appendChild(button);
    }
    
    return wrapper;
}

let items = [];

function removeListItem(e) {
    console.log(e.target.parentNode);
    document.getElementById('wrapper').removeChild(e.target.parentNode);
}

let index = 0;
document.getElementById('add').addEventListener('click', e => {
    let input = document.createElement('input');
    let item = document.createElement('div');
    let removeButton = document.createElement('input');
    input.setAttribute('type', 'text');
    removeButton.setAttribute('type', 'button');
    removeButton.setAttribute('value', '✖');
    removeButton.addEventListener('click', removeListItem);
    item.setAttribute('id', 'item-' + index.toString())
    item.appendChild(input);
    item.appendChild(removeButton);
    document.getElementById('wrapper').appendChild(item);
    index++;
});
