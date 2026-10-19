import { SceneManager } from './SceneManager.js';
import { GameState, STATE } from './GameState.js';
import { GameLoop } from './GameLoop.js';
import { Teddy } from '../entities/Teddy.js';
import { HeartGirl } from '../entities/HeartGirl.js';
import { EnemyFactory } from '../entities/EnemyFactory.js';
import { StageConfig } from '../world/StageConfig.js';
import { StageGenerator } from '../world/StageGenerator.js';
import { InputManager } from '../systems/InputManager.js';
import { PhysicsSystem } from '../systems/PhysicsSystem.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { CameraController } from '../systems/CameraController.js';
import { HealthSystem } from '../systems/HealthSystem.js';
import { ProgressTracker } from '../systems/ProgressTracker.js';
import { HUD } from '../ui/HUD.js';
import { LoadingScreen } from '../ui/LoadingScreen.js';
import { TitleScreen } from '../ui/TitleScreen.js';
import { CountdownOverlay } from '../ui/CountdownOverlay.js';
import { GameOverScreen } from '../ui/GameOverScreen.js';
import { VictoryScreen } from '../ui/VictoryScreen.js';
import { EndingScreen } from '../ui/EndingScreen.js';
import { MobileControls } from '../ui/MobileControls.js';
import { GAMEPLAY } from '../utils/Constants.js';

export class Game {
    constructor() {
        this.sceneManager = new SceneManager();
        this.gameState = new GameState();
        this.gameLoop = new GameLoop();
        this.stageConfig = new StageConfig();
        this.inputManager = new InputManager();
        this.physicsSystem = new PhysicsSystem();
        this.collisionSystem = new CollisionSystem();
        this.healthSystem = new HealthSystem();
        this.progressTracker = new ProgressTracker();

        // Created after scene init
        this.teddy = null;
        this.selectedCharacter = 'teddy';
        this.cameraController = null;
        this.enemyFactory = null;
        this.stageGenerator = null;

        // UI
        this.hud = new HUD();
        this.loadingScreen = new LoadingScreen();
        this.titleScreen = new TitleScreen();
        this.countdown = new CountdownOverlay();
        this.gameOverScreen = new GameOverScreen();
        this.victoryScreen = new VictoryScreen();
        this.endingScreen = new EndingScreen();
        this.mobileControls = new MobileControls();

        // Stage complete screen ref
        this.stageCompleteEl = document.getElementById('screen-stage-complete');
        this.stageCompleteTextEl = document.getElementById('stage-complete-text');

        // Victory screen character name
        this.victoryCharNameEl = document.getElementById('victory-char-name');
        this.victoryEmojiEl = document.getElementById('victory-emoji');

        // Respawn tracking
        this._respawning = false;
    }

    async init() {
        // Init 3D scene
        this.sceneManager.init();

        // Teddy
        this.teddy = new Teddy();
        this.sceneManager.scene.add(this.teddy.mesh);

        // Camera
        this.cameraController = new CameraController(this.sceneManager.camera);

        // Enemy factory & world
        this.enemyFactory = new EnemyFactory();
        this.stageGenerator = new StageGenerator(this.sceneManager.scene, this.enemyFactory);

        // Input
        this.inputManager.init();
        this._bindInput();

        // Health callbacks
        this.healthSystem.onHeartsChanged = (h) => {
            this.hud.updateHearts(h);
            if (h < GAMEPLAY.MAX_HEARTS) {
                this.hud.animateHeartLoss(h);
            }
        };
        this.healthSystem.onLivesChanged = (l) => this.hud.updateLives(l);

        // Ending screen callbacks
        this.endingScreen.onPlayAgain = () => this._playAgainFromEnding();
        this.endingScreen.onCharacterSelect = () => this._characterSelectFromEnding();

        // State transitions
        this.gameState.onTransition((newState, oldState) => {
            this._onStateChange(newState, oldState);
        });
    }

    async start() {
        // Show loading
        this.loadingScreen.show();
        await this.loadingScreen.animateLoading();
        this.loadingScreen.hide();

        // Start render loop (always rendering for background)
        this.gameLoop.start((dt) => this._update(dt));

        // Go to title
        this.gameState.transition(STATE.TITLE);
    }

    _bindInput() {
        this.inputManager.onJump = () => {
            if (this.gameState.is(STATE.PLAYING)) {
                this.teddy.jump();
            }
        };
        this.inputManager.onConfirm = () => {
            if (this.gameState.is(STATE.TITLE)) {
                this._startGame();
            } else if (this.gameState.is(STATE.GAMEOVER)) {
                this._retry();
            } else if (this.gameState.is(STATE.VICTORY)) {
                this._retry();
            }
        };
    }

    _onStateChange(newState, oldState) {
        // Hide all screens
        this.titleScreen.hide();
        this.countdown.hide();
        this.gameOverScreen.hide();
        this.victoryScreen.hide();
        this.endingScreen.hide();
        this.hud.hide();
        this.mobileControls.hide();
        if (this.stageCompleteEl) this.stageCompleteEl.hidden = true;

        switch (newState) {
            case STATE.TITLE:
                this.titleScreen.show();
                break;
            case STATE.COUNTDOWN:
                this.hud.show();
                this.mobileControls.show();
                break;
            case STATE.PLAYING:
                this.hud.show();
                this.mobileControls.show();
                break;
            case STATE.STAGE_COMPLETE:
                this.hud.show();
                break;
            case STATE.GAMEOVER:
                this.gameOverScreen.show();
                break;
            case STATE.VICTORY:
                this.victoryScreen.show();
                break;
            case STATE.ENDING:
                // Handled by endingScreen.startSequence() in _onStageComplete
                break;
        }
    }

    async _startGame() {
        // Swap character if selection changed
        const selected = this.titleScreen.getSelectedCharacter();
        if (selected !== this.selectedCharacter || !this.teddy) {
            this.selectedCharacter = selected;
            if (this.teddy) {
                this.sceneManager.scene.remove(this.teddy.mesh);
            }
            this.teddy = selected === 'heartgirl' ? new HeartGirl() : new Teddy();
            this.sceneManager.scene.add(this.teddy.mesh);
        }

        // Update victory screen text for selected character
        const charName = selected === 'heartgirl' ? 'Heart Girl' : 'Teddy';
        const charEmoji = selected === 'heartgirl' ? '\u{1F467} \u{1F389}' : '\u{1F9F8} \u{1F389}';
        if (this.victoryCharNameEl) this.victoryCharNameEl.textContent = charName;
        if (this.victoryEmojiEl) this.victoryEmojiEl.textContent = charEmoji;

        // Reset everything
        this.stageConfig.reset();
        this.healthSystem.fullReset();
        this.teddy.reset();
        this.cameraController.reset();

        await this._startStage();
    }

    async _startStage() {
        const cfg = this.stageConfig.config;

        // Update UI
        this.hud.updateHearts(this.healthSystem.hearts);
        this.hud.updateLives(this.healthSystem.lives);
        this.hud.updateStage(this.stageConfig.stageNumber, cfg.name);

        // Setup world
        this.sceneManager.updateFog(cfg.fogDensity, cfg.fogColor);
        this.stageGenerator.startStage(this.stageConfig.currentStage);
        this.progressTracker.reset();
        this.teddy.reset();
        this.cameraController.reset();

        // Countdown
        this.gameState.transition(STATE.COUNTDOWN);
        await this.countdown.run();

        // Play!
        this.gameState.transition(STATE.PLAYING);
    }

    _update(dt) {
        // Always render
        this.sceneManager.render();

        // Update fill light to follow teddy
        if (this.teddy && this.sceneManager.fillLight) {
            this.sceneManager.fillLight.position.x = this.teddy.mesh.position.x;
            this.sceneManager.fillLight.position.z = this.teddy.mesh.position.z - 2;
        }

        if (this.gameState.is(STATE.PLAYING)) {
            this._updatePlaying(dt);
        } else if (this.gameState.is(STATE.STAGE_COMPLETE) || this.gameState.is(STATE.ENDING)) {
            // Teddy dances during stage complete and ending fade
            this.teddy.update(dt);
        }
    }

    _updatePlaying(dt) {
        if (this._respawning) return;

        const speed = this.stageConfig.speed;

        // Update world
        this.stageGenerator.update(dt, speed, this.teddy.mesh.position);

        // Poll directional input for continuous movement
        const left = this.inputManager.isLeftHeld();
        const right = this.inputManager.isRightHeld();
        this.teddy.setMoveDirection(left && !right ? -1 : right && !left ? 1 : 0);

        // Update teddy
        this.teddy.update(dt);

        // Physics
        this.physicsSystem.update(this.teddy, dt, this.inputManager);

        // Camera
        this.cameraController.update(this.teddy.mesh.position, dt);

        // Progress
        this.progressTracker.update(speed, dt);

        // Check finish line
        const finishLine = this.stageGenerator.getFinishLine();
        if (this.collisionSystem.checkFinishLine(this.teddy, finishLine)) {
            this._onStageComplete();
            return;
        }

        // Check enemies
        const hitEnemy = this.collisionSystem.checkEnemies(this.teddy, this.stageGenerator.getActiveEnemies());
        if (hitEnemy) {
            this._onEnemyHit();
        }

        // Check projectiles
        const hitProj = this.collisionSystem.checkProjectiles(this.teddy, this.stageGenerator.getActiveProjectiles());
        if (hitProj) {
            this._onEnemyHit();
        }
    }

    _onEnemyHit() {
        const result = this.healthSystem.takeDamage();
        if (result === 'gameover') {
            this._onGameOver();
        } else if (result === 'died') {
            this._onLifeLost();
        } else {
            // Just damaged, apply invincibility
            this.teddy.takeDamage(GAMEPLAY.INVINCIBILITY_TIME);
        }
    }

    async _onGameOver() {
        this._respawning = true;

        // Tip over animation then game over screen
        await this.teddy.tipOver();

        this._respawning = false;
        this.gameState.transition(STATE.GAMEOVER);
    }

    async _onLifeLost() {
        this._respawning = true;

        // Tip over face-first and fade out
        await this.teddy.tipOver();

        // Reset hearts for the new attempt
        this.healthSystem.resetHearts();
        this.hud.updateHearts(this.healthSystem.hearts);
        this.hud.updateLives(this.healthSystem.lives);

        // Restart the current stage from the beginning
        this._respawning = false;
        await this._startStage();
    }

    async _onStageComplete() {
        // Show stage complete
        const stageNum = this.stageConfig.stageNumber;

        if (stageNum >= GAMEPLAY.TOTAL_STAGES) {
            // Final stage - play happy dance then ending cinematic
            this.teddy.startDancing();
            if (this.stageCompleteTextEl) {
                this.stageCompleteTextEl.textContent = `Stage ${stageNum} Complete!`;
            }
            if (this.stageCompleteEl) this.stageCompleteEl.hidden = false;
            this.gameState.transition(STATE.STAGE_COMPLETE);

            // Let dance play before starting ending
            await new Promise(r => setTimeout(r, GAMEPLAY.STAGE_COMPLETE_DELAY * 1000));

            // Transition to ending (dance continues during fade to black)
            this.gameState.transition(STATE.ENDING);
            await this.endingScreen.startSequence();
            return;
        }

        // Show stage complete screen
        this.teddy.startDancing();
        if (this.stageCompleteTextEl) {
            this.stageCompleteTextEl.textContent = `Stage ${stageNum} Complete!`;
        }
        if (this.stageCompleteEl) this.stageCompleteEl.hidden = false;
        this.gameState.transition(STATE.STAGE_COMPLETE);

        // Wait, then start next stage
        await new Promise(r => setTimeout(r, GAMEPLAY.STAGE_COMPLETE_DELAY * 1000));

        this.teddy.stopDancing();
        this.stageConfig.nextStage();
        this.healthSystem.resetHearts();
        await this._startStage();
    }

    async _retry() {
        this.teddy.stopDancing();
        await this._startGame();
    }

    async _playAgainFromEnding() {
        this.teddy.stopDancing();
        await this._startGame();
    }

    _characterSelectFromEnding() {
        this.teddy.stopDancing();
        this.gameState.transition(STATE.TITLE);
    }
}
