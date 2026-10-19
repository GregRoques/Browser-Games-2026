export class LoadingScreen {
    constructor() {
        this.el = document.getElementById('screen-loading');
        this.bar = document.getElementById('loading-bar');
        this.text = document.getElementById('loading-text');
    }

    show() {
        this.el.hidden = false;
    }

    hide() {
        this.el.hidden = true;
    }

    setProgress(pct) {
        this.bar.style.width = `${pct}%`;
    }

    setText(msg) {
        this.text.textContent = msg;
    }

    async animateLoading() {
        // Simulate loading progress
        const steps = [
            { pct: 20, text: 'Setting up the haunted house...' },
            { pct: 40, text: 'Waking the monsters...' },
            { pct: 60, text: 'Dressing the heroes...' },
            { pct: 80, text: 'Lighting the candles...' },
            { pct: 100, text: 'Ready!' },
        ];

        for (const step of steps) {
            this.setProgress(step.pct);
            this.setText(step.text);
            await new Promise(r => setTimeout(r, 400));
        }

        await new Promise(r => setTimeout(r, 300));
    }
}
