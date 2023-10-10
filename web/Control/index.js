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

document.body.appendChild(createSlider('slider', v => {
}, 0));

document.body.appendChild(createCheckbox('checkbox', v => {
}, false));