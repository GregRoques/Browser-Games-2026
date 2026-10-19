import * as THREE from 'three';
import { MAT } from '../utils/MaterialPalette.js';
import { DIMS } from '../utils/Constants.js';

export class Skeleton {
    constructor(lane, z) {
        this.mesh = new THREE.Group();
        this.active = true;
        this.type = 'ground';
        this.animTime = Math.random() * Math.PI * 2;
        this.throwTimer = 1.5 + Math.random() * 2; // time until first throw
        this.throwCooldown = 2.0; // seconds between throws
        this.pendingProjectiles = [];
        this._build();

        const x = DIMS.LANE_POSITIONS[lane];
        this.mesh.position.set(x, 0.6, z);
    }

    _build() {
        // --- Kawaii chibi skeleton ---

        // Ribcage body (small sphere with rib details)
        const bodyGeo = new THREE.SphereGeometry(0.25, 10, 8);
        bodyGeo.scale(1, 1.15, 0.85);
        const body = new THREE.Mesh(bodyGeo, MAT.skeletonBone);
        body.castShadow = true;
        this.mesh.add(body);
        this.body = body;

        // Rib details (dark lines across body)
        for (let i = 0; i < 3; i++) {
            const ribGeo = new THREE.TorusGeometry(0.22 - i * 0.03, 0.012, 4, 8, Math.PI);
            const rib = new THREE.Mesh(ribGeo, MAT.skeletonDark);
            rib.position.y = 0.08 - i * 0.1;
            rib.position.z = 0.05;
            rib.rotation.y = Math.PI;
            body.add(rib);
        }

        // Big round skull
        const headGeo = new THREE.SphereGeometry(0.34, 12, 10);
        const head = new THREE.Mesh(headGeo, MAT.skeletonBone);
        head.position.y = 0.55;
        head.castShadow = true;
        this.mesh.add(head);
        this.head = head;

        // Jaw (slightly separated for cute look)
        const jawGeo = new THREE.SphereGeometry(0.2, 8, 6);
        jawGeo.scale(1, 0.5, 0.8);
        const jaw = new THREE.Mesh(jawGeo, MAT.skeletonBone);
        jaw.position.set(0, -0.12, 0.08);
        head.add(jaw);
        this.jaw = jaw;

        // Big dark eye sockets with glowing red pupils
        const socketGeo = new THREE.SphereGeometry(0.1, 8, 6);
        const socketMat = new THREE.MeshBasicMaterial({ color: 0x1A1A1A });

        const leftSocket = new THREE.Mesh(socketGeo, socketMat);
        leftSocket.position.set(-0.11, 0.04, 0.26);
        head.add(leftSocket);
        // Glowing red pupil
        const pupilGeo = new THREE.SphereGeometry(0.04, 6, 4);
        const lp = new THREE.Mesh(pupilGeo, MAT.skeletonEye);
        lp.position.z = 0.06;
        leftSocket.add(lp);
        // Eye shine
        const shineGeo = new THREE.SphereGeometry(0.02, 6, 4);
        const shineMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const ls = new THREE.Mesh(shineGeo, shineMat);
        ls.position.set(0.02, 0.02, 0.07);
        leftSocket.add(ls);

        const rightSocket = new THREE.Mesh(socketGeo, socketMat);
        rightSocket.position.set(0.11, 0.04, 0.26);
        head.add(rightSocket);
        const rp = new THREE.Mesh(pupilGeo, MAT.skeletonEye);
        rp.position.z = 0.06;
        rightSocket.add(rp);
        const rs = new THREE.Mesh(shineGeo, shineMat);
        rs.position.set(0.02, 0.02, 0.07);
        rightSocket.add(rs);

        // Nose hole (inverted triangle - just a small dark triangle)
        const noseGeo = new THREE.ConeGeometry(0.03, 0.04, 3);
        const noseMat = new THREE.MeshBasicMaterial({ color: 0x1A1A1A });
        const nose = new THREE.Mesh(noseGeo, noseMat);
        nose.position.set(0, -0.04, 0.3);
        nose.rotation.x = Math.PI;
        head.add(nose);

        // Big cute grin (row of teeth)
        const teethGroup = new THREE.Group();
        const toothGeo = new THREE.BoxGeometry(0.04, 0.04, 0.02);
        const toothMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        for (let i = 0; i < 5; i++) {
            const tooth = new THREE.Mesh(toothGeo, toothMat);
            tooth.position.set(-0.08 + i * 0.04, 0, 0);
            teethGroup.add(tooth);
        }
        teethGroup.position.set(0, -0.12, 0.28);
        head.add(teethGroup);

        // Blush marks
        const blushGeo = new THREE.SphereGeometry(0.04, 8, 6);
        blushGeo.scale(1.3, 0.8, 0.3);
        const blushMat = new THREE.MeshToonMaterial({ color: 0xFFAAAA, transparent: true, opacity: 0.4 });
        const lb = new THREE.Mesh(blushGeo, blushMat);
        lb.position.set(-0.2, -0.04, 0.22);
        head.add(lb);
        const rb = new THREE.Mesh(blushGeo, blushMat);
        rb.position.set(0.2, -0.04, 0.22);
        head.add(rb);

        // Bone arms
        const armGeo = new THREE.CapsuleGeometry(0.04, 0.22, 4, 6);
        const jointGeo = new THREE.SphereGeometry(0.035, 6, 4);

        this.leftArm = new THREE.Group();
        const labone = new THREE.Mesh(armGeo, MAT.skeletonBone);
        this.leftArm.add(labone);
        const lajoint = new THREE.Mesh(jointGeo, MAT.skeletonDark);
        lajoint.position.y = -0.13;
        this.leftArm.add(lajoint);
        this.leftArm.position.set(-0.32, 0.15, 0);
        this.leftArm.rotation.z = 0.3;
        this.mesh.add(this.leftArm);

        this.rightArm = new THREE.Group();
        const rabone = new THREE.Mesh(armGeo, MAT.skeletonBone);
        this.rightArm.add(rabone);
        const rajoint = new THREE.Mesh(jointGeo, MAT.skeletonDark);
        rajoint.position.y = -0.13;
        this.rightArm.add(rajoint);
        this.rightArm.position.set(0.32, 0.15, 0);
        this.rightArm.rotation.z = -0.3;
        this.mesh.add(this.rightArm);

        // Bone legs
        const legGeo = new THREE.CapsuleGeometry(0.045, 0.18, 4, 6);
        this.leftLeg = new THREE.Group();
        this.leftLeg.add(new THREE.Mesh(legGeo, MAT.skeletonBone));
        const llj = new THREE.Mesh(jointGeo, MAT.skeletonDark);
        llj.position.y = -0.12;
        this.leftLeg.add(llj);
        this.leftLeg.position.set(-0.12, -0.4, 0);
        this.mesh.add(this.leftLeg);

        this.rightLeg = new THREE.Group();
        this.rightLeg.add(new THREE.Mesh(legGeo, MAT.skeletonBone));
        const rlj = new THREE.Mesh(jointGeo, MAT.skeletonDark);
        rlj.position.y = -0.12;
        this.rightLeg.add(rlj);
        this.rightLeg.position.set(0.12, -0.4, 0);
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
        this.body.rotation.z = Math.sin(t) * 0.05;
        this.body.position.y = Math.abs(Math.sin(t)) * 0.06;
        this.head.rotation.z = Math.sin(t * 0.8) * 0.05;
        this.jaw.rotation.x = Math.sin(t * 2) * 0.06; // jaw chatter
        // Legs alternate in big running stride
        this.leftLeg.rotation.x = Math.sin(t) * 0.8;
        this.rightLeg.rotation.x = Math.sin(t + Math.PI) * 0.8;

        // Throw timer
        this.throwTimer -= dt;
        if (this.throwTimer <= 0) {
            this._throwBone();
            this.throwTimer = this.throwCooldown;
        }

        // Throw animation (wind up right arm)
        if (this.throwTimer > this.throwCooldown - 0.3) {
            // Wind up
            const throwT = (this.throwCooldown - this.throwTimer) / 0.3;
            this.rightArm.rotation.x = -throwT * 1.5;
            this.rightArm.rotation.z = -0.3 - throwT * 0.5;
            this.leftArm.rotation.x = Math.sin(t + Math.PI) * 0.8;
        } else {
            // Arms pump opposite to legs (cross-body running)
            this.leftArm.rotation.z = 0.3;
            this.leftArm.rotation.x = Math.sin(t + Math.PI) * 0.8;
            this.rightArm.rotation.z = -0.3;
            this.rightArm.rotation.x = Math.sin(t) * 0.8;
        }
    }

    _throwBone() {
        // Create bone projectile mesh
        const boneGroup = new THREE.Group();

        // Bone shaft
        const shaftGeo = new THREE.CapsuleGeometry(0.025, 0.2, 4, 4);
        const shaft = new THREE.Mesh(shaftGeo, MAT.boneProj);
        shaft.rotation.z = Math.PI / 2;
        boneGroup.add(shaft);

        // Bone ends (knobs)
        const knobGeo = new THREE.SphereGeometry(0.04, 6, 4);
        const lk = new THREE.Mesh(knobGeo, MAT.boneProj);
        lk.position.x = -0.12;
        boneGroup.add(lk);
        const rk = new THREE.Mesh(knobGeo, MAT.boneProj);
        rk.position.x = 0.12;
        boneGroup.add(rk);

        boneGroup.position.copy(this.mesh.position);
        boneGroup.position.y += 0.5;

        this.pendingProjectiles.push({
            mesh: boneGroup,
            velocity: new THREE.Vector3(0, 0, 8), // toward player (+Z)
            spin: 12,
            active: true,
            getBoundingBox() {
                const p = this.mesh.position;
                return new THREE.Box3(
                    new THREE.Vector3(p.x - 0.15, p.y - 0.08, p.z - 0.08),
                    new THREE.Vector3(p.x + 0.15, p.y + 0.08, p.z + 0.08)
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
            new THREE.Vector3(pos.x - 0.3, pos.y - 0.5, pos.z - 0.3),
            new THREE.Vector3(pos.x + 0.3, pos.y + 0.5, pos.z + 0.3)
        );
    }
}
