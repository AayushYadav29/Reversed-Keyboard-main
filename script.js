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

// Generate snowfall effect
function createSnowfall() {
    const snowfallContainer = document.getElementById('snowfall');
    if (!snowfallContainer) return;
    
    const snowflakeCount = 50;
    
    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.top = Math.random() * 100 + '%';
        snowflake.style.opacity = Math.random() * 0.7 + 0.3;
        const size = Math.random() * 6 + 2;
        snowflake.style.width = snowflake.style.height = size + 'px';
        snowflake.style.filter = 'blur(' + (Math.random() * 2 + 1) + 'px)';
        snowfallContainer.appendChild(snowflake);
    }
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
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const span = document.createElement('span');
        span.className = 'char' + (char === ' ' ? ' space' : '');
        span.textContent = char === ' ' ? '\u00A0' : char;
        charElements.push(span);
        wordsContainer.appendChild(span);
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
createSnowfall();

// Check if we need to show Level 2 locked modal (redirected from level2.html)
if (sessionStorage.getItem('showLevel2LockedModal') === 'true') {
    sessionStorage.removeItem('showLevel2LockedModal');
    const level1 = readLevelResult(1);
    showLevel2LockedModal(level1);
}
