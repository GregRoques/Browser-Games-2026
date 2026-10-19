import { Game } from './core/Game.js';

const game = new Game();

async function boot() {
    try {
        await game.init();
        await game.start();

        // Temp: skip to ending via ?ending in URL
        if (window.location.search.includes('ending')) {
            game.gameState.transition('ENDING');
            game.endingScreen.startSequence();
        }
    } catch (err) {
        console.error('Failed to start Ghastly Halloween Dash:', err);
    }
}

boot();
