export class InputManager {
    constructor() {
        this.keys = {};
        this.jumpHeld = false;
        this.leftHeld = false;
        this.rightHeld = false;

        // Callbacks (one-shot events)
        this.onJump = null;
        this.onConfirm = null;

        this._boundKeyDown = (e) => this._onKeyDown(e);
        this._boundKeyUp = (e) => this._onKeyUp(e);

        this._touchCallbacks = [];
    }

    init() {
        window.addEventListener('keydown', this._boundKeyDown);
        window.addEventListener('keyup', this._boundKeyUp);
        this._initMobileButtons();
        this._initTouchConfirm();
    }

    _initMobileButtons() {
        const btnLeft = document.getElementById('btn-left');
        const btnRight = document.getElementById('btn-right');
        const btnJump = document.getElementById('btn-jump');

        if (btnLeft) {
            btnLeft.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.leftHeld = true;
            }, { passive: false });
            btnLeft.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.leftHeld = false;
            }, { passive: false });
            btnLeft.addEventListener('touchcancel', () => { this.leftHeld = false; });
        }
        if (btnRight) {
            btnRight.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.rightHeld = true;
            }, { passive: false });
            btnRight.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.rightHeld = false;
            }, { passive: false });
            btnRight.addEventListener('touchcancel', () => { this.rightHeld = false; });
        }
        if (btnJump) {
            btnJump.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.jumpHeld = true;
                if (this.onJump) this.onJump();
            }, { passive: false });
            btnJump.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.jumpHeld = false;
            }, { passive: false });
            btnJump.addEventListener('touchcancel', () => { this.jumpHeld = false; });
        }
    }

    _initTouchConfirm() {
        const handler = (e) => {
            if (e.target.closest('.mobile-controls')) return;
            if (e.target.closest('.char-select__btn')) return;
            if (e.target.closest('.ending__btn')) return;
            if (this.onConfirm) this.onConfirm();
        };
        document.addEventListener('touchstart', handler, { passive: true });
        this._touchCallbacks.push(() => document.removeEventListener('touchstart', handler));
    }

    _onKeyDown(e) {
        if (this.keys[e.code]) return;
        this.keys[e.code] = true;

        switch (e.code) {
            case 'KeyZ':
            case 'ArrowLeft':
                this.leftHeld = true;
                break;
            case 'KeyX':
            case 'ArrowRight':
                this.rightHeld = true;
                break;
            case 'Space':
            case 'ArrowUp':
                e.preventDefault();
                this.jumpHeld = true;
                if (this.onJump) this.onJump();
                break;
            case 'Enter':
                if (this.onConfirm) this.onConfirm();
                break;
        }
    }

    _onKeyUp(e) {
        this.keys[e.code] = false;

        switch (e.code) {
            case 'KeyZ':
            case 'ArrowLeft':
                this.leftHeld = false;
                break;
            case 'KeyX':
            case 'ArrowRight':
                this.rightHeld = false;
                break;
            case 'Space':
            case 'ArrowUp':
                this.jumpHeld = false;
                break;
        }
    }

    isJumpHeld() {
        return this.jumpHeld;
    }

    isLeftHeld() {
        return this.leftHeld;
    }

    isRightHeld() {
        return this.rightHeld;
    }

    showMobileControls() {
        const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const el = document.getElementById('mobile-controls');
        if (el && isMobile) {
            el.hidden = false;
        }
    }

    hideMobileControls() {
        const el = document.getElementById('mobile-controls');
        if (el) el.hidden = true;
    }

    destroy() {
        window.removeEventListener('keydown', this._boundKeyDown);
        window.removeEventListener('keyup', this._boundKeyUp);
        for (const cb of this._touchCallbacks) cb();
    }
}
