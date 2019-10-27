(function() {
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d');
    
    var fontHeight = 32,
        fontWidth = 26,
        fontFamily = 'Baumans',
        text = '0123456789abcdefghijklmnopqrstuvwxyz',
        mono = true,
        outline = true,
        outlineOffsetX = 0,
        outlineOffsetY = 0,
        outlineWidth = 8.0,
        textColor = '#FFFFFF',
        outlineColor = '#849d19';
    
    $('text').addEventListener('keyup', function(e) {
        text = $('text').value;
        render();
    }, false);
    
    $('size').addEventListener('change', function(e) {
        fontHeight = parseInt(e.target.value, 10);
        render();
    }, false);
    
    $('load').addEventListener('click', function(e) {
        fontFamily = $('font').value;
        load(fontFamily);
    });
    
    $('mono').addEventListener('change', function(e) {
        mono = e.target.checked;
        render();
    }, false);
    
    $('outline').addEventListener('change', function(e) {
        outline = e.target.checked;
        outlineWidth = parseFloat($('outline-width').value);
        render();
    }, false);
    
    $('outline-width').addEventListener('change', function(e) {
        outlineWidth = parseFloat(e.target.value);
        render();
    }, false);
    
    $('outline-offset-x').addEventListener('change', function(e) {
        outlineOffsetX = parseInt(e.target.value, 10);
        render();
    }, false);
    
    $('outline-offset-y').addEventListener('change', function(e) {
        outlineOffsetY = parseInt(e.target.value, 10);
        render();
    }, false);
    
    $('text-color').addEventListener('change', function(e) {
        textColor = e.target.value;
        render();
    }, false);
    
    $('outline-color').addEventListener('change', function(e) {
        outlineColor = e.target.value;
        render();
    }, false);
    
    $('save-settings').addEventListener('click', function(e) {
        saveSettings();
    }, false);
    
    $('load-settings').addEventListener('click', function(e) {
        loadSettings();
        load(fontFamily);
    }, false);
    
    $('opt').addEventListener('click', function(e) {
        text = $('text').value;
        var t = [];
        for(var i = 0; i < text.length; i++) {
            if(t.indexOf(text[i]) < 0) {
                t.push(text[i]);
            }
        }
        text = t.join('');
        $('text').value = text;
        render();
    }, false);
    
    $('png').addEventListener('click', function(e) {
        var img = canvas.toDataURL();
        window.open(img, 'font.png');
    }, false);
    
    load($('font').value);
    
    function $(e) {
        return document.getElementById(e);
    }
    
    function load(font) {
        console.log(font);
        WebFont.load({
            google: {
                families: [font]
            },
            active: render,
            inactive: function() {
                console.log('inactive');
                render();
            }
        });
    }
    
    function saveSettings() {
        if(localStorage) {
            localStorage.setItem('font', fontFamily);
            localStorage.setItem('text', text);
            localStorage.setItem('size', fontHeight);
            localStorage.setItem('text-color', textColor);
            localStorage.setItem('mono', mono);
            localStorage.setItem('outline', outline);
            localStorage.setItem('outline-color', outlineColor);
            localStorage.setItem('outline-width', outlineWidth);
            localStorage.setItem('outline-offset-x', outlineOffsetX);
            localStorage.setItem('outline-offset-y', outlineOffsetY);
        }
    }
    
    function getFloat(k, d) {
        var v = localStorage.getItem(k);
        return v ? parseFloat(v) : d;
    }
    function getString(k, d) {
        var v = localStorage.getItem(k);
        return v ? v : d;
    }
    function getBool(k, d) {
        var v = localStorage.getItem(k);
        return v ? v === 'true' ? true : false : d;
    }
    
    function loadSettings() {
        if(localStorage) {
            fontFamily = getString('font', 'Baumans');
            text = getString('text', '0123456789');
            fontHeight = getFloat('size', 42);
            textColor = getString('text-color', '#FFFFFF');
            mono = getBool('mono', true);
            outline = getBool('outline', false);
            outlineColor = getString('outline-color', '#000000');
            outlineWidth = getFloat('outline-width', 8);
            outlineOffsetX = getFloat('outline-offset-x', 0);
            outlineOffsetY = getFloat('outline-offset-y', 0);
            $('font').value = fontFamily;
            $('text').value = text;
            $('size').value = fontHeight;
            $('text-color').value = textColor;
            $('outline-color').value = outlineColor;
            $('outline-width').value = outlineWidth;
            $('outline-offset-x').value = outlineOffsetX;
            $('outline-offset-y').value = outlineOffsetY;
        }
    }
    
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        var w = outlineWidth;
        
        if(!outline) {
            w = 0;
        }
        
        ctx.font = fontHeight + 'px ' + fontFamily;
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = w;
        ctx.textBaseline = 'bottom';
        ctx.textAlign = 'center';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        if(!mono) {
            fontWidth = ctx.measureText(text[0]).width;
        } else {
            fontWidth = 0;
            for(var j = 0; j < text.length; j++) {
                var mw = ctx.measureText(text[j]).width;
                if(mw > fontWidth) {
                    fontWidth = mw;
                }
            }
        }
        
        var prevFontWidth = fontWidth;
        
        var offsetX = w * 0.5 + fontWidth * 0.5,
            offsetY = canvas.height - w * 0.5 - outlineOffsetY;
        
        var rect = [];
        
        ctx.fillStyle = textColor;
        
        for(var i = 0; i < text.length; i++) {
            var c = text[i],
                m = ctx.measureText(c);
            
            if(!mono) {
                offsetX -= fontWidth * 0.5;
                offsetX += m.width * 0.5;
                fontWidth = m.width;
            }
            
            if(offsetX + fontWidth * 0.5 + w > canvas.width) {
                offsetY -= fontHeight + w + outlineOffsetY;
                offsetX = w * 0.5 + fontWidth * 0.5;
            }
            
            var size = {
                x: 0,
                y: 0,
                w: fontWidth + w,
                h: -(fontHeight + w)
            };
            
            var uv = {
                x: (offsetX - w * 0.5 - fontWidth * 0.5) / canvas.width,
                y: (canvas.height - (offsetY + w * 0.5)) / canvas.height,
                w: size.w / canvas.width,
                h: (fontHeight + w) / canvas.height
            };
            
            if(outline) {
                ctx.strokeText(c, offsetX + outlineOffsetX, offsetY + outlineOffsetY);
            }
            
            ctx.fillText(c, offsetX, offsetY);
            
            rect.push([
                c.charCodeAt(), uv.x, uv.y, uv.w, uv.h,
                size.x, size.y, size.w, size.h
            ].join(','));
            
            offsetX += fontWidth + w;
        }
        
        document.getElementById('json').textContent = rect.join('\n');
    }
})();
