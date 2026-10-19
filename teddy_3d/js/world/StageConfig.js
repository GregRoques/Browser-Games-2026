import { STAGES } from '../utils/Constants.js';

export class StageConfig {
    constructor() {
        this.currentStage = 0;
    }

    get config() {
        return STAGES[this.currentStage];
    }

    get speed() {
        return this.config.speed;
    }

    get name() {
        return this.config.name;
    }

    get stageNumber() {
        return this.currentStage + 1;
    }

    nextStage() {
        if (this.currentStage < STAGES.length - 1) {
            this.currentStage++;
            return true;
        }
        return false; // no more stages
    }

    reset() {
        this.currentStage = 0;
    }

    setStage(index) {
        this.currentStage = Math.max(0, Math.min(index, STAGES.length - 1));
    }
}
