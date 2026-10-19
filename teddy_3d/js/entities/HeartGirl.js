import * as THREE from 'three';
import { MAT } from '../utils/MaterialPalette.js';
import { PHYSICS, DIMS } from '../utils/Constants.js';
import { clamp } from '../utils/MathUtils.js';

export class HeartGirl {
    constructor() {
        this.mesh = new THREE.Group();
        this.velocityY = 0;
        this.isGrounded = true;
        this.isJumping = false;
        this.jumpHoldTimer = 0;
        this.isDamaged = false;
        this.damageTimer = 0;
        this.isDancing = false;
        this.isSpinning = false;
        this.spinProgress = 0;
        this.isFalling = false;
        this.animTime = 0;

        // Continuous lateral movement
        this.moveDir = 0; // -1 left, 0 none, +1 right

        // Limb references for animation
        this.leftArm = null;
        this.rightArm = null;
        this.leftLeg = null;
        this.rightLeg = null;
        this.head = null;
        this.body = null;
        this.leftPigtail = null;
        this.rightPigtail = null;

        this._buildMesh();
        this.mesh.position.set(DIMS.LANE_POSITIONS[1], PHYSICS.GROUND_Y, 0);
        this.mesh.castShadow = true;
    }

    _buildMesh() {
        // --- Kawaii chibi Heart Girl ---

        // Body (torso)
        const bodyGeo = new THREE.SphereGeometry(0.35, 16, 12);
        bodyGeo.scale(1, 1.0, 0.9);
        const body = new THREE.Mesh(bodyGeo, MAT.hgSkin);
        body.castShadow = true;
        this.body = body;
        this.mesh.add(body);

        // Red dress (truncated cone: narrow waist, flared hem)
        const dressGeo = new THREE.CylinderGeometry(0.3, 0.5, 0.65, 12);
        const dress = new THREE.Mesh(dressGeo, MAT.hgDress);
        dress.position.y = -0.1;
        body.add(dress);

        // Dress collar detail
        const collarGeo = new THREE.TorusGeometry(0.3, 0.02, 6, 12);
        const collar = new THREE.Mesh(collarGeo, MAT.hgHeart);
        collar.position.y = 0.22;
        collar.rotation.x = Math.PI / 2;
        dress.add(collar);

        // Heart decoration on dress front
        const heartGroup = new THREE.Group();
        const hGeo = new THREE.SphereGeometry(0.04, 8, 6);
        const hl = new THREE.Mesh(hGeo, MAT.hgHeart);
        hl.position.set(-0.025, 0.02, 0);
        heartGroup.add(hl);
        const hr = new THREE.Mesh(hGeo, MAT.hgHeart);
        hr.position.set(0.025, 0.02, 0);
        heartGroup.add(hr);
        const htip = new THREE.Mesh(new THREE.ConeGeometry(0.038, 0.055, 4), MAT.hgHeart);
        htip.position.y = -0.02;
        htip.rotation.z = Math.PI;
        heartGroup.add(htip);
        heartGroup.position.set(0, 0.15, -0.32);
        body.add(heartGroup);

        // Head (skin-colored)
        const headGeo = new THREE.SphereGeometry(0.42, 16, 12);
        const head = new THREE.Mesh(headGeo, MAT.hgSkin);
        head.position.set(0, 0.7, 0);
        head.castShadow = true;
        this.head = head;
        body.add(head);

        // Hair base (covers top and back of head)
        const hairBaseGeo = new THREE.SphereGeometry(0.44, 16, 12);
        const hairBase = new THREE.Mesh(hairBaseGeo, MAT.hgHair);
        hairBase.position.set(0, 0.03, 0.06);
        head.add(hairBase);

        // Bangs (front fringe)
        const bangsGeo = new THREE.SphereGeometry(0.44, 12, 6, 0, Math.PI * 2, 0, Math.PI * 0.32);
        const bangs = new THREE.Mesh(bangsGeo, MAT.hgHair);
        bangs.position.set(0, 0.03, -0.02);
        head.add(bangs);

        // Left pigtail
        this.leftPigtail = new THREE.Group();
        const ptGeo = new THREE.CapsuleGeometry(0.08, 0.28, 6, 8);
        const lpt = new THREE.Mesh(ptGeo, MAT.hgHair);
        this.leftPigtail.add(lpt);
        // Red hair tie
        const tieGeo = new THREE.TorusGeometry(0.06, 0.02, 6, 8);
        const ltie = new THREE.Mesh(tieGeo, MAT.hgHeart);
        ltie.position.y = 0.12;
        ltie.rotation.x = Math.PI / 2;
        this.leftPigtail.add(ltie);
        this.leftPigtail.position.set(-0.35, 0.12, 0.06);
        head.add(this.leftPigtail);

        // Right pigtail
        this.rightPigtail = new THREE.Group();
        const rpt = new THREE.Mesh(ptGeo, MAT.hgHair);
        this.rightPigtail.add(rpt);
        const rtie = new THREE.Mesh(tieGeo, MAT.hgHeart);
        rtie.position.y = 0.12;
        rtie.rotation.x = Math.PI / 2;
        this.rightPigtail.add(rtie);
        this.rightPigtail.position.set(0.35, 0.12, 0.06);
        head.add(this.rightPigtail);

        // Gold headband
        const crownGeo = new THREE.TorusGeometry(0.38, 0.02, 6, 16, Math.PI);
        const crown = new THREE.Mesh(crownGeo, MAT.hgCrown);
        crown.position.set(0, 0.15, -0.1);
        crown.rotation.x = -0.3;
        head.add(crown);

        // Small heart on headband center
        const miniHeart = new THREE.Group();
        const mhGeo = new THREE.SphereGeometry(0.02, 6, 4);
        const mhl = new THREE.Mesh(mhGeo, MAT.hgHeart);
        mhl.position.set(-0.012, 0.01, 0);
        miniHeart.add(mhl);
        const mhr = new THREE.Mesh(mhGeo, MAT.hgHeart);
        mhr.position.set(0.012, 0.01, 0);
        miniHeart.add(mhr);
        const mhtip = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.025, 4), MAT.hgHeart);
        mhtip.position.y = -0.008;
        mhtip.rotation.z = Math.PI;
        miniHeart.add(mhtip);
        miniHeart.position.set(0, 0.27, -0.28);
        head.add(miniHeart);

        // Eyes (big kawaii style, facing -Z)
        const eyeGeo = new THREE.SphereGeometry(0.10, 12, 10);
        const eyeShineGeo = new THREE.SphereGeometry(0.04, 6, 4);
        const eyeShine2Geo = new THREE.SphereGeometry(0.02, 6, 4);

        const leftEye = new THREE.Mesh(eyeGeo, MAT.hgEye);
        leftEye.position.set(-0.14, 0.02, -0.36);
        head.add(leftEye);
        const leftShine = new THREE.Mesh(eyeShineGeo, MAT.hgEyeShine);
        leftShine.position.set(0.02, 0.03, -0.05);
        leftEye.add(leftShine);
        const leftShine2 = new THREE.Mesh(eyeShine2Geo, MAT.hgEyeShine);
        leftShine2.position.set(-0.03, -0.02, -0.05);
        leftEye.add(leftShine2);

        const rightEye = new THREE.Mesh(eyeGeo, MAT.hgEye);
        rightEye.position.set(0.14, 0.02, -0.36);
        head.add(rightEye);
        const rightShine = new THREE.Mesh(eyeShineGeo, MAT.hgEyeShine);
        rightShine.position.set(0.02, 0.03, -0.05);
        rightEye.add(rightShine);
        const rightShine2 = new THREE.Mesh(eyeShine2Geo, MAT.hgEyeShine);
        rightShine2.position.set(-0.03, -0.02, -0.05);
        rightEye.add(rightShine2);

        // Eyelashes
        const lashGeo = new THREE.TorusGeometry(0.08, 0.008, 4, 8, Math.PI * 0.6);
        const lashMat = new THREE.MeshBasicMaterial({ color: 0x1A1A1A });
        const leftLash = new THREE.Mesh(lashGeo, lashMat);
        leftLash.position.set(-0.14, 0.1, -0.38);
        leftLash.rotation.z = 0.2;
        head.add(leftLash);
        const rightLash = new THREE.Mesh(lashGeo, lashMat);
        rightLash.position.set(0.14, 0.1, -0.38);
        rightLash.rotation.z = -0.2;
        head.add(rightLash);

        // Blush marks (kawaii pink cheek circles)
        const blushGeo = new THREE.SphereGeometry(0.07, 8, 6);
        blushGeo.scale(1.3, 0.8, 0.3);
        const leftBlush = new THREE.Mesh(blushGeo, MAT.hgBlush);
        leftBlush.position.set(-0.25, -0.06, -0.3);
        head.add(leftBlush);
        const rightBlush = new THREE.Mesh(blushGeo, MAT.hgBlush);
        rightBlush.position.set(0.25, -0.06, -0.3);
        head.add(rightBlush);

        // Small nose
        const noseGeo = new THREE.SphereGeometry(0.025, 6, 4);
        const nose = new THREE.Mesh(noseGeo, MAT.hgSkin);
        nose.position.set(0, -0.04, -0.4);
        head.add(nose);

        // Happy smile mouth (faces -Z)
        const mouthGeo = new THREE.TorusGeometry(0.06, 0.012, 6, 10, Math.PI);
        const mouth = new THREE.Mesh(mouthGeo, MAT.hgMouth);
        mouth.position.set(0, -0.14, -0.36);
        mouth.rotation.x = -Math.PI * 0.1;
        head.add(mouth);

        // Arms (skin-colored with short dress sleeves)
        const armGeo = new THREE.CapsuleGeometry(0.08, 0.28, 4, 8);
        const sleeveGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.1, 8);

        this.leftArm = new THREE.Group();
        const leftArmMesh = new THREE.Mesh(armGeo, MAT.hgSkin);
        leftArmMesh.castShadow = true;
        this.leftArm.add(leftArmMesh);
        const leftSleeve = new THREE.Mesh(sleeveGeo, MAT.hgDress);
        leftSleeve.position.y = 0.12;
        this.leftArm.add(leftSleeve);
        this.leftArm.position.set(-0.45, 0.1, 0);
        body.add(this.leftArm);

        this.rightArm = new THREE.Group();
        const rightArmMesh = new THREE.Mesh(armGeo, MAT.hgSkin);
        rightArmMesh.castShadow = true;
        this.rightArm.add(rightArmMesh);
        const rightSleeve = new THREE.Mesh(sleeveGeo, MAT.hgDress);
        rightSleeve.position.y = 0.12;
        this.rightArm.add(rightSleeve);
        this.rightArm.position.set(0.45, 0.1, 0);
        body.add(this.rightArm);

        // Hands (small skin spheres)
        const handGeo = new THREE.SphereGeometry(0.06, 6, 4);
        const leftHand = new THREE.Mesh(handGeo, MAT.hgSkin);
        leftHand.position.set(0, -0.21, 0);
        this.leftArm.add(leftHand);
        const rightHand = new THREE.Mesh(handGeo, MAT.hgSkin);
        rightHand.position.set(0, -0.21, 0);
        this.rightArm.add(rightHand);

        // Legs (skin-colored)
        const legGeo = new THREE.CapsuleGeometry(0.08, 0.25, 4, 8);

        this.leftLeg = new THREE.Group();
        const leftLegMesh = new THREE.Mesh(legGeo, MAT.hgSkin);
        leftLegMesh.castShadow = true;
        this.leftLeg.add(leftLegMesh);
        this.leftLeg.position.set(-0.15, -0.5, 0);
        body.add(this.leftLeg);

        this.rightLeg = new THREE.Group();
        const rightLegMesh = new THREE.Mesh(legGeo, MAT.hgSkin);
        rightLegMesh.castShadow = true;
        this.rightLeg.add(rightLegMesh);
        this.rightLeg.position.set(0.15, -0.5, 0);
        body.add(this.rightLeg);

        // Shoes (black mary-janes)
        const shoeGeo = new THREE.SphereGeometry(0.09, 8, 6);
        shoeGeo.scale(1, 0.7, 1.2);
        const leftShoe = new THREE.Mesh(shoeGeo, MAT.hgShoe);
        leftShoe.position.set(0, -0.2, -0.02);
        this.leftLeg.add(leftShoe);
        const rightShoe = new THREE.Mesh(shoeGeo, MAT.hgShoe);
        rightShoe.position.set(0, -0.2, -0.02);
        this.rightLeg.add(rightShoe);
    }

    update(dt) {
        this.animTime += dt;

        // Continuous lateral movement
        if (this.moveDir !== 0) {
            const minX = DIMS.LANE_POSITIONS[0];
            const maxX = DIMS.LANE_POSITIONS[2];
            this.mesh.position.x = clamp(
                this.mesh.position.x + this.moveDir * PHYSICS.MOVE_SPEED * dt,
                minX, maxX
            );
        }

        // Damage flicker
        if (this.isDamaged) {
            this.damageTimer -= dt;
            this.mesh.visible = Math.floor(this.damageTimer * 10) % 2 === 0;
            if (this.damageTimer <= 0) {
                this.isDamaged = false;
                this.mesh.visible = true;
            }
        }

        // Animations
        if (this.isSpinning) {
            this._animateSpin(dt);
        } else if (this.isDancing) {
            this._animateDance(dt);
        } else if (!this.isGrounded) {
            this._animateJump(dt);
        } else {
            this._animateRun(dt);
        }
    }

    _animateRun(dt) {
        const speed = 8;
        const t = this.animTime * speed;
        // Leg swing
        this.leftLeg.rotation.x = Math.sin(t) * 0.6;
        this.rightLeg.rotation.x = Math.sin(t + Math.PI) * 0.6;
        // Arm swing (opposite to legs)
        this.leftArm.rotation.x = Math.sin(t + Math.PI) * 0.5;
        this.rightArm.rotation.x = Math.sin(t) * 0.5;
        // Slight body bob
        this.body.position.y = Math.abs(Math.sin(t)) * 0.05;
        this.body.rotation.z = 0;
        this.head.rotation.z = 0;
        // Pigtail bounce
        this.leftPigtail.rotation.x = Math.sin(t + 0.5) * 0.2;
        this.rightPigtail.rotation.x = Math.sin(t + 0.5) * 0.2;
        this.leftPigtail.rotation.z = Math.sin(t) * 0.1;
        this.rightPigtail.rotation.z = -Math.sin(t) * 0.1;
    }

    _animateJump(dt) {
        // Arms up
        this.leftArm.rotation.x = -1.2;
        this.rightArm.rotation.x = -1.2;
        this.leftArm.rotation.z = -0.3;
        this.rightArm.rotation.z = 0.3;
        // Legs tucked
        this.leftLeg.rotation.x = 0.4;
        this.rightLeg.rotation.x = 0.4;
        // Pigtails fly up
        this.leftPigtail.rotation.x = -0.4;
        this.rightPigtail.rotation.x = -0.4;
    }

    _animateSpin(dt) {
        const spinDuration = 1.0;
        this.spinProgress += dt / spinDuration;
        if (this.spinProgress >= 1) {
            this.spinProgress = 1;
            this.isSpinning = false;
            this.isDancing = true;
            this.animTime = 0;
        }
        const eased = 1 - Math.pow(1 - this.spinProgress, 2);
        this.mesh.rotation.y = eased * Math.PI * 3;
        // Arms out during spin
        this.leftArm.rotation.z = -1.0;
        this.rightArm.rotation.z = 1.0;
        this.leftArm.rotation.x = 0;
        this.rightArm.rotation.x = 0;
        // Little hop during spin
        this.body.position.y = Math.sin(this.spinProgress * Math.PI) * 0.2;
        // Pigtails fly out
        this.leftPigtail.rotation.z = -0.5 * this.spinProgress;
        this.rightPigtail.rotation.z = 0.5 * this.spinProgress;
    }

    _animateDance(dt) {
        const t = this.animTime * 6;
        // Wiggle body
        this.body.rotation.z = Math.sin(t) * 0.2;
        this.head.rotation.z = Math.sin(t * 1.5) * 0.15;
        // Wave arms
        this.leftArm.rotation.x = Math.sin(t) * 0.8 - 0.5;
        this.rightArm.rotation.x = Math.sin(t + 1) * 0.8 - 0.5;
        this.leftArm.rotation.z = Math.sin(t * 0.7) * 0.3 - 0.3;
        this.rightArm.rotation.z = Math.sin(t * 0.7 + 1) * 0.3 + 0.3;
        // Bob
        this.body.position.y = Math.abs(Math.sin(t * 2)) * 0.15;
        // Legs tap
        this.leftLeg.rotation.x = Math.sin(t) * 0.3;
        this.rightLeg.rotation.x = Math.sin(t + Math.PI) * 0.3;
        // Pigtail bounce
        this.leftPigtail.rotation.x = Math.sin(t * 1.5) * 0.3;
        this.rightPigtail.rotation.x = Math.sin(t * 1.5 + 0.5) * 0.3;
        this.leftPigtail.rotation.z = Math.sin(t) * 0.15;
        this.rightPigtail.rotation.z = -Math.sin(t) * 0.15;
    }

    // Nearest lane index for collision purposes
    get lane() {
        const x = this.mesh.position.x;
        let closest = 0;
        let minDist = Infinity;
        for (let i = 0; i < DIMS.LANE_POSITIONS.length; i++) {
            const d = Math.abs(x - DIMS.LANE_POSITIONS[i]);
            if (d < minDist) { minDist = d; closest = i; }
        }
        return closest;
    }

    setMoveDirection(dir) {
        this.moveDir = dir;
    }

    jump() {
        if (this.isGrounded) {
            this.velocityY = PHYSICS.JUMP_VELOCITY;
            this.isGrounded = false;
            this.isJumping = true;
            this.jumpHoldTimer = 0;
        }
    }

    takeDamage(invincibilityTime) {
        this.isDamaged = true;
        this.damageTimer = invincibilityTime;
    }

    async tipOver() {
        this.isFalling = true;
        this.isDamaged = false;
        this.mesh.visible = true;

        // Tip forward face-first over ~0.6s
        const duration = 0.6;
        const startTime = performance.now();
        await new Promise(resolve => {
            const animate = () => {
                const elapsed = (performance.now() - startTime) / 1000;
                const t = Math.min(elapsed / duration, 1);
                const eased = t * t;
                this.body.rotation.x = eased * (Math.PI / 2);
                this.mesh.position.y = PHYSICS.GROUND_Y - eased * 0.3;
                this.leftArm.rotation.x = -eased * 0.5;
                this.rightArm.rotation.x = -eased * 0.5;
                this.leftLeg.rotation.x = eased * 0.3;
                this.rightLeg.rotation.x = eased * 0.3;
                this.leftPigtail.rotation.x = eased * 0.5;
                this.rightPigtail.rotation.x = eased * 0.5;
                if (t < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            animate();
        });

        // Hold for a moment
        await new Promise(r => setTimeout(r, 400));

        // Fade out over ~0.5s
        const fadeDuration = 0.5;
        const fadeStart = performance.now();
        const materials = [];
        this.mesh.traverse(child => {
            if (child.isMesh && child.material) {
                child.material = child.material.clone();
                child.material.transparent = true;
                materials.push(child.material);
            }
        });
        await new Promise(resolve => {
            const fadeAnimate = () => {
                const elapsed = (performance.now() - fadeStart) / 1000;
                const t = Math.min(elapsed / fadeDuration, 1);
                const opacity = 1 - t;
                for (const mat of materials) {
                    mat.opacity = opacity;
                }
                if (t < 1) {
                    requestAnimationFrame(fadeAnimate);
                } else {
                    this.mesh.visible = false;
                    for (const mat of materials) {
                        mat.opacity = 1;
                        mat.transparent = false;
                    }
                    resolve();
                }
            };
            fadeAnimate();
        });

        this.isFalling = false;
        this.body.rotation.x = 0;
    }

    startDancing() {
        this.isSpinning = true;
        this.spinProgress = 0;
        this.isDancing = false;
        this.animTime = 0;
    }

    stopDancing() {
        this.isDancing = false;
        this.isSpinning = false;
        this.spinProgress = 0;
        this.mesh.rotation.y = 0;
        this.body.rotation.z = 0;
        this.head.rotation.z = 0;
        this.leftPigtail.rotation.x = 0;
        this.leftPigtail.rotation.z = 0;
        this.rightPigtail.rotation.x = 0;
        this.rightPigtail.rotation.z = 0;
    }

    reset() {
        this.moveDir = 0;
        this.mesh.position.set(DIMS.LANE_POSITIONS[1], PHYSICS.GROUND_Y, 0);
        this.velocityY = 0;
        this.isGrounded = true;
        this.isJumping = false;
        this.jumpHoldTimer = 0;
        this.isDamaged = false;
        this.damageTimer = 0;
        this.isDancing = false;
        this.isSpinning = false;
        this.spinProgress = 0;
        this.isFalling = false;
        this.mesh.visible = true;
        this.mesh.rotation.y = 0;
        this.animTime = 0;
        this.body.rotation.z = 0;
        this.head.rotation.z = 0;
        this.leftPigtail.rotation.x = 0;
        this.leftPigtail.rotation.z = 0;
        this.rightPigtail.rotation.x = 0;
        this.rightPigtail.rotation.z = 0;
    }

    getBoundingBox() {
        const pos = this.mesh.position;
        return new THREE.Box3(
            new THREE.Vector3(pos.x - 0.3, pos.y - 0.5, pos.z - 0.3),
            new THREE.Vector3(pos.x + 0.3, pos.y + 0.6, pos.z + 0.3)
        );
    }
}
