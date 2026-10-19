import * as THREE from 'three';
import { MAT } from '../utils/MaterialPalette.js';
import { DIMS } from '../utils/Constants.js';

export class JackOLantern {
    constructor(lane, z) {
        this.mesh = new THREE.Group();
        this.active = true;
        this.type = 'ground';
        this.animTime = Math.random() * Math.PI * 2;
        this.fireTimer = 2.0 + Math.random() * 1.5; // time until first fire
        this.fireCooldown = 2.5; // seconds between shots
        this.pendingProjectiles = [];
        this.isStationary = true; // does NOT walk toward player
        this._build();

        const x = DIMS.LANE_POSITIONS[lane];
        this.mesh.position.set(x, 0.35, z);
    }

    _build() {
        // --- Kawaii jack-o-lantern (pumpkin that spits fire) ---

        // Pumpkin body (round with ribs)
        const bodyGeo = new THREE.SphereGeometry(0.3, 12, 10);
        bodyGeo.scale(1.2, 0.95, 1.0);
        const body = new THREE.Mesh(bodyGeo, MAT.jackoBody);
        body.castShadow = true;
        this.mesh.add(body);
        this.body = body;

        // Pumpkin ribs
        for (let i = 0; i < 6; i++) {
            const ribGeo = new THREE.TorusGeometry(0.28, 0.025, 4, 12, Math.PI * 2);
            const rib = new THREE.Mesh(ribGeo, MAT.jackoBody);
            rib.rotation.y = (i / 6) * Math.PI;
            body.add(rib);
        }

        // Stem
        const stemGeo = new THREE.CylinderGeometry(0.035, 0.05, 0.12, 4);
        const stem = new THREE.Mesh(stemGeo, MAT.jackoStem);
        stem.position.y = 0.3;
        stem.rotation.z = 0.15;
        body.add(stem);

        // Carved face - glowing eyes (triangle shapes using cones)
        const eyeGeo = new THREE.ConeGeometry(0.06, 0.08, 3);
        const leftEye = new THREE.Mesh(eyeGeo, MAT.jackoFace);
        leftEye.position.set(-0.1, 0.08, 0.28);
        leftEye.rotation.x = -0.1;
        body.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeo, MAT.jackoFace);
        rightEye.position.set(0.1, 0.08, 0.28);
        rightEye.rotation.x = -0.1;
        body.add(rightEye);

        // Nose (small inverted triangle)
        const noseGeo = new THREE.ConeGeometry(0.03, 0.04, 3);
        const nose = new THREE.Mesh(noseGeo, MAT.jackoFace);
        nose.position.set(0, -0.01, 0.3);
        nose.rotation.x = Math.PI;
        body.add(nose);

        // Mouth (big zigzag grin - approximated with boxes)
        const mouthGroup = new THREE.Group();
        const teethGeo = new THREE.BoxGeometry(0.04, 0.05, 0.03);
        for (let i = 0; i < 5; i++) {
            const tooth = new THREE.Mesh(teethGeo, MAT.jackoFace);
            tooth.position.set(-0.08 + i * 0.04, (i % 2 === 0 ? 0.02 : -0.02), 0);
            mouthGroup.add(tooth);
        }
        mouthGroup.position.set(0, -0.1, 0.28);
        body.add(mouthGroup);

        // Glow indicator (scale-based visual cue instead of PointLight)
        this.glowScale = 1.0;
    }

    update(dt) {
        this.animTime += dt;

        // Pumpkin does NOT move - it's stationary

        // Gentle idle animation (slight wobble)
        this.body.rotation.z = Math.sin(this.animTime * 1.5) * 0.05;
        this.body.position.y = Math.sin(this.animTime * 2) * 0.02;

        // Glow flicker (scale pulse as visual cue)
        this.glowScale = 1.0 + Math.sin(this.animTime * 8) * 0.03;

        // Fire timer
        this.fireTimer -= dt;
        if (this.fireTimer <= 0) {
            this._spitFire();
            this.fireTimer = this.fireCooldown;
        }

        // Pre-fire warning: intensify glow
        if (this.fireTimer < 0.5) {
            this.glowScale = 1.0 + Math.sin(this.animTime * 15) * 0.06;
        }
        this.body.scale.setScalar(this.glowScale);
    }

    _spitFire() {
        // Create fire projectile
        const fireGroup = new THREE.Group();

        // Outer flame
        const outerGeo = new THREE.SphereGeometry(0.1, 8, 6);
        outerGeo.scale(1, 0.8, 1.3);
        const outer = new THREE.Mesh(outerGeo, MAT.fireProj);
        fireGroup.add(outer);

        // Inner flame (brighter)
        const innerGeo = new THREE.SphereGeometry(0.06, 6, 4);
        const inner = new THREE.Mesh(innerGeo, MAT.fireInner);
        fireGroup.add(inner);

        // Flame tip
        const tipGeo = new THREE.ConeGeometry(0.04, 0.12, 4);
        const tipMat = new THREE.MeshBasicMaterial({ color: 0xFFCC00 });
        const tip = new THREE.Mesh(tipGeo, tipMat);
        tip.position.z = 0.1;
        tip.rotation.x = Math.PI / 2;
        fireGroup.add(tip);

        fireGroup.position.copy(this.mesh.position);
        fireGroup.position.y += 0.15;
        fireGroup.position.z += 0.35;

        this.pendingProjectiles.push({
            mesh: fireGroup,
            velocity: new THREE.Vector3(0, 0, 10), // toward player (+Z)
            spin: 0,
            animTime: 0,
            active: true,
            getBoundingBox() {
                const p = this.mesh.position;
                return new THREE.Box3(
                    new THREE.Vector3(p.x - 0.12, p.y - 0.1, p.z - 0.12),
                    new THREE.Vector3(p.x + 0.12, p.y + 0.1, p.z + 0.12)
                );
            }
        });
    }

    getNewProjectiles() {
        const projs = this.pendingProjectiles;
        this.pendingProjectiles = [];
        return projs;
    }

    getBoundingBox() {
        const pos = this.mesh.position;
        return new THREE.Box3(
            new THREE.Vector3(pos.x - 0.35, pos.y - 0.3, pos.z - 0.3),
            new THREE.Vector3(pos.x + 0.35, pos.y + 0.3, pos.z + 0.3)
        );
    }
}
