export class MobileControls {
    constructor() {
        this.el = document.getElementById('mobile-controls');
        this.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    show() {
        if (this.isMobile) {
            this.el.hidden = false;
        }
    }

    hide() {
        this.el.hidden = true;
    }
}
