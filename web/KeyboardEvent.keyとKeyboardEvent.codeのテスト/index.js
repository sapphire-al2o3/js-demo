let $keyCode = document.getElementById('keyCode'),
    $code = document.getElementById('code'),
    $key = document.getElementById('key');

document.addEventListener('keydown', (e) =>
                          {
                              $keyCode.innerHTML = 'keyCode:' + e.keyCode;
                              $code.innerHTML = 'code:' + e.code;
                              $key.innerHTML = 'key:' + e.key;
                          }, false);