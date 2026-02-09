// Select keyboard mapping based on page level
const currentLevel = (document.body && document.body.dataset && document.body.dataset.level === '2') ? 2 : 1;

function getKeyboardMap(level) {
    // Common punctuation mapping
    const punctuation = {
        ' ': ' ', '.': '.', ',': ',', '!': '!', '?': '?',
        "'": "'", '"': '"', ';': ';', ':': ':', '-': '-', '(': '(', ')': ')'
    };

    if (level === 2) {
        // Level 2: shuffled mapping (fixed, non-reversed)
        const level2Map = {
            'a': 'q', 'b': 'm', 'c': 'l', 'd': 'a', 'e': 'k',
            'f': 'z', 'g': 'p', 'h': 's', 'i': 'd', 'j': 'f',
            'k': 'g', 'l': 'h', 'm': 'j', 'n': 'w', 'o': 'e',
            'p': 'r', 'q': 't', 'r': 'y', 's': 'u', 't': 'i',
            'u': 'o', 'v': 'b', 'w': 'c', 'x': 'n', 'y': 'v',
            'z': 'x'
        };
        return { ...level2Map, ...punctuation };
    }

    // Level 1: reversed mapping (default)
    const level1Map = {
        'a': 'z', 'b': 'y', 'c': 'x', 'd': 'w', 'e': 'v',
        'f': 'u', 'g': 't', 'h': 's', 'i': 'r', 'j': 'q',
        'k': 'p', 'l': 'o', 'm': 'n', 'n': 'm', 'o': 'l',
        'p': 'k', 'q': 'j', 'r': 'i', 's': 'h', 't': 'g',
        'u': 'f', 'v': 'e', 'w': 'd', 'x': 'c', 'y': 'b',
        'z': 'a'
    };
    return { ...level1Map, ...punctuation };
}

const keyboardMap = getKeyboardMap(currentLevel);

// Sample texts for typing
const sampleTexts = [
    "typing is a very useful skill in the modern world. it helps you finish your work faster and communicate better online. when you practice every day, your fingers start to move naturally across the keyboard. soon you will type without looking at the keys at all.",

    "he quick brown fox jumps over the lazy dog. pack my box with five dozen liquor jugs. how vexingly quick daft zebras jump! the five boxing wizards jump quickly. sphinx of black quartz, judge my vow.",
    
    "technology has transformed modern life in countless ways. the rapid advancement of artificial intelligence and machine learning continues to revolutionize industries worldwide. from smartphones to smart homes, digital innovation shapes how we work, communicate, and live our daily lives.",
    
    "in the bustling city square, vendors display their colorful wares as morning sunlight streams between tall buildings. children laugh and play near the fountain, while business professionals hurry past with steaming cups of coffee. the aroma of fresh bread wafts from nearby bakeries.",
    
    "the internet has changed the way people work and learn. today, most jobs require some amount of typing, whether it’s sending emails or writing reports. that’s why learning to type efficiently is one of the most practical skills you can build.",
    
    "success in typing, just like in life, comes from regular practice. even if your speed is low at first, keep going. every small improvement adds up over time, and one day you will notice how fast and accurate you have become.",
    
    "learning to type takes time, but it is worth the effort. start by focusing on accuracy before speed. once you stop making mistakes, your typing speed will improve automatically. remember to sit straight and keep your wrists relaxed while typing.",
    
    "technology has made our lives easier in many ways. we can study, work, and connect with people from anywhere in the world. knowing how to type well can save time and make you more productive in everything you do online.",
    
    "space exploration continues to push the boundaries of human knowledge and capability. advanced telescopes reveal distant galaxies, while robotic rovers explore mars's rocky surface. international space stations conduct groundbreaking research, expanding our understanding of the cosmos.",
    
    "culinary traditions vary dramatically across different cultures and regions. each country's unique ingredients, cooking methods, and dining customs tell stories of its history and values. sharing meals brings people together, creating bonds that transcend language and cultural barriers.",
    
    "the art museum's new exhibition showcased works from various contemporary artists. abstract paintings hung alongside intricate sculptures, while digital installations occupied corner spaces. visitors moved slowly between pieces, contemplating the diverse expressions of human creativity."
];

// DOM elements
const sampleTextElement = document.getElementById('sampleText');
const wordsContainer = document.getElementById('wordsContainer');
const sampleCodeElement = document.getElementById('sampleCode');
const userInputElement = document.getElementById('userInput');
const timerElement = document.getElementById('timer');
const resetButton = document.getElementById('resetBtn');
const newTextButton = document.getElementById('newTextBtn');
const userGreetingElement = document.getElementById('userGreeting');
const changeProfileBtn = document.getElementById('changeProfileBtn');
const userProfileModal = document.getElementById('userProfileModal');
const userProfileForm = document.getElementById('userProfileForm');
const userNameInput = document.getElementById('userName');
const userGenderSelect = document.getElementById('userGender');
const userProfileError = document.getElementById('userProfileError');
const liveStatsElement = document.getElementById('liveStats');
const liveWpmElement = document.getElementById('liveWpm');
const liveAccElement = document.getElementById('liveAcc');
const typingHintElement = document.getElementById('typingHint');
const retryBtn = document.getElementById('retryBtn');

// Variables for tracking
let startTime = null;
let timerInterval = null;
let isTestActive = false;
let timeLimit = currentLevel === 2 ? 60 : 600; // Level 2: 1 min, Level 1: 10 min
let typedText = '';
let currentSampleText = '';
let charElements = [];

// Analytics tracking
const analytics = {
    testsCompleted: 0,
    totalTime: 0,
    totalWpm: 0,
    totalAccuracy: 0,
    bestWpm: 0
};

// Line scrolling variables
let currentLineIndex = 0;
const VISIBLE_LINES = 3;

// ═══════════════════════════════════════════════════════════
// COSMIC BACKGROUND — stars, aurora, meteors, orbs, vortex
// ═══════════════════════════════════════════════════════════
function initParticleBackground() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H;
    let mouse = { x: -9999, y: -9999, active: false };
    let time = 0;

    // ── Layers ──
    let stars = [], shootingStars = [], orbs = [], ripples = [];

    const STAR_COUNT = 260;
    const ORB_COUNT = 8;
    const AURORA_BANDS = 4;

    // ── Colors ──
    const palette = [
        [96, 165, 250],   // blue
        [139, 92, 246],   // purple
        [236, 72, 153],   // pink
        [52, 211, 153],   // emerald
        [251, 191, 36],   // amber
        [99, 102, 241],   // indigo
    ];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        initStars();
        initOrbs();
    }

    // ── STARS ──
    function initStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 1.8 + 0.2,
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2,
                color: palette[Math.floor(Math.random() * 3)] // blue/purple/pink
            });
        }
    }

    function drawStars() {
        for (let s of stars) {
            const flicker = 0.4 + 0.6 * Math.sin(time * s.twinkleSpeed + s.twinkleOffset);
            const alpha = flicker * (0.5 + s.r / 2);

            // Star core
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${alpha})`;
            ctx.fill();

            // Star glow
            if (s.r > 1) {
                const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
                grad.addColorStop(0, `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${alpha * 0.4})`);
                grad.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            }
        }
    }

    // ── SHOOTING STARS ──
    function spawnShootingStar() {
        if (shootingStars.length > 3) return;
        const col = palette[Math.floor(Math.random() * palette.length)];
        shootingStars.push({
            x: Math.random() * W * 0.8,
            y: Math.random() * H * 0.3,
            len: Math.random() * 120 + 80,
            speed: Math.random() * 8 + 6,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
            life: 1,
            decay: Math.random() * 0.012 + 0.008,
            color: col,
            width: Math.random() * 2 + 1
        });
    }

    function updateAndDrawShootingStars() {
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const s = shootingStars[i];
            s.x += Math.cos(s.angle) * s.speed;
            s.y += Math.sin(s.angle) * s.speed;
            s.life -= s.decay;

            if (s.life <= 0) { shootingStars.splice(i, 1); continue; }

            const tailX = s.x - Math.cos(s.angle) * s.len;
            const tailY = s.y - Math.sin(s.angle) * s.len;

            const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
            grad.addColorStop(0, 'transparent');
            grad.addColorStop(0.6, `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${s.life * 0.5})`);
            grad.addColorStop(1, `rgba(255,255,255,${s.life})`);

            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(s.x, s.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = s.width;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Head glow
            const headGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 8);
            headGrad.addColorStop(0, `rgba(255,255,255,${s.life})`);
            headGrad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(s.x, s.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = headGrad;
            ctx.fill();
        }
    }

    // ── AURORA BOREALIS ──
    function drawAurora() {
        for (let b = 0; b < AURORA_BANDS; b++) {
            const baseY = H * (0.15 + b * 0.12);
            const col = palette[b % palette.length];

            ctx.beginPath();
            ctx.moveTo(0, baseY);

            for (let x = 0; x <= W; x += 4) {
                const wave1 = Math.sin((x * 0.003) + time * 0.008 + b * 1.5) * 50;
                const wave2 = Math.sin((x * 0.007) + time * 0.012 + b * 0.8) * 30;
                const wave3 = Math.sin((x * 0.001) + time * 0.005) * 70;
                const y = baseY + wave1 + wave2 + wave3;
                ctx.lineTo(x, y);
            }

            ctx.lineTo(W, H);
            ctx.lineTo(0, H);
            ctx.closePath();

            const grad = ctx.createLinearGradient(0, baseY - 80, 0, baseY + 200);
            grad.addColorStop(0, 'transparent');
            grad.addColorStop(0.2, `rgba(${col[0]},${col[1]},${col[2]},${0.04 + Math.sin(time * 0.01 + b) * 0.02})`);
            grad.addColorStop(0.5, `rgba(${col[0]},${col[1]},${col[2]},${0.02})`);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fill();
        }
    }

    // ── FLOATING NEON ORBS ──
    function initOrbs() {
        orbs = [];
        for (let i = 0; i < ORB_COUNT; i++) {
            const col = palette[Math.floor(Math.random() * palette.length)];
            orbs.push({
                x: Math.random() * W,
                y: Math.random() * H,
                baseR: Math.random() * 30 + 15,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                color: col,
                phase: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.01
            });
        }
    }

    function updateAndDrawOrbs() {
        for (let o of orbs) {
            // Drift
            o.x += o.vx;
            o.y += o.vy;
            if (o.x < -50) o.x = W + 50;
            if (o.x > W + 50) o.x = -50;
            if (o.y < -50) o.y = H + 50;
            if (o.y > H + 50) o.y = -50;

            // Mouse attraction
            if (mouse.active) {
                const dx = mouse.x - o.x, dy = mouse.y - o.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 300 && dist > 0) {
                    const pull = 0.3 / dist;
                    o.vx += dx * pull;
                    o.vy += dy * pull;
                }
            }

            // Dampen
            o.vx *= 0.99; o.vy *= 0.99;

            const pulse = Math.sin(time * o.pulseSpeed + o.phase);
            const r = o.baseR + pulse * 8;

            // Outer glow
            const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r * 3);
            grad.addColorStop(0, `rgba(${o.color[0]},${o.color[1]},${o.color[2]},0.15)`);
            grad.addColorStop(0.4, `rgba(${o.color[0]},${o.color[1]},${o.color[2]},0.05)`);
            grad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(o.x, o.y, r * 3, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            // Inner core
            const coreGrad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
            coreGrad.addColorStop(0, `rgba(255,255,255,0.2)`);
            coreGrad.addColorStop(0.3, `rgba(${o.color[0]},${o.color[1]},${o.color[2]},0.12)`);
            coreGrad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(o.x, o.y, r, 0, Math.PI * 2);
            ctx.fillStyle = coreGrad;
            ctx.fill();
        }
    }

    // ── MOUSE VORTEX ──
    function drawVortex() {
        if (!mouse.active) return;

        // Spinning rings
        for (let ring = 0; ring < 3; ring++) {
            const radius = 40 + ring * 30;
            const alpha = 0.08 - ring * 0.02;
            const col = palette[ring];
            const rotation = time * 0.02 * (ring % 2 === 0 ? 1 : -1);

            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, radius, rotation, rotation + Math.PI * 1.4);
            ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Central glow
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120);
        grad.addColorStop(0, 'rgba(139,92,246,0.08)');
        grad.addColorStop(0.5, 'rgba(96,165,250,0.03)');
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
    }

    // ── CLICK RIPPLES ──
    function spawnRipple(x, y) {
        const col = palette[Math.floor(Math.random() * palette.length)];
        for (let i = 0; i < 3; i++) {
            ripples.push({
                x, y,
                r: 5 + i * 15,
                maxR: 150 + i * 60,
                speed: 3 + i * 1.5,
                life: 1,
                decay: 0.015 - i * 0.003,
                color: col,
                width: 2 - i * 0.5
            });
        }
    }

    function updateAndDrawRipples() {
        for (let i = ripples.length - 1; i >= 0; i--) {
            const rp = ripples[i];
            rp.r += rp.speed;
            rp.life -= rp.decay;
            if (rp.life <= 0 || rp.r > rp.maxR) { ripples.splice(i, 1); continue; }

            ctx.beginPath();
            ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${rp.color[0]},${rp.color[1]},${rp.color[2]},${rp.life * 0.5})`;
            ctx.lineWidth = rp.width;
            ctx.stroke();
        }
    }

    // ── NEBULA FOG ──
    function drawNebula() {
        const spots = [
            { x: W * 0.2, y: H * 0.3, r: 300, col: palette[1] },
            { x: W * 0.8, y: H * 0.7, r: 350, col: palette[0] },
            { x: W * 0.5, y: H * 0.5, r: 400, col: palette[5] },
        ];
        for (let s of spots) {
            const drift = Math.sin(time * 0.003 + s.x * 0.01) * 30;
            const grad = ctx.createRadialGradient(s.x + drift, s.y, 0, s.x + drift, s.y, s.r);
            grad.addColorStop(0, `rgba(${s.col[0]},${s.col[1]},${s.col[2]},0.03)`);
            grad.addColorStop(0.5, `rgba(${s.col[0]},${s.col[1]},${s.col[2]},0.01)`);
            grad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(s.x + drift, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        }
    }

    // ── MAIN LOOP ──
    function animate() {
        time++;
        ctx.clearRect(0, 0, W, H);

        // Background gradient (deep space)
        const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.8);
        bgGrad.addColorStop(0, '#0a0a2e');
        bgGrad.addColorStop(0.5, '#050520');
        bgGrad.addColorStop(1, '#020014');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // Draw layers back to front
        drawNebula();
        drawAurora();
        drawStars();
        updateAndDrawOrbs();
        updateAndDrawShootingStars();
        drawVortex();
        updateAndDrawRipples();

        // Random shooting stars
        if (Math.random() < 0.008) spawnShootingStar();

        requestAnimationFrame(animate);
    }

    // ── EVENTS ──
    window.addEventListener('resize', resize);

    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    canvas.addEventListener('click', (e) => {
        spawnRipple(e.clientX, e.clientY);
        // Burst of shooting stars on click!
        for (let i = 0; i < 2; i++) spawnShootingStar();
    });

    resize();
    animate();
}

const USER_PROFILE_STORAGE_KEY = 'rk_user_profile';
let userProfileCache = null;
let resultSummaryElement = null;

function getUserProfile() {
    if (userProfileCache) return userProfileCache;
    try {
        const stored = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
        userProfileCache = stored ? JSON.parse(stored) : null;
    } catch (_) {
        userProfileCache = null;
    }
    return userProfileCache;
}

function saveUserProfile(profile) {
    userProfileCache = profile;
    try {
        localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (_) {}
}

function formatGenderLabel(value) {
    switch (value) {
        case 'female': return 'Female';
        case 'male': return 'Male';
        case 'nonbinary': return 'Non-binary';
        case 'prefer_not': return 'Prefer not to say';
        case 'other': return 'Other';
        default: return '';
    }
}

function updateGreetingDisplay() {
    if (!userGreetingElement) return;
    const profile = getUserProfile();

    if (profile) {
        userGreetingElement.textContent = profile.name;
    } else {
        userGreetingElement.textContent = '';
    }
}

function ensureResultSummary(modal) {
    if (!modal) return null;
    const content = modal.querySelector('.modal-content');
    if (!content) return null;
    if (resultSummaryElement && !content.contains(resultSummaryElement)) {
        resultSummaryElement = null;
    }
    if (!resultSummaryElement) {
        resultSummaryElement = document.createElement('p');
        resultSummaryElement.className = 'result-summary';
        const analyticsContainer = content.querySelector('.analytics-container');
        content.insertBefore(resultSummaryElement, analyticsContainer);
    }
    return resultSummaryElement;
}

function showUserProfilePrompt() {
    if (!userProfileModal) return;
    const profile = getUserProfile();
    if (userProfileError) userProfileError.textContent = '';

    if (userNameInput) userNameInput.value = profile ? profile.name : '';
    if (userGenderSelect) {
        if (profile && profile.gender) {
            userGenderSelect.value = profile.gender;
        } else {
            userGenderSelect.value = '';
            if (userGenderSelect.options.length > 0) {
                userGenderSelect.selectedIndex = 0;
            }
        }
    }

    userProfileModal.style.display = 'block';
    setTimeout(() => {
        if (userNameInput) userNameInput.focus();
    }, 50);
}

function hideUserProfilePrompt() {
    if (!userProfileModal) return;
    userProfileModal.style.display = 'none';
}

function initializeUserProfile() {
    const profile = getUserProfile();
    updateGreetingDisplay();
    if (!profile) {
        showUserProfilePrompt();
    }
}

// ---------- Results helpers (persist across pages) ----------
function computeMetrics(originalText, typedTextValue, elapsedSeconds) {
    const accuracy = calculateAccuracy(originalText.toLowerCase(), typedTextValue);
    const wpm = calculateWPM(typedTextValue, elapsedSeconds);
    
    // Calculate based on letters (characters) instead of words
    const originalLower = originalText.toLowerCase();
    const typedLower = typedTextValue.toLowerCase();
    const totalLetters = originalLower.length;
    
    // Count correct letters
    let correctLetters = 0;
    let wrongLetters = 0;
    const minLen = Math.min(originalLower.length, typedLower.length);
    for (let i = 0; i < minLen; i++) {
        if (originalLower[i] === typedLower[i]) {
            correctLetters++;
        } else {
            wrongLetters++;
        }
    }
    const unattemptedLetters = Math.max(0, totalLetters - minLen);
    
    // Completion based on correct letters out of total letters
    const completion = totalLetters > 0 ? Math.max(0, Math.min(1, correctLetters / totalLetters)) : 0;
    
    // Total score factors in both accuracy and completion percentage (both based on letters)
    const score = Math.round(Math.max(0, Math.min(100, (accuracy * completion))));
    
    return { accuracy, wpm, score, elapsedSeconds, correctLetters, wrongLetters, unattemptedLetters, totalLetters, completion };
}

function saveLevelResult(levelNumber, metrics) {
    try {
        localStorage.setItem(`rk_result_level_${levelNumber}`, JSON.stringify(metrics));
    } catch (_) {}
}

function readLevelResult(levelNumber) {
    try {
        const raw = localStorage.getItem(`rk_result_level_${levelNumber}`);
        return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
}

function clearLevelResults() {
    try {
        localStorage.removeItem('rk_result_level_1');
        localStorage.removeItem('rk_result_level_2');
    } catch (_) {}
}

// Initialize keyboard map display
function initializeKeyboardMap() {
    Object.entries(keyboardMap).forEach(([key, value]) => {
        if (key !== ' ' && key !== '.' && key !== ',' && key !== '!' && 
            key !== '?' && key !== "'" && key !== '"' && key !== ';' && 
            key !== ':' && key !== '-' && key !== '(' && key !== ')') {
            const keyPairDiv = document.createElement('div');
            keyPairDiv.className = 'key-pair';
            keyPairDiv.textContent = `${key.toUpperCase()} → ${value.toUpperCase()}`;
            keyboardGrid.appendChild(keyPairDiv);
        }
    });
}

// Keyboard map is now on a separate page

// ---------- MonkeyType-style text rendering ----------
function renderSampleText(text) {
    if (!wordsContainer) return;
    wordsContainer.innerHTML = '';
    charElements = [];
    currentSampleText = text.toLowerCase();
    
    // Split text into words (keeping spaces attached to end of each word)
    const words = text.split(/(?<= )/);
    
    for (const word of words) {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            const span = document.createElement('span');
            span.className = 'char' + (char === ' ' ? ' space' : '');
            span.textContent = char === ' ' ? '\u00A0' : char;
            charElements.push(span);
            wordSpan.appendChild(span);
        }
        
        wordsContainer.appendChild(wordSpan);
    }
    
    // Set first character as current
    if (charElements.length > 0) {
        charElements[0].classList.add('current');
    }
}

function updateCharacterStates(typedValue) {
    const typed = typedValue.toLowerCase();
    
    charElements.forEach((el, i) => {
        el.classList.remove('correct', 'incorrect', 'current');
        
        if (i < typed.length) {
            // Character has been typed
            const expectedChar = currentSampleText[i];
            const typedChar = typed[i];
            
            if (typedChar === expectedChar) {
                el.classList.add('correct');
            } else {
                el.classList.add('incorrect');
            }
        } else if (i === typed.length) {
            // Current position (cursor)
            el.classList.add('current');
        }
        // Remaining characters stay at default state (not typed yet)
    });
    
    // Line scrolling logic
    scrollToCurrentLine(typed.length);
}

// Calculate current line and scroll if needed
function scrollToCurrentLine(cursorPosition) {
    if (!wordsContainer || charElements.length === 0) return;
    
    const currentChar = charElements[cursorPosition] || charElements[charElements.length - 1];
    if (!currentChar) return;
    
    const containerTop = wordsContainer.getBoundingClientRect().top;
    const charTop = currentChar.getBoundingClientRect().top;
    const lineHeight = parseFloat(getComputedStyle(wordsContainer).lineHeight) || 48;
    
    // Calculate which line the cursor is on (0-indexed)
    const charOffsetTop = currentChar.offsetTop;
    const lineIndex = Math.floor(charOffsetTop / lineHeight);
    
    // Start scrolling when we move past line 2 (third line, 0-indexed)
    if (lineIndex > currentLineIndex && lineIndex >= VISIBLE_LINES - 1) {
        currentLineIndex = lineIndex;
        const scrollAmount = (lineIndex - (VISIBLE_LINES - 2)) * lineHeight;
        wordsContainer.style.transform = `translateY(-${scrollAmount}px)`;
    }
}

// ---------- Live Stats ----------
function updateLiveStats() {
    if (!startTime || !typedText) return;
    
    const elapsed = Math.max(1, Math.floor((new Date() - startTime) / 1000));
    
    // Calculate WPM (words = characters / 5)
    const words = typedText.length / 5;
    const minutes = elapsed / 60;
    const wpm = Math.round(words / minutes) || 0;
    
    // Calculate accuracy
    let correct = 0;
    const minLen = Math.min(currentSampleText.length, typedText.length);
    for (let i = 0; i < minLen; i++) {
        if (currentSampleText[i] === typedText[i]) correct++;
    }
    const accuracy = typedText.length > 0 ? Math.round((correct / typedText.length) * 100) : 100;
    
    if (liveWpmElement) liveWpmElement.textContent = wpm;
    if (liveAccElement) liveAccElement.textContent = accuracy;
}

// Function to get a random sample text
function getRandomText() {
    const index = Math.floor(Math.random() * sampleTexts.length);
    return { text: sampleTexts[index], code: `CODE-${String(index + 1).padStart(3, '0')}` };
}

// Function to start the timer
function startTimer() {
    if (!isTestActive) {
        startTime = new Date();
        isTestActive = true;
        timerInterval = setInterval(updateTimer, 1000);
    }
}

// Function to update the timer
function updateTimer() {
    if (startTime) {
        const currentTime = new Date();
        const timeElapsed = Math.floor((currentTime - startTime) / 1000);
        const timeRemaining = timeLimit - timeElapsed;
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            // End test; compute metrics then show prompt/report
            const finalText = userInputElement.value;
            const sample = sampleTextContentElement ? sampleTextContentElement.textContent : sampleTextElement.textContent;
            const timeElapsed = timeLimit;
            const metrics = computeMetrics(sample, finalText, timeElapsed);
            if (currentLevel === 1) {
                saveLevelResult(1, metrics);
                showLevel2Prompt();
            } else {
                saveLevelResult(2, metrics);
                showCombinedReport();
            }
            isTestActive = false;
            return;
        }

        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Add warning class when less than 1 minute remains
        if (timeRemaining <= 60) {
            timerElement.classList.add('time-warning');
        }
    }
}

// Function to show final analytics (disabled) — replaced by Level 2 prompt on Level 1
function showFinalAnalytics() {
    // Intentionally no-op
    isTestActive = false;
}

// Show a simple prompt with only the LEVEL 2 button (Level 1 only)
function showLevel2Prompt() {
    const modal = document.getElementById('analyticsModal');
    if (!modal) return;

    const titleEl = document.getElementById('resultTitle');
    const profile = getUserProfile();
    
    // Populate result stats
    const level1 = readLevelResult(1);
    if (level1) {
        const finalWpm = document.getElementById('finalWpm');
        const finalAcc = document.getElementById('finalAcc');
        const correctChars = document.getElementById('correctChars');
        const incorrectChars = document.getElementById('incorrectChars');
        const finalTime = document.getElementById('finalTime');
        const finalScore = document.getElementById('finalScore');
        
        if (finalWpm) finalWpm.textContent = Math.round(level1.wpm);
        if (finalAcc) finalAcc.textContent = Math.round(level1.accuracy) + '%';
        if (correctChars) correctChars.textContent = level1.correctLetters || 0;
        if (incorrectChars) incorrectChars.textContent = level1.wrongLetters || 0;
        if (finalTime) finalTime.textContent = level1.elapsedSeconds + 's';
        if (finalScore) finalScore.textContent = Math.round(level1.score);
        
        // Check Level 2 access requirements: accuracy > 80% and WPM > 30
        const meetsRequirements = level1.accuracy > 80 && level1.wpm > 30;
        const level2Btn = document.getElementById('level2Btn');
        const level2LockedMsg = document.getElementById('level2LockedMsg');
        
        if (meetsRequirements) {
            if (titleEl) titleEl.textContent = profile ? `great job, ${profile.name}!` : 'level 1 complete';
            if (level2Btn) level2Btn.style.display = 'flex';
            if (level2LockedMsg) level2LockedMsg.style.display = 'none';
        } else {
            if (titleEl) titleEl.textContent = profile ? `keep practicing, ${profile.name}!` : 'keep practicing!';
            if (level2Btn) level2Btn.style.display = 'none';
            // Create or show locked message
            if (level2LockedMsg) {
                level2LockedMsg.style.display = 'block';
                level2LockedMsg.innerHTML = `<span style="color: var(--error-color);">Level 2 requires accuracy > 80% and WPM > 30</span><br>Your score: ${Math.round(level1.accuracy)}% accuracy, ${Math.round(level1.wpm)} WPM`;
            }
        }
    } else {
        if (titleEl) titleEl.textContent = profile ? `great job, ${profile.name}!` : 'level 1 complete';
        // Show Level 2 button by default if no level1 data
        const level2Btn = document.getElementById('level2Btn');
        if (level2Btn) level2Btn.style.display = 'flex';
    }

    modal.style.display = 'block';
}

// Build and show combined report for Level 1 and Level 2
function showCombinedReport() {
    const modal = document.getElementById('analyticsModal');
    if (!modal) return;

    const titleEl = document.getElementById('resultTitle');
    const profile = getUserProfile();
    if (titleEl) titleEl.textContent = profile ? `challenge complete, ${profile.name}!` : 'challenge complete!';

    // Populate result stats with Level 2 results
    const level2 = readLevelResult(2);
    if (level2) {
        const finalWpm = document.getElementById('finalWpm');
        const finalAcc = document.getElementById('finalAcc');
        const correctChars = document.getElementById('correctChars');
        const incorrectChars = document.getElementById('incorrectChars');
        const finalTime = document.getElementById('finalTime');
        const finalScore = document.getElementById('finalScore');
        
        if (finalWpm) finalWpm.textContent = Math.round(level2.wpm);
        if (finalAcc) finalAcc.textContent = Math.round(level2.accuracy) + '%';
        if (correctChars) correctChars.textContent = level2.correctLetters || 0;
        if (incorrectChars) incorrectChars.textContent = level2.wrongLetters || 0;
        if (finalTime) finalTime.textContent = level2.elapsedSeconds + 's';
        if (finalScore) finalScore.textContent = Math.round(level2.score);
    }

    // Hide Level 2 button (we're already on Level 2)
    const level2Btn = document.getElementById('level2Btn');
    if (level2Btn) level2Btn.style.display = 'none';

    modal.style.display = 'block';
}

// Function to calculate WPM
function calculateWPM(text, timeInSeconds) {
    const words = text.trim().split(/\s+/).length;
    const minutes = timeInSeconds / 60;
    return Math.round(words / minutes);
}

// Function to calculate accuracy
function calculateAccuracy(original, typed) {
    if (typed.length === 0) return 0;
    let correct = 0;
    const len = Math.min(original.length, typed.length);
    
    for (let i = 0; i < len; i++) {
        if (original[i] === typed[i]) correct++;
    }
    
    return Math.round((correct / typed.length) * 100);
}

// Function to reset the test
function resetTest() {
    userInputElement.value = '';
    startTime = null;
    isTestActive = false;
    typedText = '';
    clearInterval(timerInterval);
    timerElement.textContent = currentLevel === 2 ? '01:00' : '10:00';
    timerElement.classList.remove('time-warning');
    if (sampleTextElement) sampleTextElement.classList.remove('active');
    if (liveStatsElement) liveStatsElement.classList.remove('visible');
    if (liveWpmElement) liveWpmElement.textContent = '0';
    if (liveAccElement) liveAccElement.textContent = '100';
    if (typingHintElement) typingHintElement.style.opacity = '1';
    // Reset character states
    updateCharacterStates('');
    // Reset line scrolling
    currentLineIndex = 0;
    if (wordsContainer) wordsContainer.style.transform = 'translateY(0)';
}

// Function to check if test is complete
function checkCompletion(userInput, sampleText) {
    if (userInput.length === sampleText.length) {
        clearInterval(timerInterval);
        // Compute metrics
        const timeElapsed = Math.floor((new Date() - startTime) / 1000);
        const metrics = computeMetrics(currentSampleText, userInput, timeElapsed);
        if (currentLevel === 1) {
            saveLevelResult(1, metrics);
            showLevel2Prompt();
        } else {
            saveLevelResult(2, metrics);
            showCombinedReport();
        }
        isTestActive = false;
    }
}

// Event listeners
userInputElement.addEventListener('input', (e) => {
    if (!isTestActive && e.target.value.length > 0) {
        startTimer();
        sampleTextElement.classList.add('active');
        if (liveStatsElement) liveStatsElement.classList.add('visible');
        if (typingHintElement) typingHintElement.style.opacity = '0';
    }

    // Normalize to lowercase to match keyboard map
    const normalizedValue = e.target.value.toLowerCase();
    if (normalizedValue !== e.target.value) {
        e.target.value = normalizedValue;
    }

    const inputType = e.inputType || '';
    const isDeletion = inputType.startsWith('delete');

    if (!isDeletion && normalizedValue.length > 0) {
        // Only transform when characters are inserted, not when deleted
        const lastChar = normalizedValue[normalizedValue.length - 1];
        const mappedChar = keyboardMap[lastChar] || lastChar;
        e.target.value = normalizedValue.slice(0, -1) + mappedChar;
    }

    typedText = e.target.value;
    
    // Update character highlighting
    updateCharacterStates(typedText);
    
    // Update live stats
    updateLiveStats();
    
    // Check if the test is complete
    checkCompletion(e.target.value, currentSampleText);
});

// Disable copy/paste on typing area
userInputElement.addEventListener('paste', (e) => {
    e.preventDefault();
});
userInputElement.addEventListener('copy', (e) => {
    e.preventDefault();
});
userInputElement.addEventListener('drop', (e) => {
    e.preventDefault();
});
userInputElement.addEventListener('keydown', (e) => {
    const key = (e.key || '').toLowerCase();
    if ((e.ctrlKey || e.metaKey) && (key === 'v' || key === 'c')) {
        e.preventDefault();
    }
});

// Click on typing area to focus hidden input
if (sampleTextElement) {
    sampleTextElement.addEventListener('click', () => {
        userInputElement.focus();
        sampleTextElement.classList.add('active');
    });
}

// Tab+Enter shortcut for restart
let tabPressed = false;
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        tabPressed = true;
        // Prevent default tab behavior when focused on typing
        if (document.activeElement === userInputElement) {
            e.preventDefault();
        }
    }
    
    if (e.key === 'Enter' && tabPressed) {
        e.preventDefault();
        resetTest();
        const next = getRandomText();
        renderSampleText(next.text);
        if (sampleCodeElement) sampleCodeElement.textContent = next.code;
        if (analyticsModal) analyticsModal.style.display = 'none';
        userInputElement.focus();
        tabPressed = false;
        return;
    }
    
    // Don't capture if user is in a modal or other input
    if (userProfileModal && userProfileModal.style.display === 'block') return;
    if (analyticsModal && analyticsModal.style.display === 'block') return;
    if (document.activeElement && document.activeElement.tagName === 'INPUT' && document.activeElement !== userInputElement) return;
    if (document.activeElement && document.activeElement.tagName === 'TEXTAREA') return;
    
    // Focus the hidden input for typing
    if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
        userInputElement.focus();
        sampleTextElement.classList.add('active');
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'Tab') {
        tabPressed = false;
    }
});

// Analytics modal setup
const analyticsModal = document.getElementById('analyticsModal');
const closeAnalyticsBtn = document.querySelector('.close-analytics');

if (closeAnalyticsBtn) {
    closeAnalyticsBtn.onclick = () => {
        analyticsModal.style.display = "none";
        resetTest();
        const next = getRandomText();
        renderSampleText(next.text);
        if (sampleCodeElement) sampleCodeElement.textContent = next.code;
    };
}

// Close analytics modal when clicking outside
window.onclick = (event) => {
    if (event.target === analyticsModal) {
        analyticsModal.style.display = "none";
    }
    if (event.target === userProfileModal) {
        // Don't close profile modal by clicking outside
    }
};

// Retry button handler
if (retryBtn) {
    retryBtn.addEventListener('click', () => {
        analyticsModal.style.display = "none";
        resetTest();
        const next = getRandomText();
        renderSampleText(next.text);
        if (sampleCodeElement) sampleCodeElement.textContent = next.code;
        userInputElement.focus();
    });
}

// Show Level 2 Locked Modal
function showLevel2LockedModal(level1Result) {
    const modal = document.getElementById('level2LockedModal');
    if (!modal) return;
    
    const currentScoreSection = document.getElementById('lockedCurrentScore');
    const currentAcc = document.getElementById('lockedCurrentAcc');
    const currentWpm = document.getElementById('lockedCurrentWpm');
    
    if (level1Result && currentScoreSection) {
        currentScoreSection.style.display = 'block';
        if (currentAcc) currentAcc.textContent = Math.round(level1Result.accuracy) + '%';
        if (currentWpm) currentWpm.textContent = Math.round(level1Result.wpm) + ' wpm';
    } else if (currentScoreSection) {
        currentScoreSection.style.display = 'none';
    }
    
    modal.style.display = 'block';
    
    // Close button handler
    const closeBtn = document.getElementById('closeLockedModal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }
    
    // Click outside to close
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Optional: wire LEVEL 2 button if present
const level2Btn = document.getElementById('level2Btn');
if (level2Btn) {
    level2Btn.addEventListener('click', (e) => {
        // Check Level 1 requirements before allowing navigation
        const level1 = readLevelResult(1);
        const meetsRequirements = level1 && level1.accuracy > 80 && level1.wpm > 30;
        
        if (!meetsRequirements) {
            e.preventDefault();
            showLevel2LockedModal(level1);
        }
    });
}

// Block Level 2 nav link until Level 1 is completed with required scores
const level2NavLink = document.getElementById('level2NavLink');
if (level2NavLink) {
    level2NavLink.addEventListener('click', (e) => {
        const level1 = readLevelResult(1);
        const meetsRequirements = level1 && level1.accuracy > 80 && level1.wpm > 30;
        
        if (!meetsRequirements) {
            e.preventDefault();
            showLevel2LockedModal(level1);
        }
    });
}

if (userProfileForm) {
    userProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!userNameInput || !userGenderSelect) return;

        const name = (userNameInput.value || '').trim();
        const gender = userGenderSelect.value;

        if (!name) {
            if (userProfileError) userProfileError.textContent = 'Please enter your name.';
            userNameInput.focus();
            return;
        }

        if (!gender) {
            if (userProfileError) userProfileError.textContent = 'Please select your gender.';
            userGenderSelect.focus();
            return;
        }

        const profile = { name, gender };
        saveUserProfile(profile);
        updateGreetingDisplay();
        if (userProfileError) userProfileError.textContent = '';
        hideUserProfilePrompt();
        if (userInputElement) userInputElement.focus();
    });
}

if (changeProfileBtn) {
    changeProfileBtn.addEventListener('click', () => {
        showUserProfilePrompt();
    });
}

// Button event listeners
resetButton.addEventListener('click', () => {
    resetTest();
    renderSampleText(currentSampleText);
    analyticsModal.style.display = "none";
});

newTextButton.addEventListener('click', () => {
    resetTest();
    const next = getRandomText();
    renderSampleText(next.text);
    if (sampleCodeElement) sampleCodeElement.textContent = next.code;
    analyticsModal.style.display = "none";
});

// Initialize
const initRandom = getRandomText();
renderSampleText(initRandom.text);
if (sampleCodeElement) sampleCodeElement.textContent = initRandom.code;
initializeUserProfile();
initParticleBackground();

// Check if we need to show Level 2 locked modal (redirected from level2.html)
if (sessionStorage.getItem('showLevel2LockedModal') === 'true') {
    sessionStorage.removeItem('showLevel2LockedModal');
    const level1 = readLevelResult(1);
    showLevel2LockedModal(level1);
}
