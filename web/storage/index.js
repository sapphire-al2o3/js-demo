let count = 0;

const $date = document.getElementById('date');
const $count = document.getElementById('count');

function load() {
    let date = localStorage.getItem('date');
    let countText = localStorage.getItem('count');

    if (date !== undefined) {
        $date.textContent = date;
    }

    if (countText !== undefined && countText !== null) {
        count = parseInt(countText);
        if (!isNaN(count)) {
            $count.textContent = count.toString();
        } else {
            count = 0;
            $count.textContent = '0';
        }
    }
}

load();

document.getElementById('reset').addEventListener('click', (e) => {
    count = 0;
    $date.textContent = '';
    $count.textContent = count.toString();
    localStorage.removeItem('date');
    localStorage.removeItem('count');
}, false);

document.getElementById('reload').addEventListener('click', (e) => {
    load();
}, false);

// ブラウザを閉じるときに保存する
const save = (p) => {
    count++;
    date = (new Date()).toString();
    localStorage.setItem('date', p + date);
    localStorage.setItem('count', count.toString());
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
