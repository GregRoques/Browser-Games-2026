import { DIMS } from '../utils/Constants.js';

export class ProgressTracker {
    constructor() {
        this.distanceTraveled = 0;
        this.stageLength = DIMS.STAGE_LENGTH * DIMS.SEGMENT_LENGTH;
    }

    update(speed, dt) {
        this.distanceTraveled += speed * dt;
    }

    getProgress() {
        return Math.min(this.distanceTraveled / this.stageLength, 1.0);
    }

    isStageComplete() {
        return this.distanceTraveled >= this.stageLength;
    }

    reset() {
        this.distanceTraveled = 0;
    }
}
