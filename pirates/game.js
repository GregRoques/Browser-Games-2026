(function () {
    'use strict';

    /* ==========================================
       CONFIGURATION
       ========================================== */

    const CONFIG = {
        VIRTUAL_WIDTH: 864,
        VIRTUAL_HEIGHT: 844,
        PLAYER_BOTTOM: 180,
        PLAYER_LEFT: 50,
        PLAYER_HEIGHT: 130,
        ENEMY_HEIGHT: 85,
        JUMP_HEIGHT_RATIO: 0.5,
        JUMP_DURATION: 750,
        RUN_FRAME_MS: 100,
        ATTACK_FRAME_MS: 150,
        HIT_FLASH_MS: 200,
        HIT_FLASH_COUNT: 3,
        BASE_SCROLL_SPEED: 160,
        BASE_ENEMY_SPEED: 260,
        BASE_SPAWN_INTERVAL: 2400,
        MIN_SPAWN_INTERVAL: 700,
        SPEED_INCREASE_PER_LVL: 0.16,
        SPAWN_DECREASE_PER_LVL: 0.2,
        POINTS_JUMP_OVER: 100,
        POINTS_ATTACK: 250,
        LEVEL_THRESHOLD: 1000,
        MAX_HEALTH: 3,
        COUNTDOWN_MS: 1000,
        ENEMY_FLASH_MS: 150,
        ENEMY_FLASH_COUNT: 2,
        DEFEAT_FRAME1_MS: 200,
        FLYING_CHANCE: 0.35,
        ENEMY_ANIM_MS: 120,

        /* Letter System */
        LETTER_SIZE: 50,
        LETTER_SPAWN_MIN: 10000,
        LETTER_SPAWN_MAX: 30000,
        LETTER_SPAWN_SCALE_PER_LVL: 0.08,
        LETTER_SPEED_SCALE_PER_LVL: 0.10,
        LETTER_SWERVE_AMP: 30,
        LETTER_SWERVE_FREQ: 2.5,
        LETTER_ROTATION_DEG: 8,
        LETTER_ROTATION_FREQ: 3,
        POINTS_LETTER: 500,

        /* Win Sequence */
        WIN_FLASH_DURATION: 1500,
        WIN_HEARTS_DURATION: 3000,
        WIN_PAUSE_DURATION: 2000,
        WIN_FADE_DURATION: 1000,
        WIN_PARTNER_SPEED: 200,
        WIN_PARTNER_GAP: 24,
        WIN_HEART_SPAWN_INTERVAL: 300,
        WIN_HEART_FADE_IN_Y: 10,
        WIN_HEART_FADE_OUT_Y: 35,
        WIN_HEART_DURATION: 1200,
        WIN_HEART_SIZE: 30,

        /* Ending Screen */
        ENDING_TYPEWRITER_MS: 65,
        ENDING_SENTENCE_HOLD: 3000,
        ENDING_SENTENCE_FADE: 800,
    };

    /* ==========================================
       ASSET PATH DEFINITIONS
       ========================================== */

    const ASSETS = {
        backgrounds: [
            'images/background/background_1.jpg',
            'images/background/background_2.jpg',
            'images/background/background_3.jpg',
            'images/background/background_4.jpg',
        ],
        teddy: {
            idle: ['images/Player/Teddy/idle/teddy_idle_1.png'],
            running: [
                'images/Player/Teddy/running/teddy_run_1.png',
                'images/Player/Teddy/running/teddy_run_2.png',
                'images/Player/Teddy/running/teddy_run_3.png',
                'images/Player/Teddy/running/teddy_run_4.png',
            ],
            jumping: [
                'images/Player/Teddy/jumping/teddy_jumping_1.png',
                'images/Player/Teddy/jumping/teddy_jumping_2.png',
                'images/Player/Teddy/jumping/teddy_jumping_3.png',
                'images/Player/Teddy/jumping/teddy_jumping_4.png',
            ],
            attack: [
                'images/Player/Teddy/attack/teddy_attack_1.png',
                'images/Player/Teddy/attack/teddy_attack_2.png',
            ],
            collision: ['images/Player/Teddy/collision/teddy_collision_1.png'],
            defeat: [
                'images/Player/Teddy/defeat/Teddy_defeat_1.png',
                'images/Player/Teddy/defeat/Teddy_defeat_2.png',
            ],
        },
        kitty: {
            idle: ['images/Player/Kitty/idle/kitty_idel_1.png'],
            running: [
                'images/Player/Kitty/running/kitty_running_1.png',
                'images/Player/Kitty/running/kitty_running_2.png',
                'images/Player/Kitty/running/kitty_running_3.png',
                'images/Player/Kitty/running/kitty_running_4.png',
                'images/Player/Kitty/running/kitty_running_5.png',
            ],
            jumping: [
                'images/Player/Kitty/jumping/kitty_jumping_1.png',
                'images/Player/Kitty/jumping/kitty_jumping_2.png',
                'images/Player/Kitty/jumping/kitty_jumping_3.png',
                'images/Player/Kitty/jumping/kitty_jumping_4.png',
            ],
            attack: [
                'images/Player/Kitty/attack/kitty_attack_1.png',
                'images/Player/Kitty/attack/kitty_attack_2.png',
            ],
            collision: ['images/Player/Kitty/collision/kitty_collision_1.png'],
            defeat: [
                'images/Player/Kitty/defeat/kitty_defeat_1.png',
                'images/Player/Kitty/defeat/kitty_defeat_2.png',
            ],
        },
        enemies: {
            ground: [
                'images/Enemy/Cheese_Ground/cheese_ground_1.png',
                'images/Enemy/Cheese_Ground/cheese_ground_2.png',
                'images/Enemy/Cheese_Ground/cheese_ground_3.png',
                'images/Enemy/Cheese_Ground/cheese_ground_4.png',
            ],
            flying: [
                'images/Enemy/Cheese_Flying/cheese_flying_1.png',
                'images/Enemy/Cheese_Flying/cheese_flying_2.png',
                'images/Enemy/Cheese_Flying/cheese_flying_3.png',
                'images/Enemy/Cheese_Flying/cheese_flying_4.png',
            ],
        },
        health: 'images/Player/health/health.png',
        ending: 'images/Ending/end_1.jpg',
    };

    /* ==========================================
       IMAGE CACHE
       ========================================== */

    const imageCache = {};

    /**
     * Loads a single image into the cache.
     * @param {string} path - Relative file path to the image.
     * @returns {Promise<HTMLImageElement>} Resolves with the loaded image.
     */
    function loadImage(path) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () {
                imageCache[path] = img;
                resolve(img);
            };
            img.onerror = function () {
                reject(new Error('Failed to load: ' + path));
            };
            img.src = path;
        });
    }

    /**
     * Recursively collects every image path from a nested object.
     * @param {Object|Array|string} node - Current node in the asset tree.
     * @param {string[]} out - Accumulator array.
     * @returns {string[]} All collected paths.
     */
    function collectPaths(node, out) {
        if (typeof node === 'string') {
            out.push(node);
        } else if (Array.isArray(node)) {
            node.forEach(function (n) { collectPaths(n, out); });
        } else if (node && typeof node === 'object') {
            Object.keys(node).forEach(function (k) { collectPaths(node[k], out); });
        }
        return out;
    }

    /**
     * Preloads every image referenced in the ASSETS object.
     * @returns {Promise<void>}
     */
    function preloadAllImages() {
        var paths = collectPaths(ASSETS, []);
        return Promise.all(paths.map(loadImage));
    }

    /* ==========================================
       GAME STATE
       ========================================== */

    var STATES = { LOADING: 0, START: 1, COUNTDOWN: 2, PLAYING: 3, GAME_OVER: 4, WIN_SEQUENCE: 5, ENDING: 6 };
    var WIN_PHASES = { FLASH_WORD: 0, LAND: 1, PARTNER_RUN: 2, HEARTS: 3, PAUSE: 4, FADE_OUT: 5 };

    var game = {
        state: STATES.LOADING,
        character: 'teddy',
        score: 0,
        health: CONFIG.MAX_HEALTH,
        level: 0,
        bgScrollX: 0,
        enemies: [],
        lastSpawnTime: 0,
        countdownVal: 3,
        countdownTimer: 0,
        lastTs: 0,
        rafId: null,
        letters: [],
        letterIndex: 0,
        collectedLetters: [],
        letterWord: 'KITTY',
        lastLetterSpawn: 0,
        nextLetterDelay: 0,
    };

    var win = {
        phase: 0,
        phaseTimer: 0,
        flashCount: 0,
        partner: { x: 0, y: 0, char: '', runFrame: 0, runTimer: 0, arrived: false },
        hearts: [],
        heartSpawnTimer: 0,
    };

    var ending = {
        sentences: [
            'Heart Girl and Key Paw were jet skiing when they saw Teddy and Kitty shipwrecked on Cheese Island.',
            '"Hi Pirates, need a lift?"',
            'The four friends boarded Heart Girl\'s ship and headed home to Dunwoody, GA',
        ],
        currentSentence: 0,
        charIndex: 0,
        typeTimer: 0,
        phase: 'typing',
        holdTimer: 0,
        fadeTimer: 0,
    };

    var player = {
        x: CONFIG.PLAYER_LEFT,
        groundY: CONFIG.VIRTUAL_HEIGHT - CONFIG.PLAYER_BOTTOM,
        jumping: false,
        jumpProg: 0,
        attacking: false,
        atkTimer: 0,
        atkFrame: 0,
        hit: false,
        hitTimer: 0,
        invincible: false,
        invTimer: 0,
        defeated: false,
        defTimer: 0,
        defFrame: 0,
        runFrame: 0,
        runTimer: 0,
        jumpHeld: false,
        jumpPeakHeight: 1,
    };

    /* ==========================================
       DOM REFERENCES
       ========================================== */

    var canvas, ctx;
    var startScreen, gameScreen, gameArea;
    var countdownOverlay, countdownNumber;
    var gameOverOverlay, finalScoreEl;
    var heartsContainer, scoreDisplay;
    var lettersDisplay, winFadeOverlay;
    var endingOverlay, endingText, endingFinal, endingScore;
    var scale = 1;
    var canvasW = 0;
    var canvasH = 0;
    var isMobile = false;

    /* ==========================================
       INPUT STATE
       ========================================== */

    var gpJumpPrev = false;
    var gpConfirmPrev = false;
    var gpBtn2Prev = false;
    var gpBtn14Prev = false;
    var gpBtn15Prev = false;

    /* ==========================================
       UTILITY FUNCTIONS
       ========================================== */

    /**
     * Returns the cached image for a given asset path.
     * @param {string} path - The asset path.
     * @returns {HTMLImageElement} The cached image element.
     */
    function img(path) {
        return imageCache[path];
    }

    /**
     * Returns the render width for a sprite scaled to a target height.
     * @param {HTMLImageElement} image - The source image.
     * @param {number} targetH - Desired height in virtual pixels.
     * @returns {number} Corresponding width in virtual pixels.
     */
    function spriteW(image, targetH) {
        return targetH * (image.naturalWidth / image.naturalHeight);
    }

    /**
     * Tests whether two axis-aligned rectangles overlap.
     * @param {number} ax - Left edge of rect A.
     * @param {number} ay - Top edge of rect A.
     * @param {number} aw - Width of rect A.
     * @param {number} ah - Height of rect A.
     * @param {number} bx - Left edge of rect B.
     * @param {number} by - Top edge of rect B.
     * @param {number} bw - Width of rect B.
     * @param {number} bh - Height of rect B.
     * @returns {boolean} True when the rectangles overlap.
     */
    function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
    }

    /* ==========================================
       GAME AREA SIZING
       ========================================== */

    /**
     * Recalculates the game area dimensions and canvas resolution
     * based on the current viewport size and background aspect ratio.
     */
    function resizeGameArea() {
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var aspect = CONFIG.VIRTUAL_WIDTH / CONFIG.VIRTUAL_HEIGHT;
        var areaW, areaH;

        if (vh > vw) {
            areaW = vw;
            areaH = vw / aspect;
            if (areaH > vh) { areaH = vh; areaW = vh * aspect; }
            gameArea.style.top = '0';
            gameArea.style.left = '50%';
            gameArea.style.transform = 'translateX(-50%)';
        } else {
            areaH = vh;
            areaW = vh * aspect;
            if (areaW > vw) { areaW = vw; areaH = vw / aspect; }
            gameArea.style.top = '50%';
            gameArea.style.left = '50%';
            gameArea.style.transform = 'translate(-50%, -50%)';
        }

        gameArea.style.width = areaW + 'px';
        gameArea.style.height = areaH + 'px';

        var dpr = window.devicePixelRatio || 1;
        canvas.width = areaW * dpr;
        canvas.height = areaH * dpr;
        canvas.style.width = areaW + 'px';
        canvas.style.height = areaH + 'px';

        canvasW = areaW;
        canvasH = areaH;
        scale = canvasH / CONFIG.VIRTUAL_HEIGHT;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /* ==========================================
       INPUT HANDLING
       ========================================== */

    /**
     * Binds keyboard listeners for character select, gameplay, and restart.
     */
    function setupKeyboard() {
        document.addEventListener('keydown', function (e) {
            if (game.state === STATES.START) {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    toggleCharacter();
                } else if (e.key === 'Enter') {
                    beginCountdown();
                }
            } else if (game.state === STATES.PLAYING) {
                if ((e.key === 'z' || e.key === 'Z') && !e.repeat) { doJump(); }
                if ((e.key === 'x' || e.key === 'X') && !e.repeat) { doAttack(); }
            } else if (game.state === STATES.GAME_OVER) {
                if (e.key === 'Enter') { restartGame(); }
            } else if (game.state === STATES.ENDING) {
                if (e.key === 'Enter') { restartFromEnding(); }
            }
        });

        document.addEventListener('keyup', function (e) {
            if (e.key === 'z' || e.key === 'Z') { releaseJump(); }
        });
    }

    /**
     * Binds touch and click listeners for mobile start, character select,
     * jump, attack, and restart controls.
     */
    function setupTouch() {
        document.querySelectorAll('.character-option').forEach(function (el) {
            el.addEventListener('click', function () {
                if (game.state === STATES.START) {
                    selectCharacter(el.dataset.character);
                }
            });
        });

        var startBtn = document.querySelector('.btn-start');
        if (startBtn) {
            startBtn.addEventListener('click', function () {
                if (game.state === STATES.START) { beginCountdown(); }
            });
        }

        var jumpBtn = document.getElementById('btn-jump');
        var atkBtn = document.getElementById('btn-attack');
        if (jumpBtn) {
            jumpBtn.addEventListener('touchstart', function (e) {
                e.preventDefault();
                if (game.state === STATES.PLAYING) { doJump(); }
            });
            jumpBtn.addEventListener('touchend', function (e) {
                e.preventDefault();
                releaseJump();
            });
        }
        if (atkBtn) {
            atkBtn.addEventListener('touchstart', function (e) {
                e.preventDefault();
                if (game.state === STATES.PLAYING) { doAttack(); }
            });
        }

        var restartBtn = document.querySelector('.btn-restart');
        if (restartBtn) {
            restartBtn.addEventListener('click', function () {
                if (game.state === STATES.GAME_OVER) { restartGame(); }
            });
        }

        var endingRestartBtn = document.querySelector('.btn-ending-restart');
        if (endingRestartBtn) {
            endingRestartBtn.addEventListener('click', function () {
                if (game.state === STATES.ENDING) { restartFromEnding(); }
            });
        }

        var endingDesktopBtn = document.querySelector('.ending-play-again__desktop');
        if (endingDesktopBtn) {
            endingDesktopBtn.addEventListener('click', function () {
                if (game.state === STATES.ENDING) { restartFromEnding(); }
            });
        }
    }

    /**
     * Reads the first connected gamepad and triggers jump / attack
     * on rising-edge button presses.
     */
    function pollGamepad() {
        var pads = navigator.getGamepads ? navigator.getGamepads() : [];
        for (var i = 0; i < pads.length; i++) {
            var gp = pads[i];
            if (!gp) { continue; }

            var btn0  = gp.buttons[0]  && gp.buttons[0].pressed;
            var btn2  = gp.buttons[2]  && gp.buttons[2].pressed;
            var btn9  = gp.buttons[9]  && gp.buttons[9].pressed;
            var btn12 = gp.buttons[12] && gp.buttons[12].pressed;
            var btn14 = gp.buttons[14] && gp.buttons[14].pressed;
            var btn15 = gp.buttons[15] && gp.buttons[15].pressed;

            /* D-pad left / right – toggle character on select screen */
            if (game.state === STATES.START) {
                if ((btn14 && !gpBtn14Prev) || (btn15 && !gpBtn15Prev)) {
                    toggleCharacter();
                }
            }

            /* Confirm (b[0] / Menu) – acts as Enter on non-gameplay screens */
            var confirmNow = btn0 || btn9;
            if (confirmNow && !gpConfirmPrev) {
                if (game.state === STATES.START) { beginCountdown(); }
                if (game.state === STATES.GAME_OVER) { restartGame(); }
                if (game.state === STATES.ENDING) { restartFromEnding(); }
            }

            /* Jump (d-pad up / b[0]) during gameplay */
            var jumpNow = btn12 || btn0;
            if (game.state === STATES.PLAYING) {
                if (jumpNow && !gpJumpPrev) { doJump(); }
                if (gpJumpPrev && !jumpNow) { releaseJump(); }
            }

            /* Attack (b[2]) during gameplay */
            if (btn2 && !gpBtn2Prev) {
                if (game.state === STATES.PLAYING) { doAttack(); }
            }

            gpBtn14Prev = btn14;
            gpBtn15Prev = btn15;
            gpConfirmPrev = confirmNow;
            gpJumpPrev = jumpNow;
            gpBtn2Prev = btn2;
            break;
        }
    }

    /* ==========================================
       START SCREEN
       ========================================== */

    /**
     * Transitions to the character-select start screen.
     */
    function showStartScreen() {
        game.state = STATES.START;
        startScreen.classList.remove('hidden');
        gameScreen.classList.add('hidden');
        selectCharacter('teddy');
    }

    /**
     * Highlights a character on the start screen.
     * @param {string} name - 'teddy' or 'kitty'.
     */
    function selectCharacter(name) {
        game.character = name;
        document.querySelectorAll('.select-arrow').forEach(function (a) {
            a.classList.add('hidden');
        });
        var sel = document.querySelector(
            '.character-option[data-character="' + name + '"] .select-arrow'
        );
        if (sel) { sel.classList.remove('hidden'); }
    }

    /**
     * Switches the selected character between teddy and kitty.
     */
    function toggleCharacter() {
        selectCharacter(game.character === 'teddy' ? 'kitty' : 'teddy');
    }

    /* ==========================================
       COUNTDOWN
       ========================================== */

    /**
     * Initiates the 3-2-1 countdown before gameplay begins.
     */
    function beginCountdown() {
        if (game.state !== STATES.START) { return; }
        game.state = STATES.COUNTDOWN;
        game.countdownVal = 3;
        game.countdownTimer = 0;

        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        countdownOverlay.classList.remove('hidden');
        gameOverOverlay.classList.add('hidden');

        resetGameState();
        resizeGameArea();
        renderHUD();

        game.lastTs = performance.now();
        if (!game.rafId) {
            game.rafId = requestAnimationFrame(loop);
        }
    }

    /**
     * Advances the countdown timer, transitioning to PLAYING when done.
     * @param {number} dt - Elapsed milliseconds since last frame.
     */
    function tickCountdown(dt) {
        game.countdownTimer += dt;
        if (game.countdownTimer >= CONFIG.COUNTDOWN_MS) {
            game.countdownTimer -= CONFIG.COUNTDOWN_MS;
            game.countdownVal--;
            if (game.countdownVal <= 0) {
                countdownOverlay.classList.add('hidden');
                game.state = STATES.PLAYING;
                game.lastSpawnTime = performance.now();
                game.lastLetterSpawn = performance.now();
                return;
            }
        }
        countdownNumber.textContent = game.countdownVal;
    }

    /* ==========================================
       GAME STATE RESET
       ========================================== */

    /**
     * Reinitialises all mutable game and player data for a new round.
     */
    function resetGameState() {
        game.score = 0;
        game.health = CONFIG.MAX_HEALTH;
        game.level = 0;
        game.bgScrollX = 0;
        game.enemies = [];

        game.letterWord = letterWord(game.character);
        game.letterIndex = 0;
        game.collectedLetters = [];
        game.letters = [];
        game.lastLetterSpawn = 0;
        game.nextLetterDelay = letterSpawnDelay();
        if (lettersDisplay) { renderLetterHUD(); }

        player.jumping = false;
        player.jumpProg = 0;
        player.jumpHeld = false;
        player.jumpPeakHeight = 1;
        player.attacking = false;
        player.atkTimer = 0;
        player.atkFrame = 0;
        player.hit = false;
        player.hitTimer = 0;
        player.invincible = false;
        player.invTimer = 0;
        player.defeated = false;
        player.defTimer = 0;
        player.defFrame = 0;
        player.runFrame = 0;
        player.runTimer = 0;
        player.groundY = CONFIG.VIRTUAL_HEIGHT - CONFIG.PLAYER_BOTTOM;
    }

    /* ==========================================
       DIFFICULTY HELPERS
       ========================================== */

    /**
     * Returns the current background scroll speed in virtual px/s.
     * @returns {number}
     */
    function scrollSpeed() {
        return CONFIG.BASE_SCROLL_SPEED * (1 + game.level * CONFIG.SPEED_INCREASE_PER_LVL);
    }

    /**
     * Returns the current enemy travel speed in virtual px/s.
     * @returns {number}
     */
    function enemySpeed() {
        return CONFIG.BASE_ENEMY_SPEED * (1 + game.level * CONFIG.SPEED_INCREASE_PER_LVL);
    }

    /**
     * Returns the current spawn interval in milliseconds.
     * @returns {number}
     */
    function spawnInterval() {
        var iv = CONFIG.BASE_SPAWN_INTERVAL / (1 + game.level * CONFIG.SPAWN_DECREASE_PER_LVL);
        return Math.max(iv, CONFIG.MIN_SPAWN_INTERVAL);
    }

    /* ==========================================
       BACKGROUND SYSTEM
       ========================================== */

    /**
     * Advances the background scroll offset.
     * @param {number} dt - Elapsed milliseconds.
     */
    function updateBackground(dt) {
        game.bgScrollX += scrollSpeed() * (dt / 1000);
    }

    /**
     * Draws the two visible background panels to the canvas.
     */
    function renderBackground() {
        var pw = canvasW;
        var total = pw * 4;
        var scroll = ((game.bgScrollX * scale) % total + total) % total;

        var first = Math.floor(scroll / pw);
        var off = scroll % pw;

        for (var i = 0; i < 2; i++) {
            var idx = (first + i) % 4;
            var x = -off + i * pw;
            var bgImg = img(ASSETS.backgrounds[idx]);
            if (bgImg) {
                ctx.drawImage(bgImg, x, 0, pw, canvasH);
            }
        }
    }

    /* ==========================================
       PLAYER SYSTEM
       ========================================== */

    /**
     * Requests a jump if the player is grounded and alive.
     */
    function doJump() {
        if (player.jumping || player.defeated) { return; }
        player.jumping = true;
        player.jumpProg = 0;
        player.jumpHeld = true;
        player.jumpPeakHeight = 1;
    }

    /**
     * Called when the jump button is released; enables early descent.
     */
    function releaseJump() {
        player.jumpHeld = false;
    }

    /**
     * Requests an attack if not already attacking, hit, or dead.
     */
    function doAttack() {
        if (player.attacking || player.defeated || player.hit) { return; }
        player.attacking = true;
        player.atkTimer = 0;
        player.atkFrame = 0;
    }

    /**
     * Handles the player taking a hit (loses a heart or triggers defeat).
     */
    function onPlayerHit() {
        if (player.invincible || player.defeated) { return; }
        game.health--;
        renderHUD();

        if (game.health <= 0) {
            player.defeated = true;
            player.defTimer = 0;
            player.defFrame = 0;
            player.attacking = false;
            player.hit = false;
            if (player.jumping && player.jumpProg < 0.5) {
                player.jumpPeakHeight = Math.sin(player.jumpProg * Math.PI);
                player.jumpProg = 0.5;
            }
            return;
        }

        player.hit = true;
        player.hitTimer = 0;
        player.invincible = true;
        player.invTimer = 0;
        player.attacking = false;
    }

    /**
     * Advances every player timer and animation counter.
     * @param {number} dt - Elapsed milliseconds.
     */
    function updatePlayer(dt) {
        var hitDuration = CONFIG.HIT_FLASH_MS * CONFIG.HIT_FLASH_COUNT * 2;

        /* Defeat state */
        if (player.defeated) {
            if (player.jumping) {
                player.jumpProg += dt / CONFIG.JUMP_DURATION;
                if (player.jumpProg >= 1) {
                    player.jumping = false;
                    player.jumpProg = 0;
                    player.defTimer = 0;
                }
                return;
            }
            player.defTimer += dt;
            if (player.defFrame === 0 && player.defTimer >= CONFIG.DEFEAT_FRAME1_MS) {
                player.defFrame = 1;
                showGameOver();
            }
            return;
        }

        /* Hit flash */
        if (player.hit) {
            player.hitTimer += dt;
            if (player.hitTimer >= hitDuration) { player.hit = false; }
        }

        /* Invincibility */
        if (player.invincible) {
            player.invTimer += dt;
            if (player.invTimer >= hitDuration) { player.invincible = false; }
        }

        /* Attack */
        if (player.attacking) {
            player.atkTimer += dt;
            if (player.atkTimer < CONFIG.ATTACK_FRAME_MS) {
                player.atkFrame = 0;
            } else if (player.atkTimer < CONFIG.ATTACK_FRAME_MS * 2) {
                player.atkFrame = 1;
            } else {
                player.attacking = false;
            }
        }

        /* Jump arc */
        if (player.jumping) {
            player.jumpProg += dt / CONFIG.JUMP_DURATION;
            if (!player.jumpHeld && player.jumpProg < 0.5) {
                player.jumpPeakHeight = Math.sin(player.jumpProg * Math.PI);
                player.jumpProg = 0.5;
            }
            if (player.jumpProg >= 1) {
                player.jumping = false;
                player.jumpProg = 0;
                player.jumpHeld = false;
                player.jumpPeakHeight = 1;
                player.runFrame = 0;
                player.runTimer = 0;
            }
        }

        /* Run animation */
        if (!player.jumping) {
            player.runTimer += dt;
            var frames = ASSETS[game.character].running.length;
            if (player.runTimer >= CONFIG.RUN_FRAME_MS) {
                player.runTimer -= CONFIG.RUN_FRAME_MS;
                player.runFrame = (player.runFrame + 1) % frames;
            }
        }
    }

    /**
     * Returns the vertical offset produced by the current jump arc.
     * @returns {number} Offset in virtual pixels (0 on ground).
     */
    function jumpOffset() {
        if (!player.jumping) { return 0; }
        return CONFIG.VIRTUAL_HEIGHT * CONFIG.JUMP_HEIGHT_RATIO *
               player.jumpPeakHeight * Math.sin(player.jumpProg * Math.PI);
    }

    /**
     * Maps jump progress to one of four animation frame indices.
     * @returns {number} Frame index 0-3.
     */
    function jumpFrame() {
        var p = player.jumpProg;
        if (p < 0.03) { return 0; }
        if (p < 0.40) { return 1; }
        if (p < 0.60) { return 2; }
        return 3;
    }

    /**
     * Resolves the current sprite image and render dimensions for the player.
     * @returns {{img: HTMLImageElement, w: number, h: number}}
     */
    function playerSprite() {
        var c = game.character;
        var h = CONFIG.PLAYER_HEIGHT;
        var sprite;

        if (player.defeated) {
            sprite = img(ASSETS[c].defeat[player.defFrame]);
        } else if (player.hit) {
            sprite = img(ASSETS[c].collision[0]);
        } else if (player.attacking) {
            sprite = img(ASSETS[c].attack[player.atkFrame]);
        } else if (player.jumping) {
            sprite = img(ASSETS[c].jumping[jumpFrame()]);
        } else {
            sprite = img(ASSETS[c].running[player.runFrame]);
        }

        return { img: sprite, w: spriteW(sprite, h), h: h };
    }

    /**
     * Computes the player's body hitbox in virtual coordinates.
     * @returns {{x:number, y:number, w:number, h:number}}
     */
    function playerHitbox() {
        var jOff = jumpOffset();
        var h = CONFIG.PLAYER_HEIGHT;
        var c = game.character;
        var refImg = img(ASSETS[c].running[0]);
        var refW = spriteW(refImg, h);
        var padX = refW * 0.15;
        var padY = h * 0.10;
        return {
            x: player.x + padX,
            y: player.groundY - jOff - h + padY,
            w: refW - padX * 2,
            h: h - padY * 2,
        };
    }

    /**
     * Computes the player's extended attack hitbox.
     * @returns {{x:number, y:number, w:number, h:number}}
     */
    function playerAttackBox() {
        var base = playerHitbox();
        var c = game.character;
        var atkImg = img(ASSETS[c].attack[0]);
        var atkW = spriteW(atkImg, CONFIG.PLAYER_HEIGHT);
        return { x: player.x, y: base.y, w: atkW * 0.85, h: base.h };
    }

    /**
     * Draws the player sprite to the canvas, handling hit-flash visibility.
     */
    function renderPlayer() {
        if (player.hit) {
            var cycle = CONFIG.HIT_FLASH_MS * 2;
            if ((player.hitTimer % cycle) > CONFIG.HIT_FLASH_MS) { return; }
        }

        var sp = playerSprite();
        var jOff = jumpOffset();
        var dx = player.x * scale;
        var dy = (player.groundY - jOff - sp.h) * scale;
        var dw = sp.w * scale;
        var dh = sp.h * scale;

        ctx.drawImage(sp.img, dx, dy, dw, dh);
    }

    /* ==========================================
       ENEMY SYSTEM
       ========================================== */

    /**
     * Creates a new enemy object positioned just off the right edge.
     * @param {string} type - 'ground' or 'flying'.
     * @returns {Object} The new enemy descriptor.
     */
    function createEnemy(type) {
        var eh = CONFIG.ENEMY_HEIGHT;
        var ground = CONFIG.VIRTUAL_HEIGHT - CONFIG.PLAYER_BOTTOM;
        var y;

        if (type === 'ground') {
            y = ground - eh;
        } else {
            var minY = ground - CONFIG.VIRTUAL_HEIGHT * CONFIG.JUMP_HEIGHT_RATIO - CONFIG.PLAYER_HEIGHT;
            var maxY = ground - eh - CONFIG.PLAYER_HEIGHT * 0.3;
            y = minY + Math.random() * (maxY - minY);
        }

        return {
            type: type,
            x: CONFIG.VIRTUAL_WIDTH + 20,
            y: y,
            w: eh,
            h: eh,
            frame: 0,
            frameTimer: 0,
            scored: false,
            dying: false,
            dyingTimer: 0,
            dead: false,
        };
    }

    /**
     * Spawns a new enemy when the spawn-interval timer has elapsed.
     * @param {number} now - Current timestamp in ms.
     */
    function trySpawn(now) {
        if (now - game.lastSpawnTime >= spawnInterval()) {
            var type = Math.random() < CONFIG.FLYING_CHANCE ? 'flying' : 'ground';
            game.enemies.push(createEnemy(type));
            game.lastSpawnTime = now;
        }
    }

    /**
     * Moves and animates every active enemy, awards dodge-score, and
     * removes dead or off-screen enemies.
     * @param {number} dt - Elapsed milliseconds.
     */
    function updateEnemies(dt) {
        var speed = enemySpeed();

        for (var i = 0; i < game.enemies.length; i++) {
            var e = game.enemies[i];

            if (e.dying) {
                e.dyingTimer += dt;
                if (e.dyingTimer >= CONFIG.ENEMY_FLASH_MS * CONFIG.ENEMY_FLASH_COUNT * 2) {
                    e.dead = true;
                }
                continue;
            }

            e.x -= speed * (dt / 1000);

            e.frameTimer += dt;
            if (e.frameTimer >= CONFIG.ENEMY_ANIM_MS) {
                e.frameTimer -= CONFIG.ENEMY_ANIM_MS;
                e.frame = (e.frame + 1) % 4;
            }

            if (!e.scored && e.x + e.w < player.x) {
                e.scored = true;
                addScore(CONFIG.POINTS_JUMP_OVER);
            }
        }

        game.enemies = game.enemies.filter(function (e) {
            return !e.dead && e.x + e.w > -50;
        });
    }

    /**
     * Draws every visible enemy, mirrored horizontally, with dying-flash logic.
     */
    function renderEnemies() {
        for (var i = 0; i < game.enemies.length; i++) {
            var e = game.enemies[i];

            if (e.dying) {
                var cyc = CONFIG.ENEMY_FLASH_MS * 2;
                if ((e.dyingTimer % cyc) > CONFIG.ENEMY_FLASH_MS) { continue; }
            }

            var paths = ASSETS.enemies[e.type];
            var sprite = img(paths[e.frame]);
            if (!sprite) { continue; }

            var dx = e.x * scale;
            var dy = e.y * scale;
            var dw = e.w * scale;
            var dh = e.h * scale;

            ctx.save();
            ctx.translate(dx + dw, dy);
            ctx.scale(-1, 1);
            ctx.drawImage(sprite, 0, 0, dw, dh);
            ctx.restore();
        }
    }

    /* ==========================================
       COLLISION DETECTION
       ========================================== */

    /**
     * Tests every enemy against the player's body and attack hitboxes,
     * triggering hits or enemy defeats as appropriate.
     */
    function checkCollisions() {
        if (player.defeated) { return; }

        var pb = playerHitbox();

        for (var i = 0; i < game.enemies.length; i++) {
            var e = game.enemies[i];
            if (e.dying || e.dead) { continue; }

            var pad = e.w * 0.15;
            var ex = e.x + pad;
            var ey = e.y + pad;
            var ew = e.w - pad * 2;
            var eh = e.h - pad * 2;

            if (player.attacking) {
                var ab = playerAttackBox();
                if (rectsOverlap(ab.x, ab.y, ab.w, ab.h, ex, ey, ew, eh)) {
                    e.dead = true;
                    addScore(CONFIG.POINTS_ATTACK);
                    continue;
                }
            }

            if (!player.invincible &&
                rectsOverlap(pb.x, pb.y, pb.w, pb.h, ex, ey, ew, eh)) {
                onPlayerHit();
            }
        }
    }

    /* ==========================================
       LETTER SYSTEM
       ========================================== */

    function letterWord(character) {
        return character === 'teddy' ? 'KITTY' : 'TEDDY';
    }

    function letterSpawnDelay() {
        var range = CONFIG.LETTER_SPAWN_MAX - CONFIG.LETTER_SPAWN_MIN;
        return CONFIG.LETTER_SPAWN_MIN + Math.random() * range;
    }

    function letterSpeed() {
        return CONFIG.BASE_ENEMY_SPEED * 0.85 * (1 + game.level * CONFIG.LETTER_SPEED_SCALE_PER_LVL);
    }

    function createLetter(charStr, index) {
        var ground = CONFIG.VIRTUAL_HEIGHT - CONFIG.PLAYER_BOTTOM;
        var minY = ground - CONFIG.VIRTUAL_HEIGHT * CONFIG.JUMP_HEIGHT_RATIO - CONFIG.PLAYER_HEIGHT;
        var maxY = ground - CONFIG.LETTER_SIZE - CONFIG.PLAYER_HEIGHT * 0.3;
        var y = minY + Math.random() * (maxY - minY);

        return {
            char: charStr,
            index: index,
            x: CONFIG.VIRTUAL_WIDTH + 20,
            y: y,
            baseY: y,
            age: 0,
            collected: false,
        };
    }

    function trySpawnLetter(now) {
        if (game.letterIndex >= game.letterWord.length) { return; }
        if (game.letters.length > 0) { return; }
        if (now - game.lastLetterSpawn < game.nextLetterDelay) { return; }

        var ch = game.letterWord[game.letterIndex];
        game.letters.push(createLetter(ch, game.letterIndex));
        game.lastLetterSpawn = now;
        game.nextLetterDelay = letterSpawnDelay();
    }

    function updateLetters(dt) {
        var speed = letterSpeed();
        for (var i = 0; i < game.letters.length; i++) {
            var l = game.letters[i];
            if (l.collected) { continue; }

            l.x -= speed * (dt / 1000);
            l.age += dt / 1000;
            l.y = l.baseY + Math.sin(l.age * CONFIG.LETTER_SWERVE_FREQ * Math.PI * 2) * CONFIG.LETTER_SWERVE_AMP;
        }

        game.letters = game.letters.filter(function (l) {
            return !l.collected && l.x + CONFIG.LETTER_SIZE > -50;
        });
    }

    function checkLetterCollisions() {
        if (player.defeated) { return; }
        var pb = playerHitbox();
        var ab = player.attacking ? playerAttackBox() : null;

        for (var i = 0; i < game.letters.length; i++) {
            var l = game.letters[i];
            if (l.collected) { continue; }

            var lx = l.x;
            var ly = l.y;
            var lw = CONFIG.LETTER_SIZE;
            var lh = CONFIG.LETTER_SIZE;

            var hit = rectsOverlap(pb.x, pb.y, pb.w, pb.h, lx, ly, lw, lh);
            if (!hit && ab) {
                hit = rectsOverlap(ab.x, ab.y, ab.w, ab.h, lx, ly, lw, lh);
            }

            if (hit) {
                l.collected = true;
                game.collectedLetters.push(l.index);
                game.letterIndex++;
                addScore(CONFIG.POINTS_LETTER);
                renderLetterHUD();

                if (game.letterIndex >= game.letterWord.length) {
                    startWinSequence();
                }
            }
        }
    }

    function renderLetters() {
        for (var i = 0; i < game.letters.length; i++) {
            var l = game.letters[i];
            if (l.collected) { continue; }

            var dx = l.x * scale;
            var dy = l.y * scale;
            var size = CONFIG.LETTER_SIZE * scale;
            var rotation = Math.sin(l.age * CONFIG.LETTER_ROTATION_FREQ * Math.PI * 2) *
                           (CONFIG.LETTER_ROTATION_DEG * Math.PI / 180);

            ctx.save();
            ctx.translate(dx + size / 2, dy + size);
            ctx.rotate(rotation);

            ctx.font = 'bold ' + Math.round(size * 0.8) + 'px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = 'rgba(0,0,0,0.7)';
            ctx.lineWidth = Math.max(2, size * 0.06);
            ctx.strokeText(l.char, 0, 0);
            ctx.fillText(l.char, 0, 0);

            ctx.restore();
        }
    }

    function renderLetterHUD() {
        if (!lettersDisplay) { return; }
        lettersDisplay.innerHTML = '';
        for (var i = 0; i < game.letterWord.length; i++) {
            var span = document.createElement('span');
            span.className = 'hud__letter-slot';
            span.textContent = game.letterWord[i];
            if (game.collectedLetters.indexOf(i) !== -1) {
                span.classList.add('hud__letter-slot--collected');
            }
            lettersDisplay.appendChild(span);
        }
    }

    /* ==========================================
       WIN SEQUENCE
       ========================================== */

    function startWinSequence() {
        game.state = STATES.WIN_SEQUENCE;
        game.enemies = [];
        game.letters = [];

        win.phase = WIN_PHASES.FLASH_WORD;
        win.phaseTimer = 0;
        win.hearts = [];
        win.heartSpawnTimer = 0;

        var slots = lettersDisplay.querySelectorAll('.hud__letter-slot');
        for (var i = 0; i < slots.length; i++) {
            slots[i].classList.add('hud__letter-slot--flash');
        }
    }

    function initPartner() {
        var partnerChar = game.character === 'teddy' ? 'kitty' : 'teddy';
        win.partner.char = partnerChar;
        win.partner.x = CONFIG.VIRTUAL_WIDTH + 20;
        win.partner.y = player.groundY;
        win.partner.runFrame = 0;
        win.partner.runTimer = 0;
        win.partner.arrived = false;
    }

    function updatePartner(dt) {
        if (win.partner.arrived) { return; }

        win.partner.x -= CONFIG.WIN_PARTNER_SPEED * (dt / 1000);

        win.partner.runTimer += dt;
        var frames = ASSETS[win.partner.char].running.length;
        if (win.partner.runTimer >= CONFIG.RUN_FRAME_MS) {
            win.partner.runTimer -= CONFIG.RUN_FRAME_MS;
            win.partner.runFrame = (win.partner.runFrame + 1) % frames;
        }

        var pSprite = img(ASSETS[game.character].idle[0]);
        var playerRight = player.x + spriteW(pSprite, CONFIG.PLAYER_HEIGHT);
        var targetX = playerRight + CONFIG.WIN_PARTNER_GAP;

        if (win.partner.x <= targetX) {
            win.partner.x = targetX;
            win.partner.arrived = true;
        }
    }

    function updateWinHearts(dt) {
        win.heartSpawnTimer += dt;
        if (win.phase === WIN_PHASES.HEARTS && win.heartSpawnTimer >= CONFIG.WIN_HEART_SPAWN_INTERVAL) {
            win.heartSpawnTimer -= CONFIG.WIN_HEART_SPAWN_INTERVAL;

            var partnerSprite = img(ASSETS[win.partner.char].idle[0]);
            var partnerW = spriteW(partnerSprite, CONFIG.PLAYER_HEIGHT);
            var leftX = player.x;
            var rightX = win.partner.x + partnerW;
            var topY = player.groundY - CONFIG.PLAYER_HEIGHT;

            win.hearts.push({
                x: leftX + Math.random() * (rightX - leftX),
                startY: topY - CONFIG.WIN_HEART_FADE_IN_Y,
                endY: topY - CONFIG.WIN_HEART_FADE_OUT_Y,
                age: 0,
            });
        }

        for (var i = win.hearts.length - 1; i >= 0; i--) {
            win.hearts[i].age += dt;
            if (win.hearts[i].age >= CONFIG.WIN_HEART_DURATION) {
                win.hearts.splice(i, 1);
            }
        }
    }

    function renderWinHearts() {
        var heartImg = img(ASSETS.health);
        if (!heartImg) { return; }
        var size = CONFIG.WIN_HEART_SIZE * scale;

        for (var i = 0; i < win.hearts.length; i++) {
            var h = win.hearts[i];
            var prog = h.age / CONFIG.WIN_HEART_DURATION;
            var y = h.startY + (h.endY - h.startY) * prog;

            var alpha;
            if (prog < 0.3) {
                alpha = prog / 0.3;
            } else if (prog < 0.7) {
                alpha = 1;
            } else {
                alpha = 1 - (prog - 0.7) / 0.3;
            }

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.drawImage(heartImg, h.x * scale - size / 2, y * scale, size, size);
            ctx.restore();
        }
    }

    function renderWinSequence() {
        renderBackground();

        /* Player idle */
        if (win.phase >= WIN_PHASES.LAND) {
            var idleImg = img(ASSETS[game.character].idle[0]);
            var ph = CONFIG.PLAYER_HEIGHT;
            var pw = spriteW(idleImg, ph);
            ctx.drawImage(idleImg, player.x * scale, (player.groundY - ph) * scale, pw * scale, ph * scale);
        } else {
            renderPlayer();
        }

        /* Partner */
        if (win.phase >= WIN_PHASES.PARTNER_RUN && win.partner.char) {
            var pChar = win.partner.char;
            var pImg;
            if (win.partner.arrived) {
                pImg = img(ASSETS[pChar].idle[0]);
            } else {
                pImg = img(ASSETS[pChar].running[win.partner.runFrame]);
            }
            var pph = CONFIG.PLAYER_HEIGHT;
            var ppw = spriteW(pImg, pph);
            var ppx = win.partner.x * scale;
            var ppy = (win.partner.y - pph) * scale;
            var pdw = ppw * scale;
            var pdh = pph * scale;

            ctx.save();
            ctx.translate(ppx + pdw, ppy);
            ctx.scale(-1, 1);
            ctx.drawImage(pImg, 0, 0, pdw, pdh);
            ctx.restore();
        }

        /* Hearts */
        if (win.hearts.length > 0) {
            renderWinHearts();
        }
    }

    function updateWinSequence(dt) {
        win.phaseTimer += dt;

        switch (win.phase) {
            case WIN_PHASES.FLASH_WORD:
                updateBackground(dt);
                updatePlayer(dt);
                if (win.phaseTimer >= CONFIG.WIN_FLASH_DURATION) {
                    win.phase = WIN_PHASES.LAND;
                    win.phaseTimer = 0;
                }
                break;

            case WIN_PHASES.LAND:
                updateBackground(dt);
                updatePlayer(dt);
                if (!player.jumping) {
                    player.attacking = false;
                    win.phase = WIN_PHASES.PARTNER_RUN;
                    win.phaseTimer = 0;
                    initPartner();
                }
                break;

            case WIN_PHASES.PARTNER_RUN:
                updatePartner(dt);
                if (win.partner.arrived) {
                    win.phase = WIN_PHASES.HEARTS;
                    win.phaseTimer = 0;
                    win.heartSpawnTimer = 0;
                }
                break;

            case WIN_PHASES.HEARTS:
                updateWinHearts(dt);
                if (win.phaseTimer >= CONFIG.WIN_HEARTS_DURATION) {
                    win.phase = WIN_PHASES.PAUSE;
                    win.phaseTimer = 0;
                }
                break;

            case WIN_PHASES.PAUSE:
                updateWinHearts(dt);
                if (win.phaseTimer >= CONFIG.WIN_PAUSE_DURATION) {
                    win.phase = WIN_PHASES.FADE_OUT;
                    win.phaseTimer = 0;
                    winFadeOverlay.classList.remove('hidden');
                    winFadeOverlay.classList.add('overlay--win-fade--active');
                }
                break;

            case WIN_PHASES.FADE_OUT:
                updateWinHearts(dt);
                if (win.phaseTimer >= CONFIG.WIN_FADE_DURATION) {
                    startEnding();
                }
                break;
        }
    }

    /* ==========================================
       ENDING SCREEN
       ========================================== */

    function startEnding() {
        game.state = STATES.ENDING;

        ending.currentSentence = 0;
        ending.charIndex = 0;
        ending.typeTimer = 0;
        ending.phase = 'typing';
        ending.holdTimer = 0;
        ending.fadeTimer = 0;

        endingText.textContent = '';
        endingText.classList.remove('ending-typewriter--fade-out');
        endingFinal.classList.add('hidden');

        endingOverlay.classList.remove('hidden');
        void endingOverlay.offsetWidth;
        endingOverlay.classList.add('overlay--ending--visible');
    }

    function updateEnding(dt) {
        if (ending.phase === 'typing') {
            ending.typeTimer += dt;
            var sentence = ending.sentences[ending.currentSentence];
            while (ending.typeTimer >= CONFIG.ENDING_TYPEWRITER_MS && ending.charIndex < sentence.length) {
                ending.typeTimer -= CONFIG.ENDING_TYPEWRITER_MS;
                ending.charIndex++;
                endingText.textContent = sentence.substring(0, ending.charIndex);
            }
            if (ending.charIndex >= sentence.length) {
                ending.phase = 'holding';
                ending.holdTimer = 0;
            }
        } else if (ending.phase === 'holding') {
            ending.holdTimer += dt;
            if (ending.holdTimer >= CONFIG.ENDING_SENTENCE_HOLD) {
                ending.phase = 'fading';
                ending.fadeTimer = 0;
                endingText.classList.add('ending-typewriter--fade-out');
            }
        } else if (ending.phase === 'fading') {
            ending.fadeTimer += dt;
            if (ending.fadeTimer >= CONFIG.ENDING_SENTENCE_FADE) {
                ending.currentSentence++;
                if (ending.currentSentence >= ending.sentences.length) {
                    ending.phase = 'done';
                    showEndingFinal();
                } else {
                    ending.charIndex = 0;
                    ending.typeTimer = 0;
                    ending.phase = 'typing';
                    endingText.textContent = '';
                    endingText.classList.remove('ending-typewriter--fade-out');
                }
            }
        }
    }

    function showEndingFinal() {
        endingText.classList.add('ending-typewriter--fade-out');
        endingScore.textContent = 'Score: ' + game.score;
        endingFinal.classList.remove('hidden');
    }

    function restartFromEnding() {
        endingOverlay.classList.remove('overlay--ending--visible');
        endingOverlay.classList.add('hidden');
        winFadeOverlay.classList.remove('overlay--win-fade--active');
        winFadeOverlay.classList.add('hidden');
        if (game.rafId) {
            cancelAnimationFrame(game.rafId);
            game.rafId = null;
        }
        showStartScreen();
    }

    /* ==========================================
       SCORING & HUD
       ========================================== */

    /**
     * Increments the score and recalculates the difficulty level.
     * @param {number} pts - Points to add.
     */
    function addScore(pts) {
        game.score += pts;
        game.level = Math.floor(game.score / CONFIG.LEVEL_THRESHOLD);
        scoreDisplay.textContent = game.score;
    }

    /**
     * Rebuilds the hearts icons and score text in the HUD.
     */
    function renderHUD() {
        heartsContainer.innerHTML = '';
        for (var i = 0; i < game.health; i++) {
            var heart = document.createElement('img');
            heart.src = ASSETS.health;
            heart.className = 'heart-icon';
            heartsContainer.appendChild(heart);
        }
        scoreDisplay.textContent = game.score;
    }

    /* ==========================================
       GAME OVER
       ========================================== */

    /**
     * Displays the game-over overlay with the final score.
     */
    function showGameOver() {
        game.state = STATES.GAME_OVER;
        finalScoreEl.textContent = 'Score: ' + game.score;
        gameOverOverlay.classList.remove('hidden');
    }

    /**
     * Returns to the start screen so the player can choose again.
     */
    function restartGame() {
        gameOverOverlay.classList.add('hidden');
        winFadeOverlay.classList.remove('overlay--win-fade--active');
        winFadeOverlay.classList.add('hidden');
        endingOverlay.classList.remove('overlay--ending--visible');
        endingOverlay.classList.add('hidden');
        if (game.rafId) {
            cancelAnimationFrame(game.rafId);
            game.rafId = null;
        }
        showStartScreen();
    }

    /* ==========================================
       MAIN LOOP
       ========================================== */

    /**
     * Core requestAnimationFrame callback that dispatches to the
     * current game-state handler.
     * @param {number} ts - High-resolution timestamp from rAF.
     */
    function loop(ts) {
        var dt = Math.min(ts - game.lastTs, 50);
        game.lastTs = ts;

        pollGamepad();

        ctx.clearRect(0, 0, canvasW, canvasH);

        if (game.state === STATES.COUNTDOWN) {
            tickCountdown(dt);
            renderBackground();
            renderPlayer();
        } else if (game.state === STATES.PLAYING) {
            if (!player.defeated) {
                updateBackground(dt);
            }
            updatePlayer(dt);
            trySpawn(ts);
            updateEnemies(dt);
            trySpawnLetter(ts);
            updateLetters(dt);
            checkCollisions();
            checkLetterCollisions();

            renderBackground();
            renderEnemies();
            renderLetters();
            renderPlayer();
        } else if (game.state === STATES.WIN_SEQUENCE) {
            updateWinSequence(dt);
            renderWinSequence();
        } else if (game.state === STATES.ENDING) {
            updateEnding(dt);
        } else if (game.state === STATES.GAME_OVER) {
            renderBackground();
            renderEnemies();
            renderPlayer();
        }

        game.rafId = requestAnimationFrame(loop);
    }

    /* ==========================================
       INITIALISATION
       ========================================== */

    /**
     * Boots the game: caches DOM nodes, binds input, preloads art,
     * then shows the start screen.
     */
    function init() {
        canvas          = document.getElementById('game-canvas');
        ctx             = canvas.getContext('2d');
        startScreen     = document.getElementById('start-screen');
        gameScreen      = document.getElementById('game-screen');
        gameArea         = document.getElementById('game-area');
        countdownOverlay = document.getElementById('countdown-overlay');
        countdownNumber  = document.getElementById('countdown-number');
        gameOverOverlay  = document.getElementById('game-over-overlay');
        finalScoreEl     = document.getElementById('final-score');
        heartsContainer  = document.getElementById('hearts-container');
        scoreDisplay     = document.getElementById('score-display');
        lettersDisplay   = document.getElementById('letters-display');
        winFadeOverlay   = document.getElementById('win-fade-overlay');
        endingOverlay    = document.getElementById('ending-overlay');
        endingText       = document.getElementById('ending-text');
        endingFinal      = document.getElementById('ending-final');
        endingScore      = document.getElementById('ending-score');

        isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        document.body.classList.toggle('is-mobile', isMobile);

        setupKeyboard();
        setupTouch();

        window.addEventListener('resize', function () {
            if (game.state !== STATES.START && game.state !== STATES.LOADING && game.state !== STATES.ENDING) {
                resizeGameArea();
            }
        });

        preloadAllImages().then(function () {
            showStartScreen();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
