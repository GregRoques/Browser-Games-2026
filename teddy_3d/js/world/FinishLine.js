import * as THREE from 'three';
import { MAT } from '../utils/MaterialPalette.js';
import { DIMS } from '../utils/Constants.js';

export class FinishLine {
    constructor() {
        this.mesh = new THREE.Group();
        this.active = false;
        this._build();
    }

    _build() {
        // Two poles
        const poleGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);

        const leftPole = new THREE.Mesh(poleGeo, MAT.finishPole);
        leftPole.position.set(-3, 2, 0);
        this.mesh.add(leftPole);

        const rightPole = new THREE.Mesh(poleGeo, MAT.finishPole);
        rightPole.position.set(3, 2, 0);
        this.mesh.add(rightPole);

        // Banner
        const bannerGeo = new THREE.BoxGeometry(6, 1.2, 0.1);
        const banner = new THREE.Mesh(bannerGeo, MAT.finishBanner);
        banner.position.set(0, 3.5, 0);
        this.mesh.add(banner);

        // Checkered pattern on banner
        const squareGeo = new THREE.BoxGeometry(0.5, 0.5, 0.12);
        const whiteMat = new THREE.MeshToonMaterial({ color: 0xFFFFFF });
        const darkMat = new THREE.MeshToonMaterial({ color: 0x2D1B4E });

        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 10; col++) {
                const mat = (row + col) % 2 === 0 ? whiteMat : darkMat;
                const sq = new THREE.Mesh(squareGeo, mat);
                sq.position.set(-2.25 + col * 0.5, 3.2 + row * 0.5, 0.02);
                this.mesh.add(sq);
            }
        }

        // Star decoration on top
        const starGeo = new THREE.OctahedronGeometry(0.3, 0);
        const starMat = new THREE.MeshToonMaterial({
            color: 0xFFE66D,
            emissive: 0xFFE66D,
            emissiveIntensity: 0.5,
        });
        const star = new THREE.Mesh(starGeo, starMat);
        star.position.set(0, 4.3, 0);
        star.scale.set(1, 1.5, 0.5);
        this.mesh.add(star);
        this.star = star;

        this.mesh.visible = false;
    }

    place(z) {
        this.mesh.position.z = z;
        this.mesh.visible = true;
        this.active = true;
    }

    hide() {
        this.mesh.visible = false;
        this.active = false;
    }

    update(dt) {
        if (!this.active) return;
        this.star.rotation.y += dt * 2;
    }

    getZ() {
        return this.mesh.position.z;
    }
}
