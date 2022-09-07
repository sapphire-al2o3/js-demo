let date = localStorage.getItem('date');

const text = document.getElementById('text');
text.textContent = date;

// ブラウザを閉じるときに保存する
const save = () => {
    date = (new Date()).toString();
    localStorage.setItem('date', date)
};

window.addEventListener('pagehide', save, false);
