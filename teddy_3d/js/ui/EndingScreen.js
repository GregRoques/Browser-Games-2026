export class EndingScreen {
    constructor() {
        this.el = document.getElementById('screen-ending');
        this.imageEl = document.getElementById('ending-image');
        this.textEl = document.getElementById('ending-text');
        this.optionsEl = document.getElementById('ending-options');

        this.onPlayAgain = null;
        this.onCharacterSelect = null;

        this._initButtons();
    }

    _initButtons() {
        document.getElementById('btn-play-again').addEventListener('click', () => {
            if (this.onPlayAgain) this.onPlayAgain();
        });
        document.getElementById('btn-character-select').addEventListener('click', () => {
            if (this.onCharacterSelect) this.onCharacterSelect();
        });
    }

    show() {
        this.el.hidden = false;
    }

    hide() {
        this.el.hidden = true;
        this.el.classList.remove('active');
        this.imageEl.classList.remove('visible');
        this.imageEl.src = '';
        this.textEl.textContent = '';
        this.textEl.style.opacity = '';
        this.textEl.style.transition = '';
        this.optionsEl.classList.remove('visible');
    }

    async startSequence() {
        // Reset visual state
        this.el.classList.remove('active');
        this.imageEl.classList.remove('visible');
        this.imageEl.src = '';
        this.textEl.textContent = '';
        this.textEl.style.opacity = '';
        this.textEl.style.transition = '';
        this.optionsEl.classList.remove('visible');

        // Show the element (opacity: 0 via CSS)
        this.el.hidden = false;
        void this.el.offsetHeight;

        // Fade to black (covers the 3D dance scene)
        this.el.classList.add('active');
        await this._wait(2200);

        // Preload both ending images
        await Promise.all([
            this._preloadImage('images/Ending/1.jpeg'),
            this._preloadImage('images/Ending/2.jpeg'),
        ]);

        // === IMAGE 1 ===
        this.imageEl.src = 'images/Ending/1.jpeg';
        await this._wait(50);
        this.imageEl.classList.add('visible');
        await this._wait(1600);

        // Typewriter text 1
        await this._typeText(
            `\u201CWe made it,\u201D cries Heart Girl. \u201CThat sure was scary\u2026 let\u2019s not go wandering in any haunted houses again!\u201D`
        );

        // Sit for 8 seconds
        await this._wait(8000);

        // === TRANSITION TO IMAGE 2 ===
        this.imageEl.classList.remove('visible');
        this.textEl.style.transition = 'opacity 1.5s ease';
        this.textEl.style.opacity = '0';
        await this._wait(1600);

        // Clear text, swap image
        this.textEl.textContent = '';
        this.textEl.style.transition = '';
        this.textEl.style.opacity = '';

        this.imageEl.src = 'images/Ending/2.jpeg';
        await this._wait(50);
        this.imageEl.classList.add('visible');
        await this._wait(1600);

        // Typewriter text 2
        await this._typeText(
            `The friends went home and enjoyed their Halloween candy. It was the perfect ending to the perfect spooky holiday.`
        );

        // Sit for 8 seconds
        await this._wait(8000);

        // === GAME OVER OPTIONS ===
        this.imageEl.classList.remove('visible');
        this.textEl.style.transition = 'opacity 1.5s ease';
        this.textEl.style.opacity = '0';
        await this._wait(1600);

        this.textEl.textContent = '';
        this.imageEl.src = '';

        // Show options with fade
        this.optionsEl.classList.add('visible');
    }

    async _typeText(text) {
        this.textEl.textContent = '';
        for (let i = 0; i < text.length; i++) {
            this.textEl.textContent += text[i];
            await this._wait(40);
        }
    }

    _preloadImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = src;
        });
    }

    _wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
