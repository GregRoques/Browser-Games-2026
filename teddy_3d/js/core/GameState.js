export const STATE = {
    LOADING:        'LOADING',
    TITLE:          'TITLE',
    COUNTDOWN:      'COUNTDOWN',
    PLAYING:        'PLAYING',
    STAGE_COMPLETE: 'STAGE_COMPLETE',
    GAMEOVER:       'GAMEOVER',
    VICTORY:        'VICTORY',
    ENDING:         'ENDING',
};

export class GameState {
    constructor() {
        this.current = STATE.LOADING;
        this.listeners = [];
    }

    transition(newState) {
        const prev = this.current;
        this.current = newState;
        for (const listener of this.listeners) {
            listener(newState, prev);
        }
    }

    onTransition(callback) {
        this.listeners.push(callback);
    }

    is(state) {
        return this.current === state;
    }
}
