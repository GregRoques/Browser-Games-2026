/* ============================================================
   Memory Match — Vanilla JS
   Modular, pure-function architecture (SOLID principles)
   ============================================================ */

(function () {
    'use strict';

    /* ========== CONFIGURATION ========== */

    const CONFIG = Object.freeze({
        TOTAL_IMAGES: 9,
        PAIRS_PER_GAME: 8,
        CARD_LOGO_SRC: 'Images/heart-girl-logo.png',
        CARD_IMAGE_DIR: 'Images/Cards/',
        TYPEWRITER_SPEED: 45,
        FLIP_DELAY: 900,
        FALLBACK_COLORS: [
            '#FF69B4', '#87CEEB', '#FFD700', '#98FB98',
            '#DDA0DD', '#FFA07A', '#ADD8E6', '#F0E68C', '#E6A8D7'
        ],
        FALLBACK_SYMBOLS: ['♥', '★', '♦', '♣', '♠', '●', '▲', '■', '◆']
    });

    /* ========== PURE UTILITY FUNCTIONS ========== */

    /**
     * Returns a new shuffled copy of the given array (Fisher-Yates).
     */
    function shuffleArray(arr) {
        const shuffled = arr.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Selects `count` unique random numbers from 1..total (inclusive).
     */
    function selectRandomSubset(total, count) {
        const pool = Array.from({ length: total }, (_, i) => i + 1);
        return shuffleArray(pool).slice(0, count);
    }

    /**
     * Creates the card deck: pairs of chosen image indices, shuffled.
     */
    function buildDeck(imageIndices) {
        return shuffleArray([...imageIndices, ...imageIndices]);
    }

    /**
     * Formats elapsed seconds as m:ss.
     */
    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return minutes + ':' + String(seconds).padStart(2, '0');
    }

    /**
     * Checks whether two cards are a match based on their data value.
     */
    function isMatch(cardA, cardB) {
        return cardA.dataset.cardValue === cardB.dataset.cardValue;
    }

    /* ========== TIMER MODULE ========== */

    function createTimer(onTick) {
        let intervalId = null;
        let elapsed = 0;

        function tick() {
            elapsed += 1;
            onTick(elapsed);
        }

        return {
            start: function () {
                if (intervalId !== null) return;
                intervalId = setInterval(tick, 1000);
            },
            stop: function () {
                clearInterval(intervalId);
                intervalId = null;
            },
            reset: function () {
                clearInterval(intervalId);
                intervalId = null;
                elapsed = 0;
                onTick(0);
            },
            getElapsed: function () {
                return elapsed;
            }
        };
    }

    /* ========== UI UPDATE FUNCTIONS ========== */

    function updateMovesDisplay(moves) {
        document.getElementById('movesDisplay').textContent = moves;
    }

    function updateTimeDisplay(seconds) {
        document.getElementById('timeDisplay').textContent = formatTime(seconds);
    }

    function updateMatchesDisplay(matches, total) {
        document.getElementById('matchesDisplay').textContent = matches + '/' + total;
    }

    /* ========== CARD DOM CREATION ========== */

    /**
     * Creates a single card element for the given image index.
     */
    function createCardElement(imageIndex) {
        var card = document.createElement('div');
        card.className = 'game-card';
        card.dataset.cardValue = String(imageIndex);

        var inner = document.createElement('div');
        inner.className = 'card-inner';

        // Front face (face-down — shows logo)
        var front = document.createElement('div');
        front.className = 'card-face card-front';

        var frontImg = document.createElement('img');
        frontImg.src = CONFIG.CARD_LOGO_SRC;
        frontImg.alt = 'Card';
        frontImg.draggable = false;
        frontImg.addEventListener('error', function () {
            front.classList.add('img-missing');
        });

        var fallbackHeart = document.createElement('span');
        fallbackHeart.className = 'fallback-heart';
        fallbackHeart.textContent = '\u2665';

        front.appendChild(frontImg);
        front.appendChild(fallbackHeart);

        // Back face (face-up — shows card image)
        var back = document.createElement('div');
        back.className = 'card-face card-back';

        var backImg = document.createElement('img');
        backImg.src = CONFIG.CARD_IMAGE_DIR + imageIndex + '.png';
        backImg.alt = 'Card ' + imageIndex;
        backImg.draggable = false;
        backImg.addEventListener('error', function () {
            back.classList.add('img-missing');
        });

        var fallbackIcon = document.createElement('div');
        fallbackIcon.className = 'fallback-icon';
        fallbackIcon.textContent = CONFIG.FALLBACK_SYMBOLS[imageIndex - 1] || '?';
        fallbackIcon.style.backgroundColor = CONFIG.FALLBACK_COLORS[imageIndex - 1] || '#ccc';

        back.appendChild(backImg);
        back.appendChild(fallbackIcon);

        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);

        return card;
    }

    /**
     * Renders the full card grid into the container.
     */
    function renderCards(container, deck) {
        container.innerHTML = '';
        var fragment = document.createDocumentFragment();
        deck.forEach(function (imageIndex) {
            fragment.appendChild(createCardElement(imageIndex));
        });
        container.appendChild(fragment);
    }

    /* ========== CARD FLIP HELPERS ========== */

    function flipCard(cardEl) {
        cardEl.classList.add('flipped');
    }

    function unflipCard(cardEl) {
        cardEl.classList.remove('flipped');
    }

    function markMatched(cardEl) {
        cardEl.classList.add('matched');
    }

    /* ========== HEART ANIMATION ========== */

    function playHeartAnimation() {
        var el = document.getElementById('heartPop');
        el.classList.remove('active');
        // Force reflow to restart animation
        void el.offsetWidth;
        el.classList.add('active');
        el.addEventListener('animationend', function handler() {
            el.classList.remove('active');
            el.removeEventListener('animationend', handler);
        });
    }

    /* ========== POPUP / TYPEWRITER MODULE ========== */

    function typewriterEffect(element, text, speed) {
        return new Promise(function (resolve) {
            element.classList.remove('done');
            element.textContent = '';
            var i = 0;
            var interval = setInterval(function () {
                if (i < text.length) {
                    element.textContent += text[i];
                    i++;
                } else {
                    clearInterval(interval);
                    element.classList.add('done');
                    resolve();
                }
            }, speed || CONFIG.TYPEWRITER_SPEED);
        });
    }

    function showContinuePrompt() {
        document.getElementById('popupContinue').classList.remove('hidden');
    }

    function hideContinuePrompt() {
        document.getElementById('popupContinue').classList.add('hidden');
    }

    function waitForContinue() {
        return new Promise(function (resolve) {
            var continueBtn = document.querySelector('.continue-touch');
            var overlay = document.getElementById('popupOverlay');

            function onKey(e) {
                if (e.key === 'Enter') {
                    cleanup();
                    resolve();
                }
            }

            function onClick() {
                cleanup();
                resolve();
            }

            function cleanup() {
                document.removeEventListener('keydown', onKey);
                continueBtn.removeEventListener('click', onClick);
            }

            document.addEventListener('keydown', onKey);
            continueBtn.addEventListener('click', onClick);
        });
    }

    function showPopup() {
        var overlay = document.getElementById('popupOverlay');
        var box = overlay.querySelector('.popup-box');
        // Force animation restart by removing/re-adding
        box.style.animation = 'none';
        void box.offsetWidth;
        box.style.animation = '';
        overlay.classList.add('active');
    }

    function hidePopup() {
        var overlay = document.getElementById('popupOverlay');
        overlay.classList.remove('active');
    }

    /**
     * Runs the intro dialog sequence: two typed messages with continue prompts.
     */
    async function runIntroSequence() {
        var textEl = document.getElementById('popupTypedText');

        showPopup();

        // First message
        await typewriterEffect(textEl, "Hi, I'm Heart Girl, want to play a game with me?");
        showContinuePrompt();
        await waitForContinue();
        hideContinuePrompt();

        // Second message
        await typewriterEffect(textEl, "Help me find all of the Matching Cards!");
        showContinuePrompt();
        await waitForContinue();
        hideContinuePrompt();

        hidePopup();
    }

    /**
     * Runs the end-game dialog: congratulations + play again prompt.
     */
    async function runEndSequence() {
        var textEl = document.getElementById('popupTypedText');

        showPopup();

        await typewriterEffect(textEl, "Great job! You found all the matches!");
        showContinuePrompt();
        await waitForContinue();
        hideContinuePrompt();

        await typewriterEffect(textEl, "Play Again?");
        showContinuePrompt();
        await waitForContinue();
        hideContinuePrompt();

        hidePopup();
    }

    /* ========== GAME CONTROLLER ========== */

    function createGame() {
        var grid = document.getElementById('cardGrid');
        var state = {
            deck: [],
            firstCard: null,
            secondCard: null,
            moves: 0,
            matches: 0,
            locked: false,
            timerStarted: false
        };
        var timer = createTimer(updateTimeDisplay);

        /**
         * Resets all game state and renders a fresh board.
         */
        function resetBoard() {
            timer.reset();
            state.deck = buildDeck(selectRandomSubset(CONFIG.TOTAL_IMAGES, CONFIG.PAIRS_PER_GAME));
            state.firstCard = null;
            state.secondCard = null;
            state.moves = 0;
            state.matches = 0;
            state.locked = false;
            state.timerStarted = false;

            updateMovesDisplay(0);
            updateMatchesDisplay(0, CONFIG.PAIRS_PER_GAME);
            updateTimeDisplay(0);

            renderCards(grid, state.deck);
            attachCardListeners();
        }

        /**
         * Attaches click/touch handlers to all cards in the grid.
         */
        function attachCardListeners() {
            var cards = grid.querySelectorAll('.game-card');
            cards.forEach(function (card) {
                card.addEventListener('click', function () {
                    handleCardClick(card);
                });
            });
        }

        /**
         * Processes a card click according to game rules.
         */
        function handleCardClick(card) {
            // Ignore clicks when locked, on already-flipped, or matched cards
            if (state.locked) return;
            if (card.classList.contains('flipped')) return;
            if (card.classList.contains('matched')) return;

            // Start timer on first card click
            if (!state.timerStarted) {
                timer.start();
                state.timerStarted = true;
            }

            flipCard(card);

            if (state.firstCard === null) {
                // First pick of the turn
                state.firstCard = card;
            } else {
                // Second pick of the turn
                state.secondCard = card;
                state.moves += 1;
                updateMovesDisplay(state.moves);
                state.locked = true;

                evaluateMatch();
            }
        }

        /**
         * Evaluates whether the two selected cards are a match.
         */
        function evaluateMatch() {
            if (isMatch(state.firstCard, state.secondCard)) {
                handleMatchSuccess();
            } else {
                handleMatchFailure();
            }
        }

        /**
         * Handles a successful match: lock cards, animate, check win.
         */
        function handleMatchSuccess() {
            markMatched(state.firstCard);
            markMatched(state.secondCard);
            state.matches += 1;
            updateMatchesDisplay(state.matches, CONFIG.PAIRS_PER_GAME);
            playHeartAnimation();
            clearTurn();

            if (state.matches === CONFIG.PAIRS_PER_GAME) {
                timer.stop();
                setTimeout(function () {
                    onGameWon();
                }, 1000);
            }
        }

        /**
         * Handles a failed match: flip cards back after a delay.
         */
        function handleMatchFailure() {
            var a = state.firstCard;
            var b = state.secondCard;
            setTimeout(function () {
                unflipCard(a);
                unflipCard(b);
                clearTurn();
            }, CONFIG.FLIP_DELAY);
        }

        /**
         * Clears the turn state so the player can pick again.
         */
        function clearTurn() {
            state.firstCard = null;
            state.secondCard = null;
            state.locked = false;
        }

        /**
         * Called when all pairs are matched.
         */
        async function onGameWon() {
            await runEndSequence();
            resetBoard();
        }

        return {
            start: resetBoard
        };
    }

    /* ========== ENTRY POINT ========== */

    document.addEventListener('DOMContentLoaded', async function () {
        var game = createGame();

        await runIntroSequence();
        game.start();
    });

})();
