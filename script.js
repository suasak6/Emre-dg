// ----------------- Sayfa geçişleri -----------------
function nextPage(current) {
    const currentPage = document.getElementById(`page${current}`);
    if (currentPage) currentPage.classList.remove('active');

    const next = current + 1;

    if (next <= 25) {
        const nextPage = document.getElementById(`page${next}`);
        if (nextPage) nextPage.classList.add('active');
    } else {
        const cakePage = document.getElementById('cake');
        if (cakePage) {
            cakePage.classList.add('active');

            // Mikrofonu yalnızca pasta sayfasında başlat
            initBlowDetection();
        }
    }
}

// ----------------- Mumları söndürme -----------------
function blowOutCandles() {
    const activePage = document.querySelector('.active');
const candles = activePage ? activePage.querySelectorAll('.mini-candle, .candle') : [];
    
candles.forEach(candle => candle.classList.add('snatched'));

    // Konfeti patlat
    launchConfetti(200);

    // Büyük pasta mı?
    const cake = document.getElementById('cake');

    if (cake && cake.classList.contains('active')) {
        const smoke = document.createElement('div');
        smoke.classList.add('smoke');

        smoke.style.position = 'absolute';
        smoke.style.top = '20px';
        smoke.style.left = '50%';
        smoke.style.transform = 'translateX(-50%)';
        smoke.style.zIndex = '50';

        cake.appendChild(smoke);

        setTimeout(() => smoke.remove(), 2500);

        setTimeout(() => {
            document.getElementById('cake').classList.remove('active');
            document.getElementById('page8').classList.add('active');
        }, 3000);
    }
}




// ----------------- Konfeti fonksiyonu -----------------
function launchConfetti(count) {
    const cake = document.getElementById('cake');
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');

        // Rastgele pozisyon, dönüş ve boyut
        const xMove = (Math.random() - 0.5) * 200;
        const rotation = Math.random() * 720;
        const startX = Math.random() * 90;
        const size = 5 + Math.random() * 6;

        confetti.style.setProperty('--x', xMove + 'px');
        confetti.style.setProperty('--rot', rotation + 'deg');
        confetti.style.left = startX + 'vw';
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';
        confetti.style.backgroundColor = `hsl(${Math.random()*360}, 80%, 60%)`;
        confetti.style.animationDuration = 2 + Math.random() * 1.5 + 's';

        cake.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3500);
    }
}

// ----------------- Mikrofon ile üfleme -----------------
let microphoneStarted = false; // sadece bir kez başlat

async function initBlowDetection() {
    if (microphoneStarted) return; // zaten başladıysa tekrar başlatma
    microphoneStarted = true;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function detectBlow() {
            analyser.getByteTimeDomainData(dataArray);

            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                const value = (dataArray[i] - 128) / 128;
                sum += value * value;
            }
            const rms = Math.sqrt(sum / dataArray.length);

            if (rms > 0.20) { // üfleme eşik değeri
                blowOutCandles(); // mumları söndür
            }

            requestAnimationFrame(detectBlow);
        }

        detectBlow();
    } catch (err) {
        console.error('Mikrofon erişimi reddedildi veya desteklenmiyor.', err);
    }
}


function createMiniCake() {
    const cake = document.createElement("div");
    cake.className = "mini-cake";

    cake.innerHTML = `
         <div class="mini-cake">
    <div class="mini-cake-bottom">
        <div class="mini-cake-top"></div>

        <div class="mini-cake-bottom-oval"></div>

        <div class="minik_damlalar_bottom">
                <div class="minik_damla_bottom" style="left: 0.00001%; width:50px; height:30px;"></div>
                <div class="minik_damla_bottom" style="left: 37%; width:50px; height:40px;"></div>
                <div class="minik_damla_bottom" style="left:65%; width:60px; height:40px;"></div>
                <div class="minik_damla_bottom" style="left:108%; width:49px; height:30px;"></div> 
            </div>

        <div class="mini-cake-sprinkles">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
        <div class="mini-cake-candles">
            <div class="mini-candle"></div>
            <div class="mini-candle"></div>
            <div class="mini-candle"></div>
        </div>

    <div class="mini-cake-top-layer">
        <div class="mini-cake-top-layer-top"></div>
        

        <div class="mini-cake-top-layer-oval"></div>

        <div class="minik_damlalar_top">
                <div class="minik_damla_top" style="left: 0.00001%; width:35px; height:25px;"></div>
                <div class="minik_damla_top" style="left: 40%; width:40px; height:30px;"></div>
                <div class="minik_damla_top" style="left:100%; width:40px; height:25px;"></div>
                <div class="minik_damla_top" style="left:150%; width:30px; height:25px;"></div> 
            </div>

            <div class="mini-top-sprinkles">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

    </div>
    `;

    return cake;
}

// ================================
// KÜÇÜK PASTALARI SAYFALARA EKLE
// ================================

for (let i = 1; i <= 25; i++) {

    const container = document.querySelector(
        `#page${i} .mini-cake-container`
    );

    if (container) {
        container.appendChild(createMiniCake());
    }
}

// Minik pastalarda da mikrofonu başlat
initBlowDetection();