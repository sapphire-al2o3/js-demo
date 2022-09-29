let date = localStorage.getItem('date');
let text = localStorage.getItem('text');

const $date = document.getElementById('date');
if (date !== undefined) {
    $date.textContent = date;
}

const $textarea = document.getElementById('textarea');
if (text !== undefined) {
    $textarea.value = text;
}

// ブラウザを閉じるときに保存する
const save = (p) => {
    date = (new Date()).toString();
    localStorage.setItem('date', p + date);

    localStorage.setItem('text', $textarea.value);
};

window.addEventListener('unload', (e) => {
    console.log('unload');
}, false);

// モバイルブラウザでは閉じたときにpagehideが発生しない
window.addEventListener('pagehide', (e) => {
    console.log('pagehide');
    save('h:');
}, false);
// ページの表示状態が変わったとき
document.addEventListener('visibilitychange', (e) => {
    console.log(document.visibilityState);
    if (document.visibilityState === 'visible') {
        save('v:');
    }
}, false);
