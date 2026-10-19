import { GAMEPLAY } from '../utils/Constants.js';

export class HealthSystem {
    constructor() {
        this.hearts = GAMEPLAY.MAX_HEARTS;
        this.lives = GAMEPLAY.MAX_LIVES;
        this.onHeartsChanged = null;
        this.onLivesChanged = null;
        this.onDeath = null;
        this.onGameOver = null;
    }

    takeDamage() {
        this.hearts--;
        if (this.onHeartsChanged) this.onHeartsChanged(this.hearts);

        if (this.hearts <= 0) {
            return this._loseLife();
        }
        return 'damaged';
    }

    _loseLife() {
        this.lives--;
        if (this.onLivesChanged) this.onLivesChanged(this.lives);

        if (this.lives <= 0) {
            if (this.onGameOver) this.onGameOver();
            return 'gameover';
        }
        if (this.onDeath) this.onDeath();
        return 'died';
    }

    loseLifeFromPit() {
        this.hearts = 0;
        if (this.onHeartsChanged) this.onHeartsChanged(this.hearts);
        return this._loseLife();
    }

    resetHearts() {
        this.hearts = GAMEPLAY.MAX_HEARTS;
        if (this.onHeartsChanged) this.onHeartsChanged(this.hearts);
    }

    fullReset() {
        this.hearts = GAMEPLAY.MAX_HEARTS;
        this.lives = GAMEPLAY.MAX_LIVES;
        if (this.onHeartsChanged) this.onHeartsChanged(this.hearts);
        if (this.onLivesChanged) this.onLivesChanged(this.lives);
    }
}
