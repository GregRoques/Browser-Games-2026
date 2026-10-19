import * as THREE from 'three';
import { MAT } from '../utils/MaterialPalette.js';
import { DIMS } from '../utils/Constants.js';

export class Zombie {
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
        // --- Kawaii chibi zombie ---

        // Round body
        const bodyGeo = new THREE.SphereGeometry(0.28, 12, 10);
        bodyGeo.scale(1, 1.1, 0.9);
        const body = new THREE.Mesh(bodyGeo, MAT.zombieSkin);
        body.castShadow = true;
        this.mesh.add(body);
        this.body = body;

        // Dark patches on body
        const patchGeo = new THREE.SphereGeometry(0.1, 6, 4);
        patchGeo.scale(1, 0.8, 0.5);
        const patch = new THREE.Mesh(patchGeo, MAT.zombieDark);
        patch.position.set(0.12, 0.05, 0.2);
        body.add(patch);

        // Big round head (slightly tilted for cute zombie look)
        const headGeo = new THREE.SphereGeometry(0.34, 12, 10);
        const head = new THREE.Mesh(headGeo, MAT.zombieSkin);
        head.position.set(0.03, 0.55, 0);
        head.rotation.z = 0.15;
        head.castShadow = true;
        this.mesh.add(head);
        this.head = head;

        // Dark patches on head
        const hpGeo = new THREE.SphereGeometry(0.08, 6, 4);
        hpGeo.scale(1.2, 0.9, 0.5);
        const hp = new THREE.Mesh(hpGeo, MAT.zombieDark);
        hp.position.set(-0.15, 0.12, 0.2);
        head.add(hp);

        // Big kawaii eyes (uneven for zombie charm - one big, one slightly smaller)
        const eyeGeo1 = new THREE.SphereGeometry(0.1, 10, 8);
        const eyeGeo2 = new THREE.SphereGeometry(0.08, 10, 8);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xCCFF33 });
        const pupilGeo = new THREE.SphereGeometry(0.04, 6, 4);
        const pupilMat = new THREE.MeshBasicMaterial({ color: 0x1A1A1A });
        const shineGeo = new THREE.SphereGeometry(0.025, 6, 4);
        const shineMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

        const leftEye = new THREE.Mesh(eyeGeo1, eyeMat);
        leftEye.position.set(-0.12, 0.06, 0.28);
        head.add(leftEye);
        const lp = new THREE.Mesh(pupilGeo, pupilMat);
        lp.position.z = 0.06;
        leftEye.add(lp);
        const lsh = new THREE.Mesh(shineGeo, shineMat);
        lsh.position.set(0.02, 0.03, 0.07);
        leftEye.add(lsh);

        const rightEye = new THREE.Mesh(eyeGeo2, eyeMat);
        rightEye.position.set(0.13, 0.02, 0.28);
        rightEye.rotation.z = -0.2;
        head.add(rightEye);
        const rp = new THREE.Mesh(pupilGeo, pupilMat);
        rp.position.z = 0.05;
        rightEye.add(rp);
        const rsh = new THREE.Mesh(shineGeo, shineMat);
        rsh.position.set(0.02, 0.03, 0.06);
        rightEye.add(rsh);

        // Blush marks
        const blushGeo = new THREE.SphereGeometry(0.05, 8, 6);
        blushGeo.scale(1.3, 0.8, 0.3);
        const blushMat = new THREE.MeshToonMaterial({ color: 0x99DD66, transparent: true, opacity: 0.5 });
        const lb = new THREE.Mesh(blushGeo, blushMat);
        lb.position.set(-0.24, -0.04, 0.22);
        head.add(lb);
        const rb = new THREE.Mesh(blushGeo, blushMat);
        rb.position.set(0.24, -0.04, 0.22);
        head.add(rb);

        // Derpy smile (crooked)
        const mouthGeo = new THREE.TorusGeometry(0.06, 0.012, 6, 8, Math.PI);
        const mouthMat = new THREE.MeshBasicMaterial({ color: 0x1A1A1A });
        const mouth = new THREE.Mesh(mouthGeo, mouthMat);
        mouth.position.set(0.02, -0.12, 0.3);
        mouth.rotation.z = 0.15;
        head.add(mouth);

        // Little tooth
        const toothGeo = new THREE.BoxGeometry(0.03, 0.04, 0.02);
        const toothMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const tooth = new THREE.Mesh(toothGeo, toothMat);
        tooth.position.set(-0.02, -0.15, 0.31);
        head.add(tooth);

        // Stubby arms (one raised forward for zombie pose)
        const armGeo = new THREE.CapsuleGeometry(0.07, 0.2, 4, 6);
        this.leftArm = new THREE.Group();
        this.leftArm.add(new THREE.Mesh(armGeo, MAT.zombieSkin));
        this.leftArm.position.set(-0.33, 0.1, 0.1);
        this.leftArm.rotation.z = 0.4;
        this.leftArm.rotation.x = -0.8;
        this.mesh.add(this.leftArm);

        this.rightArm = new THREE.Group();
        this.rightArm.add(new THREE.Mesh(armGeo, MAT.zombieSkin));
        this.rightArm.position.set(0.33, 0.0, 0);
        this.rightArm.rotation.z = -0.15;
        this.mesh.add(this.rightArm);

        // Stubby legs
        const legGeo = new THREE.CapsuleGeometry(0.08, 0.15, 4, 6);
        this.leftLeg = new THREE.Group();
        this.leftLeg.add(new THREE.Mesh(legGeo, MAT.zombieDark));
        this.leftLeg.position.set(-0.13, -0.4, 0);
        this.mesh.add(this.leftLeg);

        this.rightLeg = new THREE.Group();
        this.rightLeg.add(new THREE.Mesh(legGeo, MAT.zombieDark));
        this.rightLeg.position.set(0.13, -0.4, 0);
        this.mesh.add(this.rightLeg);
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
        this.body.rotation.z = Math.sin(t) * 0.06;
        this.body.position.y = Math.abs(Math.sin(t)) * 0.06;
        this.head.rotation.z = 0.15 + Math.sin(t * 0.7) * 0.04;
        // Arms pump opposite to legs (cross-body running)
        this.leftArm.rotation.z = 0.3;
        this.leftArm.rotation.x = Math.sin(t + Math.PI) * 0.8;
        this.rightArm.rotation.z = -0.15;
        this.rightArm.rotation.x = Math.sin(t) * 0.8;
        // Legs alternate in big running stride
        this.leftLeg.rotation.x = Math.sin(t) * 0.8;
        this.rightLeg.rotation.x = Math.sin(t + Math.PI) * 0.8;
    }

    getBoundingBox() {
        const pos = this.mesh.position;
        return new THREE.Box3(
            new THREE.Vector3(pos.x - 0.3, pos.y - 0.5, pos.z - 0.3),
            new THREE.Vector3(pos.x + 0.3, pos.y + 0.5, pos.z + 0.3)
        );
    }
}
