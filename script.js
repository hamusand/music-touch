// script.js

// グローバル変数の初期化
let isGameRunning = false;
let gameInterval;
let fallingNotes = [];
let scoreNotes = [];
let isPlaying = false;
let playbackIndex = 0;
let playbackTimeout;
let useSolfegeNotation = false;

// 最大同時表示音符数を設定
const MAX_NOTES_ON_SCREEN = 20;

// 音階と周波数のデータ
const notesData = [
    { name: 'C', frequency: 261.63, key: 'q' },
    { name: 'C#', frequency: 277.18, key: 'w' },
    { name: 'Db', frequency: 277.18 , key: 'e' },
    { name: 'D', frequency: 293.66, key: 'r' },
    { name: 'D#', frequency: 311.13 , key: 't' },
    { name: 'Eb', frequency: 311.13 , key: 'y' },
    { name: 'E', frequency: 329.63 , key: 'u' },
    { name: 'F', frequency: 349.23 , key: 'i' },
    { name: 'F#', frequency: 369.99 , key: 'o' },
    { name: 'Gb', frequency: 369.99 , key: 'p' },
    { name: 'G', frequency: 392.00 , key: 'a' },
    { name: 'G#', frequency: 415.30 , key: 's' },
    { name: 'Ab', frequency: 415.30 , key: 'd' },
    { name: 'A', frequency: 440.00 , key: 'f' },
    { name: 'A#', frequency: 466.16 , key: 'g' },
    { name: 'Bb', frequency: 466.16 , key: 'h' },
    { name: 'B', frequency: 493.88 , key: 'j' },
    { name: 'C2', frequency: 523.25 , key: 'k' },
    { name: 'C#2', frequency: 554.37, key: 'l' },
    { name: 'Db2', frequency: 554.37 , key: 'z' },
    { name: 'D2', frequency: 587.33, key: 'x' },
    { name: 'D#2', frequency: 622.25, key: 'c' },
    { name: 'Eb2', frequency: 622.25 , key: 'v' },
    { name: 'E2', frequency: 659.25, key: 'b' },
    { name: 'F2', frequency: 698.46 , key: 'n' },
    { name: 'F#2', frequency: 739.99 , key: 'm' },
    { name: 'Gb2', frequency: 739.99 , key: ',' },
    { name: 'G2', frequency: 783.99 , key: '.' },
    { name: 'G#2', frequency: 830.61 , key: '/' }
];
const solfegeMap = {
    'C': 'ド',
    'C#': 'ド#',
    'Db': 'ド♭',
    'D': 'レ',
    'D#': 'レ#',
    'Eb': 'ミ♭',
    'E': 'ミ',
    'F': 'ファ',
    'F#': 'ファ#',
    'Gb': 'ファ♭',
    'G': 'ソ',
    'G#': 'ソ#',
    'Ab': 'ラ♭',
    'A': 'ラ',
    'A#': 'ラ#',
    'Bb': 'シ♭',
    'B': 'シ',
    'C2': 'ド(高)',
    'C#2': 'ド#(高)',
    'Db2': 'ド♭(高)',
    'D2': 'レ(高)',
    'D#2': 'レ#(高)',
    'Eb2': 'ミ♭(高)',
    'E2': 'ミ(高)',
    'F2': 'ファ(高)',
    'F#2': 'ファ#(高)',
    'Gb2': 'ファ♭(高)',
    'G2': 'ソ(高)',
    'G#2': 'ソ#(高)'
    // 必要に応じてさらに追加 or 修正
};
// 調合ごとの音階リスト
const keySignatures = {
    "Cメジャー": ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C2', 'D2', 'E2', 'F2', 'G2'],
    "Dbメジャー": ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C2', 'Db2', 'Eb2', 'F2', 'Gb2'],
    "Dメジャー": ['C#', 'D', 'E', 'F#', 'G', 'A', 'B', 'C#2', 'D2', 'E2', 'F#2', 'G2'],
    "Ebメジャー": ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb', 'C2', 'D2', 'Eb2', 'F2', 'G2'],
    "Eメジャー": ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B', 'C#2', 'D#2', 'E2', 'F#2', 'G#2'],
    "Fメジャー": ['C', 'D', 'E', 'F', 'G', 'A', 'Bb', 'C2', 'D2', 'E2', 'F2', 'G2'],
    "Gbメジャー": ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db2', 'Eb2', 'F2', 'Gb2'],
    "Gメジャー": ['C', 'D', 'E', 'F#', 'G', 'A', 'B', 'C2', 'D2', 'E2', 'F#2', 'G2'],
    "Abメジャー": ['C', 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb', 'C2', 'Db2', 'Eb2', 'F2', 'G2'],
    "Aメジャー": ['C#', 'D', 'E', 'F#', 'G#', 'A', 'B', 'C#2', 'D2', 'E2', 'F#2', 'G#2'],
    "Bbメジャー": ['C', 'D', 'Eb', 'F', 'G', 'A', 'Bb', 'C2', 'D2', 'Eb2', 'F2', 'G2'],
    "Bメジャー": ['C#', 'D#', 'E', 'F#', 'G#', 'A#', 'B', 'C#2', 'D#2', 'E2', 'F#2', 'G#2'],
    "無調": ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B', 'C2', 'C#2', 'Db2', 'D2', 'D#2', 'Eb2', 'E2', 'F2', 'F#2', 'Gb2', 'G2', 'G#2']
};

// 選択された調合を追跡する変数
let selectedKeySignature = 'Cメジャー'; // デフォルトはCメジャー

// 調合の変更を検知するイベントリスナーを追加
document.getElementById('key-signature-select').addEventListener('change', (event) => {
    selectedKeySignature = event.target.value;
    console.log(`Key signature changed to: ${selectedKeySignature}`);
});

// 音符の長さと画像
const durations = [
    { name: '二分音符', value: 2.0, image: '二分音符.png', isRest: false },
    { name: '付点四分音符', value: 1.5, image: '付点四分音符.png', isRest: false },
    { name: '四分音符', value: 1.0, image: '四分音符.png', isRest: false },
    { name: '付点八分音符', value: 0.75, image: '付点八分音符.png', isRest: false },
    { name: '八分音符', value: 0.5, image: '八分音符.png', isRest: false },
    { name: '十六分音符', value: 0.25, image: '十六分音符.png', isRest: false },
    
    // 休符
    { name: '四分休符', value: 1.0, image: '四分休符.png', isRest: true },
    { name: '八分休符', value: 0.5, image: '八分休符.png', isRest: true },
    { name: '十六分休符', value: 0.25, image: '十六分休符.png', isRest: true }
];

// 音符の重みを設定（整数で定義）
const noteWeights = {
    '二分音符': 8,
    '付点四分音符': 6,
    '四分音符': 4,
    '四分休符': 4,
    '付点八分音符': 3,
    '八分音符': 2,
    '八分休符': 2,
    '十六分音符': 1,
    '十六分休符': 1
};

// 拍子関連の変数
let currentTimeSignature = '4/4'; // デフォルトは4/4
let measureTotal = 16; // 初期値を適切に設定

// 現在の小節の重みの合計を追跡
let currentMeasureWeight = 0; // 整数で初期化

// 拍子選択ボタンのイベントリスナーを追加
const timeSignatureButtons = document.querySelectorAll('.time-signature-button');

function updateTimeSignature(timeSignature) {
    currentTimeSignature = timeSignature;
    switch (currentTimeSignature) {
        case '4/4':
            measureTotal = 16; // 16分音符 x 16
            break;
        case '3/4':
            measureTotal = 12; // 16分音符 x 12
            break;
        case '6/8':
            measureTotal = 12; // 16分音符 x 12
            break;
        default:
            measureTotal = 16;
    }
    console.log(`Time signature set to: ${currentTimeSignature}`);
    // 拍子画像を更新
    document.getElementById('time-signature-image').src = `${currentTimeSignature.replace('/', '_')}.png`;
    // 楽譜をリセット
    deleteScore();
}

timeSignatureButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 全てのボタンから 'selected' クラスを削除
        timeSignatureButtons.forEach(btn => btn.classList.remove('selected'));
        // クリックされたボタンに 'selected' クラスを追加
        button.classList.add('selected');
        // 選択された拍子を取得
        const timeSignature = button.getAttribute('data-time');
        updateTimeSignature(timeSignature);
    });
});

// 初期状態で最初のボタンを選択状態にする
timeSignatureButtons[0].classList.add('selected');
const initialTimeSignature = timeSignatureButtons[0].getAttribute('data-time');
updateTimeSignature(initialTimeSignature);


// 音の種類セクションと同様、音名表記切り替えラジオボタンにイベントを付与
const notationSwitchRadios = document.querySelectorAll('input[name="notation-switch"]');
notationSwitchRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (radio.value === 'solfege') {
            useSolfegeNotation = true;
        } else {
            useSolfegeNotation = false;
        }
        console.log(`Notation switched to: ${useSolfegeNotation ? 'ドレミ' : '英語'}`);
    });
});

// 音階ごとの色を設定（共感覚に合わせて修正）
const noteColors = {
    'C': '#FF0000',
    'C#': '#FF7F00',
    'Db': '#FF7F00',
    'D': '#FFFF00',
    'D#': '#7FFF00',
    'Eb': '#7FFF00',
    'E': '#00FF00',
    'F': '#00FF7F',
    'F#': '#00FFFF',
    'Gb': '#00FFFF',
    'G': '#007FFF',
    'G#': '#0000FF',
    'Ab': '#0000FF',
    'A': '#7F00FF',
    'A#': '#FF00FF',
    'Bb': '#FF00FF',
    'B': '#FF007F',
    'C2': '#FF0000',
    'C#2': '#FF7F00',
    'Db2': '#FF7F00',
    'D2': '#FFFF00',
    'D#2': '#7FFF00',
    'Eb2': '#7FFF00',
    'E2': '#00FF00',
    'F2': '#00FF7F',
    'F#2': '#00FFFF',
    'Gb2': '#00FFFF',
    'G2': '#007FFF',
    'G#2': '#0000FF'
};

// 音セットの定義
const soundSets = {
    new: { // 継続音
        waveType: 'sine'
    },
    retro: { // レトロ音
        waveType: 'square'
    },
    classic: { // クラシック音
        waveType: 'triangle'
    },
    electro: { // エレクトロ音
        waveType: 'sawtooth'
    },
    jazz: { // ジャズ音
        waveType: 'custom' // カスタム波形を使用
    }
};

// 現在選択されている音セット
let currentSoundSet = 'new'; // デフォルトは継続音

// 音階ごとの位置を定義
const notePositions = {
    'C': 32,
    'C#': 32,
    'Db': 22,
    'D': 22,
    'D#': 22,
    'Eb': 7,
    'E': 7,
    'F': -9,
    'F#': -9,
    'Gb': -24,
    'G': -24,
    'G#': -24,
    'Ab': -41,
    'A': -41,
    'A#': -41,
    'Bb': 52,
    'B': 52,
    'C2': 37,
    'C#2': 37,
    'Db2': 20,
    'D2': 20,
    'D#2': 20,
    'Eb2': 6,
    'E2': 6,
    'F2': -11,
    'F#2': -11,
    'Gb2': -25,
    'G2': -25,
    'G#2': -25
};

// シャープ・フラットの位置を個別に定義
const accidentalPositions = {
    'C#': notePositions['C#'] - 7,
    'Db': notePositions['Db'] + 7,
    'D#': notePositions['D#'] + 1,
    'Eb': notePositions['Eb'] + 20,
    'F#': notePositions['F#'] + 32,
    'Gb': notePositions['Gb'] + 51,
    'G#': notePositions['G#'] + 45,
    'Ab': notePositions['Ab'] + 70,
    'A#': notePositions['A#'] + 63,
    'Bb': notePositions['Bb'] - 130,
    'C#2': notePositions['C#2'] - 123,
    'Db2': notePositions['Db2'] - 100,
    'D#2': notePositions['D#2'] - 105,
    'Eb2': notePositions['Eb2'] - 88,
    'F#2': notePositions['F#2'] - 75,
    'Gb2': notePositions['Gb2'] - 55,
    'G#2': notePositions['G#2'] - 60
};
// 音符の間隔を定義（単位は基準間隔の倍数）
const noteSpacings = {
    '二分音符': 6,
    '付点四分音符': 5,
    '四分音符': 4,
    '四分休符': 4,
    '付点八分音符': 3,
    '八分音符': 2,
    '八分休符': 2,
    '十六分音符': 2,
    '十六分休符': 2
};
// グローバル変数としてAudio関連のオブジェクトを定義
let audioCtx;
let masterGainNode;

// AudioContextの初期化（ユーザー操作で呼び出す）
function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGainNode = audioCtx.createGain();
        masterGainNode.connect(audioCtx.destination);
        console.log('AudioContext initialized.');
    }
}
// グローバル変数として降下速度の調整値を追加
let speedAdjustment = 5; // デフォルト値は5（現在の速度）

// イベントリスナーの設定
document.getElementById('start-button').addEventListener('click', () => {
    initAudioContext();
    startGame();
});
document.getElementById('stop-button').addEventListener('click', stopGame);
document.getElementById('play-pause-button').addEventListener('click', togglePlayPause);
document.getElementById('delete-button').addEventListener('click', deleteScore);

// 設定モーダルの処理
const settingsButton = document.getElementById('settings-button');
const settingsModal = document.getElementById('settings-modal');
const closeButton = document.querySelector('.close-button');

// 開く
settingsButton.addEventListener('click', () => {
    settingsModal.style.display = 'block';
});

// 閉じる
closeButton.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

// モーダル外クリックで閉じる
window.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
});

// 音の種類セクションのイベントリスナー
const soundSetRadios = document.querySelectorAll('input[name="sound-set"]');

soundSetRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        currentSoundSet = radio.value;
        console.log(`Sound set changed to: ${currentSoundSet}`);
    });
});

// 降下速度のスライダーのイベントリスナーを追加
const speedSlider = document.getElementById('speed-slider');
const speedValueLabel = document.getElementById('speed-value');

speedSlider.addEventListener('input', () => {
    speedAdjustment = parseInt(speedSlider.value);
    speedValueLabel.textContent = speedAdjustment;
    console.log(`Speed adjustment changed to: ${speedAdjustment}`);
});

// 背景画像セクションのイベントリスナー
const backgroundThumbnails = document.querySelectorAll('.background-thumbnail');

backgroundThumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        // 全てのサムネイルから 'selected' クラスを削除
        backgroundThumbnails.forEach(img => img.classList.remove('selected'));
        // クリックされたサムネイルに 'selected' クラスを追加
        thumbnail.classList.add('selected');
        // ゲームエリアの背景画像を変更
        const bgImage = thumbnail.getAttribute('data-bg');
        document.getElementById('game-area').style.backgroundImage = `url('${bgImage}')`;
        console.log(`Background changed to: ${bgImage}`);
    });
});
// window.currentScoreWidth の初期化
window.currentScoreWidth = 20;

// 重み付きランダム選択関数の修正
function weightedRandomChoice(items) {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const normalizedItems = items.map(item => ({
        value: item.value,
        weight: item.weight / totalWeight
    }));
    let random = Math.random();
    for (let item of normalizedItems) {
        if (random < item.weight) {
            return item.value;
        }
        random -= item.weight;
    }
    // デフォルト値（安全策）
    return normalizedItems[0].value;
}

// 音符の縦位置を取得する関数を追加
function getNotePosition(noteName) {
    return notePositions[noteName] || 0; // 定義されていない場合は0を返す
}

// 重みの合計に対応する音符・休符の種類を取得する関数
function getAllowedDurations(remainingWeight) {
    const durationsList = [];

    if (remainingWeight >= 8) durationsList.push('二分音符');
    if (remainingWeight >= 6) durationsList.push('付点四分音符');
    if (remainingWeight >= 4) durationsList.push('四分音符', '四分休符');
    if (remainingWeight >= 3) durationsList.push('付点八分音符');
    if (remainingWeight >= 2) durationsList.push('八分音符', '八分休符');
    if (remainingWeight >= 1) durationsList.push('十六分音符', '十六分休符');

    return durationsList;
}

// 落下する音符の生成関数
function createFallingNote() {
    console.log('Creating falling note.');

    const inKeyNotes = keySignatures[selectedKeySignature];
    const allNotes = notesData.map(n => n.name);
    const outOfKeyNotes = allNotes.filter(n => !inKeyNotes.includes(n));

    const N_in = inKeyNotes.length;
    const N_out = outOfKeyNotes.length;

    // 望む出現確率
    const desired_inKey_probability = 0.72; // 調合内の音符の望む確率（例として72%）
    const desired_outOfKey_probability = 0.08; // 調合外の音符の望む確率（8%）
    const desired_rest_probability = 0.20; // 休符の望む確率（20%）

    const totalDesiredProbability = desired_inKey_probability + desired_outOfKey_probability + desired_rest_probability;

    // 調合内の音符、調合外の音符、休符それぞれの重みを計算
    const w_in = (desired_inKey_probability / N_in) / totalDesiredProbability;
    const w_out = (desired_outOfKey_probability / N_out) / totalDesiredProbability;
    const w_rest = desired_rest_probability / totalDesiredProbability;

    // 重みをスケーリング（整数にするため）
    const scaleFactor = 1000;
    const weight_in = w_in * scaleFactor;
    const weight_out = w_out * scaleFactor;
    const weight_rest = w_rest * scaleFactor;

    // 音符プールを作成
    const notePoolWithWeights = [];

    inKeyNotes.forEach(noteName => {
        notePoolWithWeights.push({ value: noteName, weight: weight_in });
    });

    outOfKeyNotes.forEach(noteName => {
        notePoolWithWeights.push({ value: noteName, weight: weight_out });
    });

    // 休符を音符プールに追加
    notePoolWithWeights.push({ value: '休符', weight: weight_rest });

    // selectedNoteName を定義
    const selectedNoteName = weightedRandomChoice(notePoolWithWeights);

    let note;
    let isRestNote = false;

    if (selectedNoteName === '休符') {
        isRestNote = true;
        note = { name: '休符', frequency: null };
    } else {
        note = notesData.find(n => n.name === selectedNoteName);
    }

    // 音符コンテナを作成
    const noteContainer = document.createElement('div');
    noteContainer.classList.add('circle-note');

    // ランダムな左位置を設定
    const gameAreaWidth = document.getElementById('game-area').clientWidth;
    const noteWidth = 100; // CSSで設定したwidth (.circle-note の width)
    const maxLeft = gameAreaWidth - noteWidth;
    const positionX = Math.floor(Math.random() * maxLeft);
    noteContainer.style.left = `${positionX}px`;
    noteContainer.style.top = `-100px`; // 初期位置を画面上部の外に設定

    // 音符名をテキストで表示
    noteContainer.textContent = isRestNote ? '休' : note.name; // 休符の場合は '休' と表示
    if (!isRestNote && useSolfegeNotation && solfegeMap[note.name]) {
        noteContainer.textContent = solfegeMap[note.name];
   }
    noteContainer.style.fontSize = '1.2em';
    noteContainer.style.color = '#FFFFFF';

    // 背景色を設定
    if (isRestNote) {
        noteContainer.style.background = getGlossyBackground('#777777'); // 休符は灰色
    } else {
        noteContainer.style.background = getGlossyBackground(noteColors[note.name]);
    }

    // アニメーションの設定（ユーザーの設定に応じて速度を調整）
    const baseSpeed = 5; // 基本速度（現在の速度を5とする）
    const speedRange = 3; // 速度の変動幅

    // ユーザーの調整値に基づいて速度を計算
    const speedFactor = speedAdjustment / 5; // スライダーの値を正規化（1が最も遅く、10が最も速い）
    const speed = (baseSpeed / speedFactor) + (Math.random() * speedRange / speedFactor);

    noteContainer.style.animationDuration = `${speed}s`;

    // アニメーションを開始
    document.getElementById('game-area').appendChild(noteContainer);
    requestAnimationFrame(() => {
        noteContainer.classList.add('falling');
    });

    // 落下中の音符として管理
    const fallingNote = {
        element: noteContainer,
        note: note,
        isRest: isRestNote
    };
    fallingNotes.push(fallingNote);

    // アニメーション終了時に要素を削除
    noteContainer.addEventListener('animationend', () => {
        noteContainer.remove();
        fallingNotes = fallingNotes.filter(n => n !== fallingNote);
    });

    // クリックイベントの設定
    noteContainer.addEventListener('click', () => {
        console.log(`Note clicked: ${note.name}`);

        // 現在の持ちスコアに基づいて残りの重みを計算
        let remainingWeight = measureTotal - currentMeasureWeight;

        // 許可された音符・休符の種類を取得
        let allowedDurationNames = getAllowedDurations(remainingWeight);

        // 音符・休符の種類をフィルタリング
        let durationOptions = durations.filter(d => {
            return allowedDurationNames.includes(d.name) && d.isRest === isRestNote;
        });

        // 選択可能な音符がない場合、小節線を描画して小節をリセット
        if (durationOptions.length === 0) {
            drawMeasureLine();
            currentMeasureWeight = 0;
            remainingWeight = measureTotal;
            allowedDurationNames = getAllowedDurations(remainingWeight);
            durationOptions = durations.filter(d => {
                return allowedDurationNames.includes(d.name) && d.isRest === isRestNote;
            });
        }

        // 音符の長さをランダムに選択
        const duration = durationOptions[Math.floor(Math.random() * durationOptions.length)];

        // 音符を楽譜に追加し、小節の重みを更新
        addNoteToScore(note, duration, isRestNote);

        // 音の再生（非同期的に行われる）
        if (!isRestNote) {
            playSoundUsingSet(note.frequency, duration.value);
        }

        // クリックアニメーションを追加
        noteContainer.classList.add('clicked');
        setTimeout(() => {
            // 音符を削除
            noteContainer.remove();
            // fallingNotesから削除
            fallingNotes = fallingNotes.filter(n => n !== fallingNote);
        }, 200);
    });
}

function addNoteToScore(note, duration, isRest) {
    console.log(`Adding note to score: ${note.name}`);

    // シャープやフラットのスペースを定義
    const accidentalSpacing = 40; // シャープやフラットの幅に応じて調整

    // 音符間の間隔を音符の長さに応じて調整
    const baseSpacing = 40; // 既存の値を使用
    let noteSpacingMultiplier = noteSpacings[duration.name]; // 間隔マルチプライヤ

    // 音符のスペースを計算
    let noteSpacing = baseSpacing * noteSpacingMultiplier;

    // シャープやフラットがある場合、音符の x 位置とスペースを調整
    let hasAccidental = !isRest && (note.name.includes('#') || note.name.includes('b'));
    let accidentalAdjustment = hasAccidental ? accidentalSpacing : 0;

    // 音符コンテナを作成
    const noteContainer = document.createElement('div');
    noteContainer.classList.add('note-container');
    // 音符の左位置を調整
    noteContainer.style.left = (window.currentScoreWidth + accidentalAdjustment) + 'px';
    noteContainer.style.top = '0px';
    noteContainer.style.position = 'absolute';

    // 音符画像を選択
    let noteImageSrc;
    if (isRest) {
        noteImageSrc = duration.image;
    } else {
        noteImageSrc = getNoteImage(note.name, duration.name, duration.image);
    }
    console.log(`Selected image for ${note.name}: ${noteImageSrc}`);

    // 音符画像を作成
    const noteImg = document.createElement('img');
    noteImg.src = noteImageSrc;
    noteImg.classList.add('note');
    noteImg.alt = isRest ? '休符' : `${note.name} 音符`;

    // シャープやフラットの処理
    let accidentalImg = null;
    if (hasAccidental) {
        accidentalImg = document.createElement('img');
        if (note.name.includes('#')) {
            accidentalImg.src = 'シャープ.png';
            accidentalImg.classList.add('accidental-sharp');
            accidentalImg.alt = 'シャープ';
        } else {
            accidentalImg.src = 'フラット.png';
            accidentalImg.classList.add('accidental-flat');
            accidentalImg.alt = 'フラット';
        }
        accidentalImg.style.top = accidentalPositions[note.name] + 'px';
        // シャープやフラットの左位置を調整
        accidentalImg.style.position = 'absolute';
        accidentalImg.style.left = (-accidentalAdjustment) + 'px'; // 音符の左に配置
    }

    // 音符コンテナに画像を追加
    if (accidentalImg) {
        noteContainer.appendChild(accidentalImg);
    }
    noteContainer.appendChild(noteImg);

    // 縦位置の調整
    if (!isRest) {
        noteContainer.style.transform = `translateY(${getNotePosition(note.name)}px)`;
    } else {
        noteContainer.style.transform = 'translateY(0px)';
    }

    // 楽譜エリアに音符コンテナを追加
    document.getElementById('notes-container').appendChild(noteContainer);

    // 総幅を更新
    window.currentScoreWidth += noteSpacing + accidentalAdjustment;

    // 楽譜を配列に追加
    scoreNotes.push({
        note: note,
        duration: duration,
        element: noteContainer,
        isRest: isRest
    });

    // 小節の重みを更新（音符追加後に行う）
    currentMeasureWeight += noteWeights[duration.name];

    // 小節が完了したか確認し、必要なら小節線を描画
    if (currentMeasureWeight === measureTotal) {
        drawMeasureLine();
        currentMeasureWeight = 0;
    }
}

// 持ちスコアに応じた許可された音符・休符を取得する関数
function getAllowedDurations(remainingWeight) {
    const durationsList = [];

    if (remainingWeight >= 8) durationsList.push('二分音符');
    if (remainingWeight >= 6) durationsList.push('付点四分音符');
    if (remainingWeight >= 4) durationsList.push('四分音符', '四分休符');
    if (remainingWeight >= 3) durationsList.push('付点八分音符');
    if (remainingWeight >= 2) durationsList.push('八分音符', '八分休符');
    if (remainingWeight >= 1) durationsList.push('十六分音符', '十六分休符');

    return durationsList;
}

function drawMeasureLine() {
    const notesContainer = document.getElementById('notes-container');

    // 線画像の作成
    const lineImg = document.createElement('img');
    lineImg.src = '線.png';
    lineImg.classList.add('measure-line');
    lineImg.style.position = 'absolute';

    // 最後の音符を取得
    const lastNote = scoreNotes[scoreNotes.length - 1];

    // 最後の音符の位置と幅を取得
    const lastNoteElement = lastNote.element;
    const lastNoteLeft = parseFloat(lastNoteElement.style.left);
    const lastNoteWidth = lastNoteElement.offsetWidth;

    // 線の位置を計算（最後の音符の左位置 + 音符の幅）
    const linePosition = lastNoteLeft + lastNoteWidth;

    lineImg.style.left = `${linePosition}px`;
    lineImg.style.top = '0px';

    // 線を notesContainer に追加
    notesContainer.appendChild(lineImg);

    // 小節線の幅を取得
    let lineWidth = lineImg.offsetWidth;

    // 画像がまだロードされていない場合の対策
    if (lineWidth === 0) {
        // 線.png の実際の幅を設定（例として2px）
        lineWidth = 2; // 必要に応じて調整してください
    }

    // 線が描画された後に追加する間隔を減らす
    const extraSpacing = 0; // 余白を小さく設定

    // window.currentScoreWidth を更新
    window.currentScoreWidth = linePosition + lineWidth + extraSpacing;

    console.log('Measure line drawn at position:', window.currentScoreWidth);
}

// 音を再生する関数（音セットに基づいて再生）
function playSoundUsingSet(frequency, duration) {
    if (!audioCtx) return;
    try {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        // 音セットに応じて波形を変更
        const soundSet = soundSets[currentSoundSet];
        if (soundSet.waveType === 'custom') {
            // ジャズ音用のカスタム波形を設定（例）
            const bufferSize = audioCtx.sampleRate;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.sin(2 * Math.PI * frequency * i / audioCtx.sampleRate) * (1 - i / bufferSize); // フェードアウト
            }
            const waveShaper = audioCtx.createWaveShaper();
            waveShaper.buffer = buffer;
            oscillator.connect(waveShaper);
            waveShaper.connect(gainNode);
        } else {
            oscillator.type = soundSet.waveType;
            oscillator.frequency.value = frequency;
            oscillator.connect(gainNode);
        }
        gainNode.connect(masterGainNode);
        gainNode.gain.setValueAtTime(1, audioCtx.currentTime); // 音量を最大に設定
        oscillator.start();

        // すべての音セットで指定された期間だけ再生
        oscillator.stop(audioCtx.currentTime + duration);

        // 再生終了後にノードを解放
        oscillator.onended = () => {
            oscillator.disconnect();
            gainNode.disconnect();
            console.log(`Sound ended: ${frequency} Hz`);
        };
    } catch (error) {
        console.error('Error in playSound:', error);
    }
}

// 光沢感のある背景を生成する関数
function getGlossyBackground(color) {
    return `radial-gradient(circle at top left, #ffffff, ${color})`;
}

// 楽譜を削除する関数（小節線も削除）
function deleteScore() {
    console.log('Deleting score.');
    scoreNotes.forEach(noteData => {
        noteData.element.remove();
    });
    scoreNotes = [];
    window.currentScoreWidth = 20; // 総幅をリセット
    // 小節線も削除
    const measureLines = document.querySelectorAll('.measure-line');
    measureLines.forEach(line => line.remove());
    // 小節の重みをリセット
    currentMeasureWeight = 0;
}

// ゲーム開始関数
function startGame() {
    if (isGameRunning) return;
    isGameRunning = true;
    console.log('Game started.');
    gameInterval = setInterval(() => {
        if (fallingNotes.length < MAX_NOTES_ON_SCREEN) {
            createFallingNote();
        }
    }, 500); // 0.5秒ごとに音符を生成
}

// ゲーム停止関数
function stopGame() {
    if (!isGameRunning) return;
    isGameRunning = false;
    clearInterval(gameInterval);
    console.log('Game stopped.');
    // 既存の落下中の音符を削除
    fallingNotes.forEach(note => {
        note.element.remove();
    });
    fallingNotes = [];
}

// 再生/一時停止ボタンの切り替え
function togglePlayPause() {
    if (isPlaying) {
        pausePlayback();
    } else {
        startPlayback();
    }
}

// 再生の開始
function startPlayback() {
    if (scoreNotes.length === 0) return;
    isPlaying = true;
    playbackIndex = 0;
    console.log('Playback started.');
    playNextNote();
}

// 次の音符を再生
function playNextNote() {
    if (!isPlaying || playbackIndex >= scoreNotes.length) {
        isPlaying = false;
        playbackIndex = 0;
        console.log('Playback finished.');
        return;
    }
    const noteData = scoreNotes[playbackIndex];
    if (noteData.isRest) {
        playbackTimeout = setTimeout(() => {
            playbackIndex++;
            playNextNote();
        }, noteData.duration.value * 1000);
    } else {
        playSoundUsingSet(noteData.note.frequency, noteData.duration.value);
        playbackTimeout = setTimeout(() => {
            playbackIndex++;
            playNextNote();
        }, noteData.duration.value * 1000);
    }
}

// 再生の一時停止
function pausePlayback() {
    isPlaying = false;
    clearTimeout(playbackTimeout);
    console.log('Playback paused.');
}

// キーボード入力で音符を追加するイベントリスナー
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();

    // 1. スペースキーによる再生/一時停止の追加
    if (key === ' ') {
       // スペースキーが押されたら、再生/一時停止をトグル
        event.preventDefault(); // ページのスクロールなどを防ぐ
        togglePlayPause();
        return;
    }
    if (key === 'delete' || key === 'backspace') {
        event.preventDefault(); // 画面スクロールなどの既定動作を防ぐ
        removeLastNote();
        return; // 処理終了
        }
    
    // フォーカスがボタンや入力フィールドにある場合は無視
    if (['input', 'textarea', 'button'].includes(event.target.tagName.toLowerCase())) {
        return;
    }
    const noteData = notesData.find(n => n.key === key);
    if (noteData) {
        // AudioContextを初期化
        initAudioContext();
        // デフォルトの音符の長さを設定（例：四分音符）
        const duration = durations.find(d => d.name === '四分音符' && !d.isRest);
        addNoteToScore(noteData, duration, false);
        playSoundUsingSet(noteData.frequency, duration.value);
        console.log(`Key pressed: ${key}, Note added: ${noteData.name}`);
    }
});

// 音符画像を取得する関数（簡略化版）
function getNoteImage(noteName, durationName, durationImage) {
    let imageName;

    // 高音域の音符に対して逆向きの音符画像を使用
    const highNotes = ['B', 'Bb', 'C2', 'C#2', 'Db2', 'D2', 'D#2', 'Eb2', 'E2', 'F2', 'F#2', 'Gb2', 'G2', 'G#2'];

    if (noteName === 'C' || noteName === 'C#') {
        // C系音符の画像
        imageName = `${durationName}ド.png`;
    } else if (highNotes.includes(noteName)) {
        // 高音域の音符の逆向き画像
        imageName = `${durationName}逆.png`;
    } else {
        // それ以外の音符はデフォルトの画像
        imageName = durationImage;
    }

    return imageName;
}
// script.js の下部あたりに追加してください

/**
 * 直前に追加された音符（scoreNotesの最後の要素）を取り消す関数
 * キーボードのDeleteキーまたはBackspaceキーが押されたら呼び出す
 */
function removeLastNote() {
    if (scoreNotes.length === 0) {
        return; // 何も音符が無い場合は処理しない
    }

    // 最後に追加された音符（または休符）
    const lastNoteData = scoreNotes.pop();

    // 音符の要素を削除
    if (lastNoteData.element) {
        lastNoteData.element.remove();
    }

    // 音符の重みを小節の重みに戻す
    const weight = noteWeights[lastNoteData.duration.name];
    currentMeasureWeight -= weight;

    // もし currentMeasureWeight が負になったら、小節線も引き直しが必要
    // 例: 小節がちょうど終わって線を描画した後に、その音符を取り消す場合
    if (currentMeasureWeight < 0) {
        // 小節1つ分戻す
        currentMeasureWeight += measureTotal;

        // 小節線が引かれている場合は消す（最後に描画された線を削除）
        const measureLines = document.querySelectorAll('.measure-line');
        if (measureLines.length > 0) {
            measureLines[measureLines.length - 1].remove();
        }
    }

    // 描画幅 (window.currentScoreWidth) の再計算
    // もっと正確に行う場合は、今あるscoreNotes全体を再配置し直すほうが確実
    // 簡易的には下記のように最後の note を取り除いた位置に戻す
    if (scoreNotes.length === 0) {
        // 全部無くなった場合は初期化
        window.currentScoreWidth = 20;
    } else {
        // 残っている最後の音符の位置 + 音符幅を計算
        const newLastNote = scoreNotes[scoreNotes.length - 1];
        const lastNoteElement = newLastNote.element;
        const lastNoteLeft = parseFloat(lastNoteElement.style.left) || 20;
        const lastNoteWidth = lastNoteElement.offsetWidth || 255;
        window.currentScoreWidth = lastNoteLeft + lastNoteWidth;
    }

    console.log('Removed last note.');
}
