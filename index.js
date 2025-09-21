var words = [
  'bananas',
  'grapes',
  'carousel',
  'milkshake',
  'javascript',
  'limousine',
  'chocolate',
  'programming',
  'meatloaf',
  'ukulele',
  'mango'
]

// === Word Guess Game Logic ===

// Grab DOM elements
const wordEl = document.getElementById('word-to-guess');
const prevEl = document.getElementById('previous-word');
const incorrectEl = document.getElementById('incorrect-letters');
const remainingEl = document.getElementById('remaining-guesses');
const winsEl = document.getElementById('wins');
const lossesEl = document.getElementById('losses');

// Game state
let currentWord = '';
let display = [];
let incorrectSet = new Set();
let correctSet = new Set();
let remainingGuesses = 10;
let wins = 0;
let losses = 0;
let previousWord = '';

// Pick a random word
function pickRandomWord() {
  const idx = Math.floor(Math.random() * words.length);
  return words[idx];
}

// Update everything on the screen
function updateUI() {
  wordEl.textContent = display.join('');
  prevEl.textContent = previousWord;
  incorrectEl.textContent = [...incorrectSet].join(', ');
  remainingEl.textContent = String(remainingGuesses);
  winsEl.textContent = String(wins);
  lossesEl.textContent = String(losses);
}

// Start a new round
function startRound(nextWord) {
  currentWord = nextWord || pickRandomWord();
  display = currentWord.split('').map(() => '_');
  incorrectSet = new Set();
  correctSet = new Set();
  remainingGuesses = 10;
  updateUI();
}

// Check if input is a single letter
function isLetter(k) {
  return /^[a-z]$/i.test(k);
}

// Handle a guess
function handleGuess(letter) {
  const l = letter.toLowerCase();
  if (!isLetter(l)) return;                      // ignore non-letters
  if (correctSet.has(l) || incorrectSet.has(l)) return; // ignore repeats

  if (currentWord.includes(l)) {
    correctSet.add(l);
    for (let i = 0; i < currentWord.length; i++) {
      if (currentWord[i] === l) {
        display[i] = l;
      }
    }
  } else {
    incorrectSet.add(l);
    remainingGuesses--;
  }

  // Win check
  if (display.join('') === currentWord) {
    wins++;
    previousWord = currentWord;
    updateUI();
    startRound();
    return;
  }

  // Loss check
  if (remainingGuesses === 0) {
    losses++;
    previousWord = currentWord;
    updateUI();
    startRound();
    return;
  }

  updateUI();
}

// --- Listen for key presses (guard against duplicate synthetic events) ---
let _suppress = false;
function guardedListener(e) {
  if (_suppress) return;
  _suppress = true;
  try {
    handleGuess(e.key);
  } finally {
    // release on next macrotask so document/body back-to-back dispatch collapses to one
    setTimeout(() => { _suppress = false; }, 0);
  }
}

document.addEventListener('keyup', guardedListener);
document.body.addEventListener('keyup', guardedListener);

// Start the game
startRound();
