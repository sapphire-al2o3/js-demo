var elms = document.getElementsByTagName('input');

for(var i = 0, n = elms.length; i < n; i++) {
    elms[i].onkeyup = function() {
        fillColor();
        return false;
    };
}

function hsva(h,s,v,a){var f=h/60,i=f^0,m=v-v*s,k=v*s*(f-i),p=v-k,q=k+m;return 'rgba('+[[v,p,m,m,q,v][i]*255^0,[q,v,v,p,m,m][i]*255^0,[m,m,q,v,v,p][i]*255^0,a].join(',')+')';}

function fillColor() {
    var h = parseFloat(document.getElementById('hue').value),
        s = parseFloat(document.getElementById('sat').value),
        v = parseFloat(document.getElementById('val').value);
    h = h > 360 ? 360 : h < 0 ? 0 : h;
    s = s > 1 ? 1 : s < 0 ? 0 : s;
    v = v > 1 ? 1 : v < 0 ? 0 : v;
    document.body.style.backgroundColor = hsva(h, s, v, 1.0);
}

fillColor();
