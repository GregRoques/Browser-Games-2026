import * as THREE from 'three';
import { MAT } from '../utils/MaterialPalette.js';
import { DIMS } from '../utils/Constants.js';

export class Ghost {
    constructor(lane, z) {
        this.mesh = new THREE.Group();
        this.active = true;
        this.type = 'flying';
        this.animTime = Math.random() * Math.PI * 2;
        this.baseX = DIMS.LANE_POSITIONS[lane];
        this._build();

        this.mesh.position.set(this.baseX, 1.5, z);
    }

    _build() {
        // --- Kawaii chibi ghost (very transparent) ---

        // Blobby body (draped cone shape)
        const bodyGeo = new THREE.ConeGeometry(0.35, 0.8, 8);
        bodyGeo.scale(1, 1, 0.8);
        const body = new THREE.Mesh(bodyGeo, MAT.ghostBody);
        body.rotation.x = Math.PI; // point down
        body.position.y = 0.15;
        this.mesh.add(body);
        this.body = body;

        // Big round head
        const headGeo = new THREE.SphereGeometry(0.3, 12, 10);
        const head = new THREE.Mesh(headGeo, MAT.ghostBody);
        head.position.y = 0.5;
        this.mesh.add(head);
        this.head = head;

        // Huge oval kawaii eyes (dark, sad-cute)
        const eyeGeo = new THREE.SphereGeometry(0.1, 10, 8);
        eyeGeo.scale(0.9, 1.1, 0.8);
        const shineGeo = new THREE.SphereGeometry(0.04, 6, 4);
        const shine2Geo = new THREE.SphereGeometry(0.02, 6, 4);
        const shineMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

        const leftEye = new THREE.Mesh(eyeGeo, MAT.ghostEye);
        leftEye.position.set(-0.11, 0.04, 0.24);
        head.add(leftEye);
        const ls = new THREE.Mesh(shineGeo, shineMat);
        ls.position.set(0.02, 0.03, 0.05);
        leftEye.add(ls);
        const ls2 = new THREE.Mesh(shine2Geo, shineMat);
        ls2.position.set(-0.02, -0.03, 0.05);
        leftEye.add(ls2);

        const rightEye = new THREE.Mesh(eyeGeo, MAT.ghostEye);
        rightEye.position.set(0.11, 0.04, 0.24);
        head.add(rightEye);
        const rs = new THREE.Mesh(shineGeo, shineMat);
        rs.position.set(0.02, 0.03, 0.05);
        rightEye.add(rs);
        const rs2 = new THREE.Mesh(shine2Geo, shineMat);
        rs2.position.set(-0.02, -0.03, 0.05);
        rightEye.add(rs2);

        // Blush marks (pink-blue tint for ghost)
        const blushGeo = new THREE.SphereGeometry(0.05, 8, 6);
        blushGeo.scale(1.3, 0.8, 0.3);
        const blushMat = new THREE.MeshToonMaterial({ color: 0xBBCCFF, transparent: true, opacity: 0.4 });
        const lb = new THREE.Mesh(blushGeo, blushMat);
        lb.position.set(-0.2, -0.04, 0.2);
        head.add(lb);
        const rb = new THREE.Mesh(blushGeo, blushMat);
        rb.position.set(0.2, -0.04, 0.2);
        head.add(rb);

        // Little "o" mouth (surprised/cute)
        const mouthGeo = new THREE.TorusGeometry(0.04, 0.012, 6, 8);
        const mouthMat = new THREE.MeshBasicMaterial({ color: 0x666688 });
        const mouth = new THREE.Mesh(mouthGeo, mouthMat);
        mouth.position.set(0, -0.1, 0.26);
        head.add(mouth);

        // Stubby ghost arms (little nubs)
        const armGeo = new THREE.SphereGeometry(0.08, 8, 6);
        armGeo.scale(1, 0.7, 0.8);
        this.leftArm = new THREE.Mesh(armGeo, MAT.ghostBody);
        this.leftArm.position.set(-0.3, 0.25, 0);
        this.mesh.add(this.leftArm);
        this.rightArm = new THREE.Mesh(armGeo, MAT.ghostBody);
        this.rightArm.position.set(0.3, 0.25, 0);
        this.mesh.add(this.rightArm);

        // Tail wisps (cute little drips at bottom)
        this.wisps = [];
        for (let i = 0; i < 3; i++) {
            const wispGeo = new THREE.ConeGeometry(0.05, 0.2, 4);
            const wisp = new THREE.Mesh(wispGeo, MAT.ghostBody);
            wisp.position.set((i - 1) * 0.14, -0.25, 0);
            wisp.rotation.x = Math.PI;
            this.mesh.add(wisp);
            this.wisps.push(wisp);
        }
    }

    update(dt) {
        this.animTime += dt;
        // Gentle float
        this.mesh.position.y = 1.5 + Math.sin(this.animTime * 2) * 0.3;
        // Side-to-side drift
        this.mesh.position.x = this.baseX + Math.sin(this.animTime * 1.5) * 0.5;
        // Gentle rotation wobble
        this.mesh.rotation.y = Math.sin(this.animTime * 0.8) * 0.15;
        // Body sway
        this.body.rotation.z = Math.sin(this.animTime * 1.2) * 0.08;
        // Head tilt
        this.head.rotation.z = Math.sin(this.animTime * 1.5) * 0.1;
        // Arm wave
        this.leftArm.position.y = 0.25 + Math.sin(this.animTime * 3) * 0.05;
        this.rightArm.position.y = 0.25 + Math.sin(this.animTime * 3 + 1) * 0.05;
        // Wisp flutter
        for (let i = 0; i < this.wisps.length; i++) {
            this.wisps[i].rotation.z = Math.sin(this.animTime * 4 + i) * 0.2;
        }
    }

    getBoundingBox() {
        const pos = this.mesh.position;
        return new THREE.Box3(
            new THREE.Vector3(pos.x - 0.3, pos.y - 0.4, pos.z - 0.3),
            new THREE.Vector3(pos.x + 0.3, pos.y + 0.5, pos.z + 0.3)
        );
    }
}
