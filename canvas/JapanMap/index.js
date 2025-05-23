const prefectures = [
    '北海道',
    '青森',
    '岩手',
    '宮城',
    '秋田',
    '山形',
    '福島',
    '茨城',
    '栃木',
    '群馬',     // 10
    '埼玉',
    '千葉',
    '東京',
    '神奈川',
    '新潟',
    '富山',
    '石川',
    '福井',
    '山梨',
    '長野',     // 20
    '岐阜',
    '静岡',
    '愛知',
    '三重',
    '滋賀',
    '京都',
    '大阪',
    '兵庫',
    '奈良',
    '和歌山',   // 30
    '鳥取',
    '島根',
    '岡山',
    '広島',
    '山口',
    '徳島',
    '香川',
    '愛媛',
    '高知',
    '福岡',     // 40
    '佐賀',
    '長崎',
    '熊本',
    '大分',
    '宮崎',
    '鹿児島',
    '沖縄'
];

const pos = [
    118, 6,
    119, 36,
    124, 46,
    123, 56,
    117, 45,
    116, 55,
    116, 64,
    120, 72,
    118, 69,
    111, 70,
    113, 76,
    121, 79,
    114, 80,
    114, 82,
    106, 59,
    99, 69,
    95, 65,
    91, 75
];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

window.onload = () => {
    const images = [];
    for (let i = 0; i < pos.length * 2; i++) {
        images.push(document.getElementById(`p${i + 1}`));
        ctx.drawImage(images[i], pos[i * 2] * 2, pos[i * 2 + 1] * 2, images[i].width * 2, images[i].height * 2);
    }
};
