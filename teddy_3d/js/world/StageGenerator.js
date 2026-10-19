import * as THREE from 'three';
import { DIMS, STAGES } from '../utils/Constants.js';
import { FloorSegment } from './FloorSegment.js';
import { Decoration } from './Decoration.js';
import { FinishLine } from './FinishLine.js';
import { randomRange, randomChoice } from '../utils/MathUtils.js';

export class StageGenerator {
    constructor(scene, enemyFactory) {
        this.scene = scene;
        this.enemyFactory = enemyFactory;

        // Pools
        this.floorPool = [];
        this.activeFloors = [];
        this.decorationMeshes = [];
        this.activeEnemies = [];
        this.activeProjectiles = [];

        this.finishLine = new FinishLine();
        this.scene.add(this.finishLine.mesh);

        // Tracking
        this.nextSegmentIndex = 0;
        this.worldOffset = 0;
        this.stageConfig = null;

        this._initPools();
    }

    _initPools() {
        for (let i = 0; i < DIMS.CHUNKS_AHEAD + DIMS.CHUNKS_BEHIND + 5; i++) {
            const floor = new FloorSegment();
            floor.mesh.visible = false;
            this.scene.add(floor.mesh);
            this.floorPool.push(floor);
        }
    }

    startStage(stageIndex) {
        this.stageConfig = STAGES[stageIndex];
        this.nextSegmentIndex = 0;
        this.worldOffset = 0;

        this._clearAll();

        for (let i = 0; i < DIMS.CHUNKS_AHEAD; i++) {
            this._generateSegment(i);
        }

        const finishZ = -DIMS.STAGE_LENGTH * DIMS.SEGMENT_LENGTH;
        this.finishLine.place(finishZ);

        this.nextSegmentIndex = DIMS.CHUNKS_AHEAD;
    }

    update(dt, speed, teddyPosition) {
        const scrollDist = speed * dt;
        this.worldOffset += scrollDist;

        this._moveAll(scrollDist);
        this._recycleBehind();
        this._generateAhead();

        this.finishLine.update(dt);

        // Update enemies and collect new projectiles
        for (const enemy of this.activeEnemies) {
            if (enemy.active) {
                enemy.update(dt, teddyPosition);

                // Collect projectiles from enemies that can shoot
                if (enemy.getNewProjectiles) {
                    const newProjs = enemy.getNewProjectiles();
                    for (const proj of newProjs) {
                        this.scene.add(proj.mesh);
                        this.activeProjectiles.push(proj);
                    }
                }
            }
        }

        // Update projectiles
        for (const proj of this.activeProjectiles) {
            if (proj.active) {
                proj.mesh.position.x += proj.velocity.x * dt;
                proj.mesh.position.y += proj.velocity.y * dt;
                proj.mesh.position.z += proj.velocity.z * dt;

                // Spin (for bones)
                if (proj.spin) {
                    proj.mesh.rotation.z += proj.spin * dt;
                }

                // Fire flicker animation
                if (proj.animTime !== undefined) {
                    proj.animTime += dt;
                    proj.mesh.scale.setScalar(0.9 + Math.sin(proj.animTime * 15) * 0.15);
                }
            }
        }
    }

    _moveAll(dist) {
        for (const floor of this.activeFloors) {
            floor.mesh.position.z += dist;
        }
        for (const dec of this.decorationMeshes) {
            dec.position.z += dist;
        }
        for (const enemy of this.activeEnemies) {
            if (enemy.mesh) {
                enemy.mesh.position.z += dist;
            }
        }
        for (const proj of this.activeProjectiles) {
            if (proj.mesh) {
                proj.mesh.position.z += dist;
            }
        }
        this.finishLine.mesh.position.z += dist;
    }

    _recycleBehind() {
        const behindZ = DIMS.CHUNKS_BEHIND * DIMS.SEGMENT_LENGTH;

        for (let i = this.activeFloors.length - 1; i >= 0; i--) {
            const f = this.activeFloors[i];
            if (f.mesh.position.z > behindZ) {
                f.hide();
                this.floorPool.push(f);
                this.activeFloors.splice(i, 1);
            }
        }

        for (let i = this.decorationMeshes.length - 1; i >= 0; i--) {
            if (this.decorationMeshes[i].position.z > behindZ) {
                this.scene.remove(this.decorationMeshes[i]);
                this.decorationMeshes.splice(i, 1);
            }
        }

        for (let i = this.activeEnemies.length - 1; i >= 0; i--) {
            const e = this.activeEnemies[i];
            if (e.mesh && e.mesh.position.z > behindZ) {
                e.active = false;
                e.mesh.visible = false;
                this.scene.remove(e.mesh);
                this.activeEnemies.splice(i, 1);
            }
        }

        // Clean up projectiles that went behind camera or too far ahead
        for (let i = this.activeProjectiles.length - 1; i >= 0; i--) {
            const p = this.activeProjectiles[i];
            if (!p.active || p.mesh.position.z > behindZ + 10 || p.mesh.position.z < -200) {
                p.active = false;
                this.scene.remove(p.mesh);
                this.activeProjectiles.splice(i, 1);
            }
        }
    }

    _generateAhead() {
        const targetAheadZ = -DIMS.CHUNKS_AHEAD * DIMS.SEGMENT_LENGTH;

        let iterations = 0;
        while (this.nextSegmentIndex < DIMS.STAGE_LENGTH + 5 && iterations < 3) {
            const worldZ = -this.nextSegmentIndex * DIMS.SEGMENT_LENGTH + this.worldOffset;
            if (worldZ < targetAheadZ) break;

            this._generateSegment(this.nextSegmentIndex);
            this.nextSegmentIndex++;
            iterations++;
        }
    }

    _generateSegment(index) {
        const z = -index * DIMS.SEGMENT_LENGTH + this.worldOffset;

        const isSafe = index < 4;

        if (index > DIMS.STAGE_LENGTH + 3) return;

        // Always place floor
        const floor = this.floorPool.pop();
        if (floor) {
            floor.place(z, index);
            floor.mesh.children[0].visible = true;
            floor.mesh.children[1].visible = true;
            this.activeFloors.push(floor);
        }

        // Spawn enemies
        if (!isSafe && this.enemyFactory) {
            if (Math.random() < this.stageConfig.enemyChance) {
                const type = randomChoice(this.stageConfig.enemies);
                const lane = Math.floor(Math.random() * 3);
                const enemy = this.enemyFactory.create(type, lane, z);
                if (enemy) {
                    this.scene.add(enemy.mesh);
                    this.activeEnemies.push(enemy);
                }

                // Chance for a second enemy in a different lane
                if (Math.random() < this.stageConfig.multiEnemyChance) {
                    const type2 = randomChoice(this.stageConfig.enemies);
                    let lane2 = Math.floor(Math.random() * 3);
                    // Ensure different lane
                    while (lane2 === lane) lane2 = Math.floor(Math.random() * 3);
                    const enemy2 = this.enemyFactory.create(type2, lane2, z);
                    if (enemy2) {
                        this.scene.add(enemy2.mesh);
                        this.activeEnemies.push(enemy2);
                    }
                }
            }
        }

        // Decorations
        if (Math.random() > 0.15) {
            const decs = Decoration.createRandom(z);
            for (const d of decs) {
                this.scene.add(d);
                this.decorationMeshes.push(d);
            }
        }
    }

    _clearAll() {
        for (const f of this.activeFloors) {
            f.hide();
            this.floorPool.push(f);
        }
        this.activeFloors = [];

        for (const d of this.decorationMeshes) {
            this.scene.remove(d);
        }
        this.decorationMeshes = [];

        for (const e of this.activeEnemies) {
            if (e.mesh) {
                this.scene.remove(e.mesh);
            }
        }
        this.activeEnemies = [];

        for (const p of this.activeProjectiles) {
            if (p.mesh) {
                this.scene.remove(p.mesh);
            }
        }
        this.activeProjectiles = [];

        this.finishLine.hide();
    }

    getActiveEnemies() {
        return this.activeEnemies;
    }

    getActiveProjectiles() {
        return this.activeProjectiles;
    }

    getFinishLine() {
        return this.finishLine;
    }

    destroy() {
        this._clearAll();
    }
}
