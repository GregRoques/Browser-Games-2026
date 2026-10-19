import * as THREE from 'three';
import { DIMS } from '../utils/Constants.js';

export class Pitfall {
    constructor() {
        this.mesh = new THREE.Group();
        this.active = false;
        this.zStart = 0;
        this.zEnd = 0;
        this.lanes = []; // which lanes have the gap
        this._build();
    }

    _build() {
        // Walls still present but floor missing
        // Just create wall segments for the gap
        const wallGeo = new THREE.BoxGeometry(0.5, DIMS.WALL_HEIGHT, DIMS.SEGMENT_LENGTH);
        const wallMat = new THREE.MeshToonMaterial({ color: 0x3A2555 });

        const leftWall = new THREE.Mesh(wallGeo, wallMat);
        leftWall.position.set(-DIMS.WALL_OFFSET, DIMS.WALL_HEIGHT / 2, 0);
        this.mesh.add(leftWall);

        const rightWall = new THREE.Mesh(wallGeo, wallMat);
        rightWall.position.set(DIMS.WALL_OFFSET, DIMS.WALL_HEIGHT / 2, 0);
        this.mesh.add(rightWall);

        // Ceiling
        const ceilGeo = new THREE.BoxGeometry(DIMS.SEGMENT_WIDTH + 1, 0.3, DIMS.SEGMENT_LENGTH);
        const ceiling = new THREE.Mesh(ceilGeo, wallMat);
        ceiling.position.y = DIMS.CEILING_HEIGHT;
        this.mesh.add(ceiling);

        // Dark void below
        const voidGeo = new THREE.BoxGeometry(DIMS.SEGMENT_WIDTH, 0.1, DIMS.SEGMENT_LENGTH);
        const voidMat = new THREE.MeshBasicMaterial({ color: 0x050208 });
        const voidMesh = new THREE.Mesh(voidGeo, voidMat);
        voidMesh.position.y = -2;
        this.mesh.add(voidMesh);
    }

    place(zPosition, lanes) {
        this.mesh.position.z = zPosition;
        this.zStart = zPosition - DIMS.SEGMENT_LENGTH / 2;
        this.zEnd = zPosition + DIMS.SEGMENT_LENGTH / 2;
        this.lanes = lanes;
        this.active = true;
        this.mesh.visible = true;
    }

    hide() {
        this.active = false;
        this.mesh.visible = false;
    }

    coversLane(laneIndex) {
        return this.lanes.includes(laneIndex);
    }
}
