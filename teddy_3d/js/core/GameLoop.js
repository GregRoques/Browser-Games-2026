export class GameLoop {
    constructor() {
        this.running = false;
        this.updateCallback = null;
        this._rafId = null;
        this._lastTime = 0;
    }

    start(updateCallback) {
        this.updateCallback = updateCallback;
        this.running = true;
        this._lastTime = performance.now();
        this._tick();
    }

    stop() {
        this.running = false;
        if (this._rafId) {
            cancelAnimationFrame(this._rafId);
            this._rafId = null;
        }
    }

    _tick() {
        if (!this.running) return;
        this._rafId = requestAnimationFrame(() => this._tick());

        const now = performance.now();
        let dt = (now - this._lastTime) / 1000;
        this._lastTime = now;

        // Clamp delta to avoid spiral of death
        if (dt > 0.1) dt = 0.1;

        if (this.updateCallback) {
            this.updateCallback(dt);
        }
    }
}
