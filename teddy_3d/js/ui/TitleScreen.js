export class TitleScreen {
    constructor() {
        this.el = document.getElementById('screen-title');
        this.selectedCharacter = 'teddy';
        this._initCharSelect();
    }

    _initCharSelect() {
        const buttons = this.el.querySelectorAll('.char-select__btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                buttons.forEach(b => b.classList.remove('char-select__btn--active'));
                btn.classList.add('char-select__btn--active');
                this.selectedCharacter = btn.dataset.char;
            });
        });
    }

    getSelectedCharacter() {
        return this.selectedCharacter;
    }

    show() {
        this.el.hidden = false;
    }

    hide() {
        this.el.hidden = true;
    }
}
