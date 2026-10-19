import { lerp } from '../utils/MathUtils.js';

export class CameraController {
    constructor(camera) {
        this.camera = camera;
        // Offsets from teddy
        this.offsetY = 3.5;
        this.offsetZ = 7;
        this.lookAheadZ = -4;
        this.smoothing = 3;
    }

    update(teddyPosition, dt) {
        const targetX = teddyPosition.x * 0.3; // subtle follow on X
        const targetY = teddyPosition.y + this.offsetY;
        const targetZ = teddyPosition.z + this.offsetZ;

        this.camera.position.x = lerp(this.camera.position.x, targetX, this.smoothing * dt);
        this.camera.position.y = lerp(this.camera.position.y, targetY, this.smoothing * dt);
        this.camera.position.z = lerp(this.camera.position.z, targetZ, this.smoothing * dt);

        // Look at a point ahead of teddy
        this.camera.lookAt(
            teddyPosition.x * 0.15,
            teddyPosition.y + 0.5,
            teddyPosition.z + this.lookAheadZ
        );
    }

    reset() {
        this.camera.position.set(0, 4, 8);
        this.camera.lookAt(0, 1, -5);
    }
}
