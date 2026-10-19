import { GAMEPLAY } from '../utils/Constants.js';

export class CountdownOverlay {
    constructor() {
        this.el = document.getElementById('screen-countdown');
        this.numberEl = document.getElementById('countdown-number');
    }

    show() {
        this.el.hidden = false;
    }

    hide() {
        this.el.hidden = true;
    }

    async run() {
        this.show();

        for (let i = GAMEPLAY.COUNTDOWN_SECONDS; i >= 1; i--) {
            this.numberEl.textContent = i;
            this.numberEl.style.animation = 'none';
            // Force reflow
            void this.numberEl.offsetWidth;
            this.numberEl.style.animation = 'countdown-pop 0.8s ease-out';
            await new Promise(r => setTimeout(r, 900));
        }

        // "GO!"
        this.numberEl.textContent = 'GO!';
        this.numberEl.style.color = '#7ED957';
        this.numberEl.style.animation = 'none';
        void this.numberEl.offsetWidth;
        this.numberEl.style.animation = 'countdown-pop 0.8s ease-out';
        await new Promise(r => setTimeout(r, 600));

        // Reset
        this.numberEl.style.color = '';
        this.hide();
    }
}
