import { GAMEPLAY } from '../utils/Constants.js';

export class HUD {
    constructor() {
        this.el = document.getElementById('hud');
        this.heartsEl = document.getElementById('hud-hearts');
        this.livesEl = document.getElementById('hud-lives');
        this.stageEl = document.getElementById('hud-stage');
    }

    show() {
        this.el.hidden = false;
    }

    hide() {
        this.el.hidden = true;
    }

    updateHearts(count) {
        let html = '';
        for (let i = 0; i < GAMEPLAY.MAX_HEARTS; i++) {
            const isFull = i < count;
            const cls = isFull ? 'hud__heart' : 'hud__heart hud__heart--empty';
            html += `<span class="${cls}">${isFull ? '\u2764\uFE0F' : '\u{1F5A4}'}</span>`;
        }
        this.heartsEl.innerHTML = html;
    }

    animateHeartLoss(index) {
        const hearts = this.heartsEl.querySelectorAll('.hud__heart');
        if (hearts[index]) {
            hearts[index].classList.add('hud__heart--hit');
            setTimeout(() => hearts[index].classList.remove('hud__heart--hit'), 400);
        }
    }

    updateLives(count) {
        this.livesEl.textContent = `Lives: ${count}`;
    }

    updateStage(stageNumber, stageName) {
        this.stageEl.textContent = stageName || `Stage ${stageNumber}`;
    }
}
