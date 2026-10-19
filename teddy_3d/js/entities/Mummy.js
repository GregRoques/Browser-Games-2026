import * as THREE from 'three';
import { MAT } from '../utils/MaterialPalette.js';
import { DIMS } from '../utils/Constants.js';

export class Mummy {
    constructor(lane, z) {
        this.mesh = new THREE.Group();
        this.active = true;
        this.type = 'ground';
        this.animTime = Math.random() * Math.PI * 2;
        this._build();

        const x = DIMS.LANE_POSITIONS[lane];
        this.mesh.position.set(x, 0.6, z);
    }

    _build() {
        // --- Kawaii chibi mummy ---

        // Round body (small chibi)
        const bodyGeo = new THREE.SphereGeometry(0.3, 12, 10);
        bodyGeo.scale(1, 1.1, 0.9);
        const body = new THREE.Mesh(bodyGeo, MAT.mummyWrap);
        body.castShadow = true;
        this.mesh.add(body);
        this.body = body;

        // Big round head
        const headGeo = new THREE.SphereGeometry(0.32, 12, 10);
        const head = new THREE.Mesh(headGeo, MAT.mummyWrap);
        head.position.y = 0.55;
        head.castShadow = true;
        this.mesh.add(head);
        this.head = head;

        // Bandage wraps on head (decorative rings)
        const wrapGeo = new THREE.TorusGeometry(0.33, 0.015, 4, 12);
        for (let i = 0; i < 3; i++) {
            const wrap = new THREE.Mesh(wrapGeo, MAT.mummyWrap);
            wrap.position.y = 0.45 + i * 0.12;
            wrap.rotation.x = Math.PI / 2;
            wrap.rotation.z = i * 0.5;
            this.mesh.add(wrap);
        }

        // Big kawaii eyes (glowing red with white shine)
        const eyeGeo = new THREE.SphereGeometry(0.09, 10, 8);
        const shineGeo = new THREE.SphereGeometry(0.035, 6, 4);
        const shine2Geo = new THREE.SphereGeometry(0.018, 6, 4);
        const shineMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

        const leftEye = new THREE.Mesh(eyeGeo, MAT.mummyEye);
        leftEye.position.set(-0.12, 0.58, 0.26);
        this.mesh.add(leftEye);
        const ls = new THREE.Mesh(shineGeo, shineMat);
        ls.position.set(0.02, 0.03, 0.05);
        leftEye.add(ls);
        const ls2 = new THREE.Mesh(shine2Geo, shineMat);
        ls2.position.set(-0.02, -0.02, 0.05);
        leftEye.add(ls2);

        const rightEye = new THREE.Mesh(eyeGeo, MAT.mummyEye);
        rightEye.position.set(0.12, 0.58, 0.26);
        this.mesh.add(rightEye);
        const rs = new THREE.Mesh(shineGeo, shineMat);
        rs.position.set(0.02, 0.03, 0.05);
        rightEye.add(rs);
        const rs2 = new THREE.Mesh(shine2Geo, shineMat);
        rs2.position.set(-0.02, -0.02, 0.05);
        rightEye.add(rs2);

        // Blush marks
        const blushGeo = new THREE.SphereGeometry(0.05, 8, 6);
        blushGeo.scale(1.3, 0.8, 0.3);
        const blushMat = new THREE.MeshToonMaterial({ color: 0xFFAAAA, transparent: true, opacity: 0.5 });
        const lb = new THREE.Mesh(blushGeo, blushMat);
        lb.position.set(-0.22, 0.50, 0.22);
        this.mesh.add(lb);
        const rb = new THREE.Mesh(blushGeo, blushMat);
        rb.position.set(0.22, 0.50, 0.22);
        this.mesh.add(rb);

        // Small worried mouth
        const mouthGeo = new THREE.TorusGeometry(0.05, 0.012, 6, 8, Math.PI);
        const mouthMat = new THREE.MeshBasicMaterial({ color: 0x666666 });
        const mouth = new THREE.Mesh(mouthGeo, mouthMat);
        mouth.position.set(0, 0.42, 0.28);
        mouth.rotation.x = Math.PI;
        this.mesh.add(mouth);

        // Stubby arms
        const armGeo = new THREE.CapsuleGeometry(0.07, 0.2, 4, 6);
        this.leftArm = new THREE.Group();
        const la = new THREE.Mesh(armGeo, MAT.mummyWrap);
        this.leftArm.add(la);
        this.leftArm.position.set(-0.35, 0.15, 0.1);
        this.leftArm.rotation.z = 0.4;
        this.leftArm.rotation.x = -0.6;
        this.mesh.add(this.leftArm);

        this.rightArm = new THREE.Group();
        const ra = new THREE.Mesh(armGeo, MAT.mummyWrap);
        this.rightArm.add(ra);
        this.rightArm.position.set(0.35, 0.15, 0.1);
        this.rightArm.rotation.z = -0.4;
        this.rightArm.rotation.x = -0.6;
        this.mesh.add(this.rightArm);

        // Stubby legs
        const legGeo = new THREE.CapsuleGeometry(0.08, 0.15, 4, 6);
        this.leftLeg = new THREE.Group();
        this.leftLeg.add(new THREE.Mesh(legGeo, MAT.mummyWrap));
        this.leftLeg.position.set(-0.15, -0.4, 0);
        this.mesh.add(this.leftLeg);

        this.rightLeg = new THREE.Group();
        this.rightLeg.add(new THREE.Mesh(legGeo, MAT.mummyWrap));
        this.rightLeg.position.set(0.15, -0.4, 0);
        this.mesh.add(this.rightLeg);

        // Trailing bandage bits
        const trailGeo = new THREE.BoxGeometry(0.04, 0.25, 0.02);
        const trail1 = new THREE.Mesh(trailGeo, MAT.mummyWrap);
        trail1.position.set(-0.25, 0.1, -0.15);
        trail1.rotation.z = 0.3;
        this.mesh.add(trail1);
        this.trail1 = trail1;

        const trail2 = new THREE.Mesh(trailGeo, MAT.mummyWrap);
        trail2.position.set(0.2, 0.65, -0.1);
        trail2.rotation.z = -0.2;
        this.mesh.add(trail2);
        this.trail2 = trail2;
    }

    update(dt, teddyPosition) {
        this.animTime += dt;

        // Walk toward player (positive Z)
        this.mesh.position.z += DIMS.ENEMY_WALK_SPEED * dt;

        // Home in on Teddy's lane (lateral tracking)
        if (teddyPosition) {
            const dx = teddyPosition.x - this.mesh.position.x;
            if (Math.abs(dx) > 0.05) {
                this.mesh.position.x += Math.sign(dx) * DIMS.ENEMY_TRACK_SPEED * dt;
            }
        }

        // Running animation
        const t = this.animTime * 6;
        // Body bob and slight forward lean
        this.body.rotation.x = -0.1;
        this.body.rotation.z = Math.sin(t) * 0.05;
        this.body.position.y = Math.abs(Math.sin(t)) * 0.06;
        this.head.rotation.z = Math.sin(t * 0.8) * 0.04;
        // Arms pump opposite to legs (cross-body running)
        this.leftArm.rotation.z = 0.3;
        this.leftArm.rotation.x = Math.sin(t + Math.PI) * 0.8;
        this.rightArm.rotation.z = -0.3;
        this.rightArm.rotation.x = Math.sin(t) * 0.8;
        // Legs alternate in big running stride
        this.leftLeg.rotation.x = Math.sin(t) * 0.8;
        this.rightLeg.rotation.x = Math.sin(t + Math.PI) * 0.8;
        // Bandage flutter
        this.trail1.rotation.z = 0.3 + Math.sin(t * 2) * 0.2;
        this.trail2.rotation.z = -0.2 + Math.sin(t * 2 + 1) * 0.2;
    }

    getBoundingBox() {
        const pos = this.mesh.position;
        return new THREE.Box3(
            new THREE.Vector3(pos.x - 0.3, pos.y - 0.5, pos.z - 0.3),
            new THREE.Vector3(pos.x + 0.3, pos.y + 0.5, pos.z + 0.3)
        );
    }
}
