import * as THREE from 'three';
import { MAT } from '../utils/MaterialPalette.js';
import { DIMS } from '../utils/Constants.js';

export class Bat {
    constructor(lane, z) {
        this.mesh = new THREE.Group();
        this.active = true;
        this.type = 'flying';
        this.animTime = Math.random() * Math.PI * 2;
        this._build();

        const x = DIMS.LANE_POSITIONS[lane];
        this.mesh.position.set(x, 1.3, z);
    }

    _build() {
        // --- Kawaii chibi bat ---

        // Tiny round body
        const bodyGeo = new THREE.SphereGeometry(0.14, 10, 8);
        bodyGeo.scale(1, 0.9, 0.9);
        const body = new THREE.Mesh(bodyGeo, MAT.batBody);
        this.mesh.add(body);
        this.body = body;

        // Big round head (oversized for kawaii)
        const headGeo = new THREE.SphereGeometry(0.2, 12, 10);
        const head = new THREE.Mesh(headGeo, MAT.batBody);
        head.position.set(0, 0.18, 0.05);
        this.mesh.add(head);
        this.head = head;

        // Big pointy ears
        const earGeo = new THREE.ConeGeometry(0.06, 0.18, 4);
        const leftEar = new THREE.Mesh(earGeo, MAT.batBody);
        leftEar.position.set(-0.12, 0.18, 0);
        leftEar.rotation.z = 0.2;
        head.add(leftEar);
        const rightEar = new THREE.Mesh(earGeo, MAT.batBody);
        rightEar.position.set(0.12, 0.18, 0);
        rightEar.rotation.z = -0.2;
        head.add(rightEar);

        // Inner ears (pink)
        const iearGeo = new THREE.ConeGeometry(0.03, 0.1, 4);
        const iearMat = new THREE.MeshToonMaterial({ color: 0xFF88AA });
        const lie = new THREE.Mesh(iearGeo, iearMat);
        lie.position.y = -0.02;
        lie.position.z = -0.02;
        leftEar.add(lie);
        const rie = new THREE.Mesh(iearGeo, iearMat);
        rie.position.y = -0.02;
        rie.position.z = -0.02;
        rightEar.add(rie);

        // Giant kawaii eyes
        const eyeGeo = new THREE.SphereGeometry(0.08, 10, 8);
        const shineGeo = new THREE.SphereGeometry(0.03, 6, 4);
        const shine2Geo = new THREE.SphereGeometry(0.015, 6, 4);
        const shineMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

        const leftEye = new THREE.Mesh(eyeGeo, MAT.batEye);
        leftEye.position.set(-0.08, 0.02, 0.16);
        head.add(leftEye);
        const ls = new THREE.Mesh(shineGeo, shineMat);
        ls.position.set(0.02, 0.02, 0.04);
        leftEye.add(ls);
        const ls2 = new THREE.Mesh(shine2Geo, shineMat);
        ls2.position.set(-0.02, -0.02, 0.04);
        leftEye.add(ls2);

        const rightEye = new THREE.Mesh(eyeGeo, MAT.batEye);
        rightEye.position.set(0.08, 0.02, 0.16);
        head.add(rightEye);
        const rs = new THREE.Mesh(shineGeo, shineMat);
        rs.position.set(0.02, 0.02, 0.04);
        rightEye.add(rs);
        const rs2 = new THREE.Mesh(shine2Geo, shineMat);
        rs2.position.set(-0.02, -0.02, 0.04);
        rightEye.add(rs2);

        // Blush
        const blushGeo = new THREE.SphereGeometry(0.04, 8, 6);
        blushGeo.scale(1.3, 0.8, 0.3);
        const blushMat = new THREE.MeshToonMaterial({ color: 0xFF88CC, transparent: true, opacity: 0.5 });
        const lb = new THREE.Mesh(blushGeo, blushMat);
        lb.position.set(-0.14, -0.03, 0.12);
        head.add(lb);
        const rb = new THREE.Mesh(blushGeo, blushMat);
        rb.position.set(0.14, -0.03, 0.12);
        head.add(rb);

        // Tiny fangs
        const fangGeo = new THREE.ConeGeometry(0.012, 0.04, 4);
        const fangMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const lf = new THREE.Mesh(fangGeo, fangMat);
        lf.position.set(-0.03, -0.1, 0.16);
        head.add(lf);
        const rf = new THREE.Mesh(fangGeo, fangMat);
        rf.position.set(0.03, -0.1, 0.16);
        head.add(rf);

        // Little smile
        const mouthGeo = new THREE.TorusGeometry(0.03, 0.008, 6, 8, Math.PI);
        const mouthMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
        const mouth = new THREE.Mesh(mouthGeo, mouthMat);
        mouth.position.set(0, -0.08, 0.17);
        head.add(mouth);

        // Cute rounded wings (using curved shape)
        const wingShape = new THREE.Shape();
        wingShape.moveTo(0, 0);
        wingShape.quadraticCurveTo(0.3, 0.15, 0.5, 0.05);
        wingShape.quadraticCurveTo(0.4, -0.08, 0.3, -0.02);
        wingShape.quadraticCurveTo(0.2, -0.12, 0.15, -0.05);
        wingShape.quadraticCurveTo(0.1, -0.1, 0, 0);

        const wingGeo = new THREE.ShapeGeometry(wingShape);

        this.leftWing = new THREE.Group();
        const lwMesh = new THREE.Mesh(wingGeo, MAT.batWing);
        lwMesh.scale.x = -1;
        this.leftWing.add(lwMesh);
        this.leftWing.position.set(-0.12, 0.05, 0);
        this.mesh.add(this.leftWing);

        this.rightWing = new THREE.Group();
        const rwMesh = new THREE.Mesh(wingGeo, MAT.batWing);
        this.rightWing.add(rwMesh);
        this.rightWing.position.set(0.12, 0.05, 0);
        this.mesh.add(this.rightWing);

        // Tiny feet
        const footGeo = new THREE.SphereGeometry(0.03, 6, 4);
        const footMat = new THREE.MeshToonMaterial({ color: 0x2D1B4E });
        const lfoot = new THREE.Mesh(footGeo, footMat);
        lfoot.position.set(-0.06, -0.14, 0);
        body.add(lfoot);
        const rfoot = new THREE.Mesh(footGeo, footMat);
        rfoot.position.set(0.06, -0.14, 0);
        body.add(rfoot);
    }

    update(dt) {
        this.animTime += dt;
        // Wing flapping
        const flapAngle = Math.sin(this.animTime * 10) * 0.6;
        this.leftWing.rotation.y = -flapAngle;
        this.rightWing.rotation.y = flapAngle;
        // Cute hover bob
        this.mesh.position.y = 1.3 + Math.sin(this.animTime * 3) * 0.2;
        // Head tilt
        this.head.rotation.z = Math.sin(this.animTime * 2) * 0.1;
    }

    getBoundingBox() {
        const pos = this.mesh.position;
        return new THREE.Box3(
            new THREE.Vector3(pos.x - 0.4, pos.y - 0.2, pos.z - 0.2),
            new THREE.Vector3(pos.x + 0.4, pos.y + 0.2, pos.z + 0.2)
        );
    }
}
