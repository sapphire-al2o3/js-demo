let deck = [],
    dealer = [],
    player = [];

let log = '',
    $console = document.getElementById('console');

function print(text) {
    log += text + '<br>';
    $console.innerHTML = log;
    console.log(text);
}

// 山札を作る
function set(deck) {
    const mark = ['♣', '♥', '♦', '♠'];
    for(let k = 0; k < 1; k++) {
        for(let j = 0; j < 4; j++) {
            for(let i = 0; i < 13; i++) {
                deck.push({m: mark[j], n: i + 1});
            }
        }
    }
}
	
// カードを切る
function shuffle(deck) {
    for(let i = 0, l = deck.length; i < l; i++) {
        let j = Math.random() * l ^ 0,
            t = deck[i];
        deck[i] = deck[j];
        deck[j] = t;
    }
}

// プレイヤーとディーラーに2枚ずつカードを配る
function start() {
    player.push(draw(deck));
    player.push(draw(deck));
    dealer.push(draw(deck));
    dealer.push(draw(deck));
    
    show();
    
    if(total(player) == 21) {
        print('ブラックジャック');
        stand();
        
        check();
    }
}

function draw(deck) {
    return deck.pop();
}

function win() {
    print('あなたの勝ちです');
}

function lose() {
    print('あなたの負けです');
}

function tie() {
    print('引き分けです');
}

function total(card) {
    let sum = 0,
        a = 0;
    for(let i = 0; i < card.length; i++) {
        if(card[i].n === 1) {
            a++;
            sum += 11;
        } else if(card[i].n > 10) {
            sum += 10;
        } else {
            sum += card[i].n;
        }
    }
    
    if(sum > 21 && a > 0) {
        sum -= 10;
        a--;
    }
    
    return sum;
}
	
function check() {
    let pt = total(player),
        dt = total(dealer);
    
    if(pt > 21) {
        return 2;
    }
    
    if(pt === dt) {
        tie();
        return 3;
    } else if(pt > dt) {
        win();
        return 1;
    } else if(pt < dt) {
        lose();
        return 2;
    }
    return 0;
}

function bust(card) {
    let sum = total(card);
    if(sum > 21) {
        print('21を超えました');
        return true;
    }
    return false;
}

// カードをもう一枚引く
function hit() {
    player.push(draw(deck));
    
    show();
    
    // 
    if(bust(player)) {
        lose();
    }
}
	
// 勝負する
function stand() {
    // ディーラーのカードをオープンする
    show(true);
    
    // ディーラーの合計が17未満ならカードを引く
    while(total(dealer) < 17) {
        print('ディーラーがカードを引きます');
        dealer.push(draw(deck));
        show(true);
    }
    
    // 勝敗の判定
    check();
}

function show(f) {
    // プレヤーの手札を表示
    let str = 'player: ';
    for(let i = 0; i < player.length; i++) {
        str += player[i].m + '' + player[i].n + ' ';
    }
    print(str);
    print('total ' + total(player));

    // ディーラーの手札表示
    str = 'dealer: ';
    if(f) {
        str = '';
        for(let i = 0; i < dealer.length; i++) {
            str += dealer[i].m + '' + dealer[i].n + ' ';
        }
        print('total ' + total(dealer));
    } else {
        str += dealer[0].m + '' + dealer[0].n + ' ??';
    }
    print(str);
}

function reset() {
    deck.length = 0;
    player.length = 0;
    dealer.length = 0;
    log = '';
    set(deck);
    shuffle(deck);
    start();
}

document.getElementById('hit').addEventListener('click', () => hit());
document.getElementById('stand').addEventListener('click', () => stand());
document.getElementById('reset').addEventListener('click', () => reset());

print('==== Blackjack ====');
set(deck);
shuffle(deck);
start();
