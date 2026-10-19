import * as THREE from 'three';
import { DIMS } from '../utils/Constants.js';
import { MAT } from '../utils/MaterialPalette.js';

export class FloorSegment {
    constructor() {
        this.mesh = new THREE.Group();
        this.index = 0;
        this.active = false;
        this._build();
    }

    _build() {
        // Main floor
        const floorGeo = new THREE.BoxGeometry(DIMS.SEGMENT_WIDTH, 0.5, DIMS.SEGMENT_LENGTH);
        const floor = new THREE.Mesh(floorGeo, MAT.floorStone);
        floor.position.y = -0.25;
        floor.receiveShadow = true;
        this.mesh.add(floor);

        // Floor edge strips
        const edgeGeo = new THREE.BoxGeometry(DIMS.SEGMENT_WIDTH + 0.2, 0.1, DIMS.SEGMENT_LENGTH);
        const topEdge = new THREE.Mesh(edgeGeo, MAT.floorEdge);
        topEdge.position.y = 0.01;
        this.mesh.add(topEdge);

        // Left wall
        const wallGeo = new THREE.BoxGeometry(0.5, DIMS.WALL_HEIGHT, DIMS.SEGMENT_LENGTH);
        const leftWall = new THREE.Mesh(wallGeo, MAT.wallBrick);
        leftWall.position.set(-DIMS.WALL_OFFSET, DIMS.WALL_HEIGHT / 2, 0);
        this.mesh.add(leftWall);

        // Right wall
        const rightWall = new THREE.Mesh(wallGeo, MAT.wallBrick);
        rightWall.position.set(DIMS.WALL_OFFSET, DIMS.WALL_HEIGHT / 2, 0);
        this.mesh.add(rightWall);

        // Wall trim top
        const trimGeo = new THREE.BoxGeometry(0.6, 0.3, DIMS.SEGMENT_LENGTH);
        const leftTrim = new THREE.Mesh(trimGeo, MAT.wallTrim);
        leftTrim.position.set(-DIMS.WALL_OFFSET, DIMS.WALL_HEIGHT, 0);
        this.mesh.add(leftTrim);
        const rightTrim = new THREE.Mesh(trimGeo, MAT.wallTrim);
        rightTrim.position.set(DIMS.WALL_OFFSET, DIMS.WALL_HEIGHT, 0);
        this.mesh.add(rightTrim);

        // Ceiling
        const ceilGeo = new THREE.BoxGeometry(DIMS.SEGMENT_WIDTH + 1, 0.3, DIMS.SEGMENT_LENGTH);
        const ceiling = new THREE.Mesh(ceilGeo, MAT.wallMain);
        ceiling.position.y = DIMS.CEILING_HEIGHT;
        this.mesh.add(ceiling);
    }

    place(zPosition, segmentIndex) {
        this.index = segmentIndex;
        this.mesh.position.z = zPosition;
        this.active = true;
        this.mesh.visible = true;
    }

    hide() {
        this.active = false;
        this.mesh.visible = false;
    }
}
