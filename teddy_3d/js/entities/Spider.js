import * as THREE from 'three';
import { MAT } from '../utils/MaterialPalette.js';
import { DIMS } from '../utils/Constants.js';

export class Spider {
    constructor(lane, z) {
        this.mesh = new THREE.Group();
        this.active = true;
        this.type = 'hanging';
        this.animTime = Math.random() * Math.PI * 2;
        this.baseY = 3.5;
        this.descendSpeed = 1.8;
        this.descended = false;
        this._build();

        const x = DIMS.LANE_POSITIONS[lane];
        this.mesh.position.set(x, this.baseY, z);
    }

    _build() {
        // --- Kawaii chibi spider ---

        // Web line
        const webGeo = new THREE.CylinderGeometry(0.004, 0.004, 4, 3);
        const web = new THREE.Mesh(webGeo, MAT.spiderWeb);
        web.position.y = 2;
        this.mesh.add(web);
        this.webLine = web;

        // Spider body group
        this.spiderGroup = new THREE.Group();
        this.mesh.add(this.spiderGroup);

        // Round cute abdomen
        const abdomenGeo = new THREE.SphereGeometry(0.18, 10, 8);
        abdomenGeo.scale(1, 0.85, 1.1);
        const abdomen = new THREE.Mesh(abdomenGeo, MAT.spiderBody);
        abdomen.position.set(0, -0.02, -0.1);
        this.spiderGroup.add(abdomen);

        // Cute pattern on abdomen
        const patternGeo = new THREE.SphereGeometry(0.06, 6, 4);
        patternGeo.scale(1, 1, 0.3);
        const patternMat = new THREE.MeshToonMaterial({ color: 0x444444 });
        const p1 = new THREE.Mesh(patternGeo, patternMat);
        p1.position.set(0, 0.05, -0.2);
        this.spiderGroup.add(p1);
        const p2 = new THREE.Mesh(patternGeo, patternMat);
        p2.position.set(-0.06, -0.02, -0.2);
        p2.scale.set(0.7, 0.7, 0.7);
        this.spiderGroup.add(p2);
        const p3 = new THREE.Mesh(patternGeo, patternMat);
        p3.position.set(0.06, -0.02, -0.2);
        p3.scale.set(0.7, 0.7, 0.7);
        this.spiderGroup.add(p3);

        // Big round head
        const headGeo = new THREE.SphereGeometry(0.16, 10, 8);
        const head = new THREE.Mesh(headGeo, MAT.spiderBody);
        head.position.set(0, 0.03, 0.15);
        this.spiderGroup.add(head);
        this.head = head;

        // Giant kawaii eyes (4 eyes - 2 big, 2 small)
        const bigEyeGeo = new THREE.SphereGeometry(0.065, 8, 6);
        const smallEyeGeo = new THREE.SphereGeometry(0.035, 8, 6);
        const shineGeo = new THREE.SphereGeometry(0.025, 6, 4);
        const shine2Geo = new THREE.SphereGeometry(0.012, 6, 4);
        const shineMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

        // Big eyes
        const le = new THREE.Mesh(bigEyeGeo, MAT.spiderEye);
        le.position.set(-0.06, 0.04, 0.12);
        head.add(le);
        const les = new THREE.Mesh(shineGeo, shineMat);
        les.position.set(0.02, 0.02, 0.04);
        le.add(les);
        const les2 = new THREE.Mesh(shine2Geo, shineMat);
        les2.position.set(-0.01, -0.01, 0.04);
        le.add(les2);

        const re = new THREE.Mesh(bigEyeGeo, MAT.spiderEye);
        re.position.set(0.06, 0.04, 0.12);
        head.add(re);
        const res = new THREE.Mesh(shineGeo, shineMat);
        res.position.set(0.02, 0.02, 0.04);
        re.add(res);
        const res2 = new THREE.Mesh(shine2Geo, shineMat);
        res2.position.set(-0.01, -0.01, 0.04);
        re.add(res2);

        // Small upper eyes
        const sle = new THREE.Mesh(smallEyeGeo, MAT.spiderEye);
        sle.position.set(-0.08, 0.1, 0.1);
        head.add(sle);
        const sles = new THREE.Mesh(shine2Geo, shineMat);
        sles.position.set(0.01, 0.01, 0.02);
        sle.add(sles);

        const sre = new THREE.Mesh(smallEyeGeo, MAT.spiderEye);
        sre.position.set(0.08, 0.1, 0.1);
        head.add(sre);
        const sres = new THREE.Mesh(shine2Geo, shineMat);
        sres.position.set(0.01, 0.01, 0.02);
        sre.add(sres);

        // Blush
        const blushGeo = new THREE.SphereGeometry(0.03, 8, 6);
        blushGeo.scale(1.3, 0.8, 0.3);
        const blushMat = new THREE.MeshToonMaterial({ color: 0xFF88AA, transparent: true, opacity: 0.5 });
        const lb = new THREE.Mesh(blushGeo, blushMat);
        lb.position.set(-0.1, -0.02, 0.12);
        head.add(lb);
        const rb = new THREE.Mesh(blushGeo, blushMat);
        rb.position.set(0.1, -0.02, 0.12);
        head.add(rb);

        // Tiny cute fangs
        const fangGeo = new THREE.ConeGeometry(0.01, 0.04, 4);
        const fangMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const lf = new THREE.Mesh(fangGeo, fangMat);
        lf.position.set(-0.025, -0.06, 0.13);
        lf.rotation.x = 0.3;
        head.add(lf);
        const rf = new THREE.Mesh(fangGeo, fangMat);
        rf.position.set(0.025, -0.06, 0.13);
        rf.rotation.x = 0.3;
        head.add(rf);

        // Happy mouth
        const mouthGeo = new THREE.TorusGeometry(0.025, 0.006, 6, 8, Math.PI);
        const mouthMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
        const mouth = new THREE.Mesh(mouthGeo, mouthMat);
        mouth.position.set(0, -0.06, 0.14);
        head.add(mouth);

        // Cute stubby legs (8 legs, 4 each side)
        const legGeo = new THREE.CapsuleGeometry(0.012, 0.2, 4, 4);
        this.legs = [];
        for (let side = -1; side <= 1; side += 2) {
            for (let i = 0; i < 4; i++) {
                const legGroup = new THREE.Group();
                const leg = new THREE.Mesh(legGeo, MAT.spiderLeg);
                legGroup.add(leg);
                legGroup.position.set(
                    side * 0.14,
                    -0.04,
                    -0.1 + i * 0.08
                );
                legGroup.rotation.z = side * (0.7 + i * 0.12);
                legGroup.rotation.x = (i - 1.5) * 0.3;
                this.spiderGroup.add(legGroup);
                this.legs.push(legGroup);
            }
        }
    }

    update(dt) {
        this.animTime += dt;

        // Descend from ceiling when getting close
        if (this.mesh.position.z > -15 && !this.descended) {
            this.mesh.position.y -= this.descendSpeed * dt;
            if (this.mesh.position.y <= 1.5) {
                this.mesh.position.y = 1.5;
                this.descended = true;
            }
            // Adjust web line length
            const height = this.baseY - this.mesh.position.y + 2;
            this.webLine.scale.y = height / 4;
            this.webLine.position.y = height / 2;
        }

        // Cute leg wiggle
        const t = this.animTime * 4;
        for (let i = 0; i < this.legs.length; i++) {
            this.legs[i].rotation.x += Math.sin(t + i * 0.8) * dt * 2;
        }

        // Body sway
        this.spiderGroup.rotation.z = Math.sin(this.animTime * 2) * 0.08;
        // Head bob
        this.head.position.y = 0.03 + Math.sin(this.animTime * 3) * 0.015;
    }

    getBoundingBox() {
        const pos = this.mesh.position;
        return new THREE.Box3(
            new THREE.Vector3(pos.x - 0.25, pos.y - 0.2, pos.z - 0.25),
            new THREE.Vector3(pos.x + 0.25, pos.y + 0.2, pos.z + 0.25)
        );
    }
}
