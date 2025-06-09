function calculate() {
    const pair = document.getElementById('pair').value;
    const capital = parseFloat(document.getElementById('capital').value);
    const conversion = parseFloat(document.getElementById('conversion').value);
    const lotInput = document.getElementById('lot');
    let lot = parseFloat(lotInput.value);
    const entry = parseFloat(document.getElementById('entry').value);
    const tp = parseFloat(document.getElementById('tp').value);
    const sl = parseFloat(document.getElementById('sl').value);
    const targetProfit = parseFloat(document.getElementById('targetProfit').value);

    let autoPips = 0;
    let profitPerLot = 0;
    let generatedLot = null;

    if (!isNaN(entry) && !isNaN(tp)) {
        switch (pair) {
            case "xauusd":
                autoPips = Math.abs(entry - tp) * 10;
                profitPerLot = autoPips * 10;
                break;
            case "eurusd":
            case "gbpusd":
                autoPips = Math.abs(entry - tp) * 10000;
                profitPerLot = autoPips * 10;
                break;
            case "gbpjpy":
                autoPips = Math.abs(entry - tp) * 1000;
                profitPerLot = autoPips * 0.695;
                break;
        }

        // If lot is either empty or was generated earlier, and target profit is given
        if (!isNaN(targetProfit) && profitPerLot) {


            generatedLot = targetProfit / profitPerLot;
            const finalLot = Math.max(0.01, parseFloat(generatedLot.toFixed(2)));
            lotInput.value = finalLot;
            lot = finalLot;



            lotInput.classList.add('generated-lot');

            // Reset + re-trigger animation
            lotInput.classList.remove('lotShake');
            void lotInput.offsetWidth;
            lotInput.classList.add('lotShake');

            lot = parseFloat(generatedLot.toFixed(2));
        } else {
            lotInput.classList.remove('generated-lot');
            lotInput.classList.remove('lotShake');
        }

    }

    let pips = 0;
    let profit = 0;
    let loss = 0;

    const calcPips = (a, b) => Math.abs(a - b);
    const calcRR = () => (!isNaN(tp) && !isNaN(sl)) ? (Math.abs(entry - tp) / Math.abs(entry - sl)).toFixed(1) : '-';

    if (!isNaN(entry)) {
        let priceDiff = 0;
        if (!isNaN(tp)) priceDiff = calcPips(entry, tp);

        switch (pair) {
            case "xauusd":
                pips = priceDiff * 10;
                profit = !isNaN(tp) ? pips * 10 * lot : 0;
                loss = !isNaN(sl) ? calcPips(entry, sl) * 10 * 10 * lot : 0;
                break;
            case "eurusd":
            case "gbpusd":
                pips = priceDiff * 10000;
                profit = !isNaN(tp) ? pips * 10 * lot : 0;
                loss = !isNaN(sl) ? calcPips(entry, sl) * 10000 * 10 * lot : 0;
                break;
            case "gbpjpy":
                pips = priceDiff * 1000;
                profit = !isNaN(tp) ? pips * 0.695 * lot : 0;
                loss = !isNaN(sl) ? calcPips(entry, sl) * 1000 * 0.695 * lot : 0;
                break;
        }
    }

    const rr = calcRR();
    const riskPercent = (loss > 0 && capital > 0) ? ((loss / capital) * 100).toFixed(2) : '-';
    const profitMYR = conversion && profit ? (profit * conversion).toFixed(2) : '-';
    const lossMYR = conversion && loss ? (loss * conversion).toFixed(2) : '-';

    document.getElementById('pips').textContent = Math.round(pips);
    document.getElementById('rr').textContent = rr;
    document.getElementById('profitusd').textContent = profit.toFixed(1);
    document.getElementById('profitmyr').textContent = (conversion && profit ? (profit * conversion).toFixed(1) : '-');
    document.getElementById('lossusd').textContent = loss.toFixed(1);
    document.getElementById('lossmyr').textContent = (conversion && loss ? (loss * conversion).toFixed(1) : '-');
    document.getElementById('riskpercent').textContent = riskPercent + '%';

    const riskClass = riskPercent === '-' ? '' :
        riskPercent <= 10 ? 'risk-blue' :
            riskPercent <= 25 ? 'risk-orange' : 'risk-danger';

    const audioGood = document.getElementById("audioGood");
    const audioCaution = document.getElementById("audioCaution");
    const audioDanger = document.getElementById("audioDanger");
    // update 
    const pipsSpan = document.getElementById('pips');
    const rrSpan = document.getElementById('rr');
    const profitUsdSpan = document.getElementById('profitusd');
    const profitMyrSpan = document.getElementById('profitmyr');
    const lossUsdSpan = document.getElementById('lossusd');
    const lossMyrSpan = document.getElementById('lossmyr');
    const riskPercentSpan = document.getElementById('riskpercent');

    // First, clear all classes and reset animation
    [pipsSpan, rrSpan, profitUsdSpan, profitMyrSpan, lossUsdSpan, lossMyrSpan, riskPercentSpan].forEach(span => {
        span.classList.remove('risk-blue', 'risk-orange', 'risk-danger');
        void span.offsetWidth;
    });

    // Always apply light blue for pips, RR, profit
    [pipsSpan, rrSpan, profitUsdSpan, profitMyrSpan].forEach(span => {
        span.classList.add('risk-blue');
    });

    // Always apply red for loss (in case it's removed elsewhere accidentally)
    lossUsdSpan.classList.add('highlight-red');
    lossMyrSpan.classList.add('highlight-red');

    // Only risk percent uses risk logic
    const numericRisk = parseFloat(riskPercent);
    if (!isNaN(numericRisk)) {
        if (numericRisk <= 10) {
            riskPercentSpan.classList.add('risk-blue');
            audioGood.play();
        } else if (numericRisk <= 25) {
            riskPercentSpan.classList.add('risk-orange');
            audioCaution.play();
        } else {
            riskPercentSpan.classList.add('risk-danger');
            audioDanger.play();
        }
    }


    document.getElementById('resultBox').style.display = 'block';
}

// for background slideshow
const images = ['images/bg1.jpg', 'images/bg2.jpg', 'images/bg3.jpg'];
let currentImage = 0;

function changeBackground() {
    document.body.style.backgroundImage = `url('${images[currentImage]}')`;
    currentImage = (currentImage + 1) % images.length;
}

setInterval(changeBackground, 8000); // Change image every 8 seconds
changeBackground(); // Run once on load

const bgImages = [
    'images/bg1.jpg',
    'images/bg2.jpg',
    'images/bg3.jpg',
    'images/bg4.jpg',
    'images/bg5.jpg',
    'images/bg6.jpg',
    'images/bg7.jpg',
    'images/bg8.jpg'
];

let current = 0;

const slides = document.querySelectorAll('.bg-slide');

// Initialize first image
slides[0].style.backgroundImage = `url(${bgImages[0]})`;
slides[0].classList.add('active');

setInterval(() => {
    const next = (current + 1) % bgImages.length;
    const currentSlide = slides[current % 2];
    const nextSlide = slides[(current + 1) % 2];

    nextSlide.style.backgroundImage = `url(${bgImages[next]})`;

    currentSlide.classList.remove('active');
    nextSlide.classList.add('active');

    current = next;
}, 8000); // Change every 8s
