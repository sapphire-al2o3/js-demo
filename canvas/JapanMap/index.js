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
    119, 36
];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

window.onload = () => {
    const images = [];
    for (let i = 0; i < prefectures.length; i++) {
        images.push(document.getElementById(`p${i + 1}`));
    }

    ctx.drawImage(images[0], pos[0] * 2, pos[1] * 2, images[0].width * 2, images[0].height * 2);
    ctx.drawImage(images[1], pos[2] * 2, pos[3] * 2, images[1].width * 2, images[1].height * 2);
};
