export class GameOverScreen {
    constructor() {
        this.el = document.getElementById('screen-gameover');
    }

    show() {
        this.el.hidden = false;
    }

    hide() {
        this.el.hidden = true;
    }
}
