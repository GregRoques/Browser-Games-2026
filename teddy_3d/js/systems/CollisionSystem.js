import * as THREE from 'three';
import { DIMS, PHYSICS } from '../utils/Constants.js';

export class CollisionSystem {
    constructor() {
        this._tempBox = new THREE.Box3();
    }

    checkEnemies(teddy, enemies) {
        if (teddy.isDamaged) return null; // invincible

        const teddyBox = teddy.getBoundingBox();

        for (const enemy of enemies) {
            if (!enemy.active) continue;

            const enemyBox = enemy.getBoundingBox();

            if (teddyBox.intersectsBox(enemyBox)) {
                return enemy;
            }
        }
        return null;
    }

    checkProjectiles(teddy, projectiles) {
        if (teddy.isDamaged) return null; // invincible

        const teddyBox = teddy.getBoundingBox();

        for (const proj of projectiles) {
            if (!proj.active) continue;

            const projBox = proj.getBoundingBox();

            if (teddyBox.intersectsBox(projBox)) {
                proj.active = false;
                proj.mesh.visible = false;
                return proj;
            }
        }
        return null;
    }

    checkFinishLine(teddy, finishLine) {
        if (!finishLine.active) return false;

        const teddyZ = teddy.mesh.position.z;
        const finishZ = finishLine.mesh.position.z;

        // Teddy reaches finish when passing through
        return teddyZ <= finishZ + 2 && teddyZ >= finishZ - 2;
    }
}
