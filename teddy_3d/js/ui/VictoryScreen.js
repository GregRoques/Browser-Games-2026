export class VictoryScreen {
    constructor() {
        this.el = document.getElementById('screen-victory');
    }

    show() {
        this.el.hidden = false;
    }

    hide() {
        this.el.hidden = true;
    }
}
