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
const save = () => {
    date = (new Date()).toString();
    localStorage.setItem('date', date);

    localStorage.setItem('text', $textarea.value);
};

window.addEventListener('pagehide', save, false);
