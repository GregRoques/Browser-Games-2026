import * as THREE from 'three';
import { MAT } from '../utils/MaterialPalette.js';
import { PHYSICS, DIMS } from '../utils/Constants.js';
import { lerp, clamp, smoothstep } from '../utils/MathUtils.js';

export class Teddy {
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

        this._buildMesh();
        this.mesh.position.set(DIMS.LANE_POSITIONS[1], PHYSICS.GROUND_Y, 0);
        this.mesh.castShadow = true;
    }

    _buildMesh() {
        // Body (rounder chibi proportions)
        const bodyGeo = new THREE.SphereGeometry(0.45, 16, 12);
        bodyGeo.scale(1, 1.0, 0.9);
        const body = new THREE.Mesh(bodyGeo, MAT.teddyBody);
        body.castShadow = true;
        this.body = body;
        this.mesh.add(body);

        // Belly patch (faces -Z now)
        const bellyGeo = new THREE.SphereGeometry(0.28, 12, 8);
        bellyGeo.scale(1, 1, 0.5);
        const belly = new THREE.Mesh(bellyGeo, MAT.teddyLight);
        belly.position.set(0, -0.05, -0.3);
        body.add(belly);

        // Head (bigger for kawaii chibi look)
        const headGeo = new THREE.SphereGeometry(0.42, 16, 12);
        const head = new THREE.Mesh(headGeo, MAT.teddyBody);
        head.position.set(0, 0.7, 0);
        head.castShadow = true;
        this.head = head;
        body.add(head);

        // Ears (bigger)
        const earGeo = new THREE.SphereGeometry(0.16, 10, 8);
        const earInnerGeo = new THREE.SphereGeometry(0.10, 8, 6);

        const leftEar = new THREE.Mesh(earGeo, MAT.teddyBody);
        leftEar.position.set(-0.28, 0.32, 0);
        head.add(leftEar);
        const leftEarInner = new THREE.Mesh(earInnerGeo, MAT.teddyLight);
        leftEarInner.position.set(0, 0, -0.05);
        leftEar.add(leftEarInner);

        const rightEar = new THREE.Mesh(earGeo, MAT.teddyBody);
        rightEar.position.set(0.28, 0.32, 0);
        head.add(rightEar);
        const rightEarInner = new THREE.Mesh(earInnerGeo, MAT.teddyLight);
        rightEarInner.position.set(0, 0, -0.05);
        rightEar.add(rightEarInner);

        // Eyes (big kawaii style, facing -Z)
        const eyeGeo = new THREE.SphereGeometry(0.10, 12, 10);
        const eyeShineGeo = new THREE.SphereGeometry(0.04, 6, 4);
        const eyeShine2Geo = new THREE.SphereGeometry(0.02, 6, 4);

        const leftEye = new THREE.Mesh(eyeGeo, MAT.teddyEye);
        leftEye.position.set(-0.14, 0.08, -0.36);
        head.add(leftEye);
        // Main shine (top-right)
        const leftShine = new THREE.Mesh(eyeShineGeo, MAT.teddyEyeShine);
        leftShine.position.set(0.02, 0.03, -0.05);
        leftEye.add(leftShine);
        // Second sparkle (bottom-left, anime style)
        const leftShine2 = new THREE.Mesh(eyeShine2Geo, MAT.teddyEyeShine);
        leftShine2.position.set(-0.03, -0.02, -0.05);
        leftEye.add(leftShine2);

        const rightEye = new THREE.Mesh(eyeGeo, MAT.teddyEye);
        rightEye.position.set(0.14, 0.08, -0.36);
        head.add(rightEye);
        const rightShine = new THREE.Mesh(eyeShineGeo, MAT.teddyEyeShine);
        rightShine.position.set(0.02, 0.03, -0.05);
        rightEye.add(rightShine);
        const rightShine2 = new THREE.Mesh(eyeShine2Geo, MAT.teddyEyeShine);
        rightShine2.position.set(-0.03, -0.02, -0.05);
        rightEye.add(rightShine2);

        // Blush marks (kawaii pink cheek circles)
        const blushGeo = new THREE.SphereGeometry(0.07, 8, 6);
        blushGeo.scale(1.3, 0.8, 0.3);
        const leftBlush = new THREE.Mesh(blushGeo, MAT.teddyBlush);
        leftBlush.position.set(-0.25, -0.02, -0.3);
        head.add(leftBlush);
        const rightBlush = new THREE.Mesh(blushGeo, MAT.teddyBlush);
        rightBlush.position.set(0.25, -0.02, -0.3);
        head.add(rightBlush);

        // Nose (small dark sphere, faces -Z)
        const noseGeo = new THREE.SphereGeometry(0.05, 8, 6);
        noseGeo.scale(1.3, 1, 1);
        const nose = new THREE.Mesh(noseGeo, MAT.teddyNose);
        nose.position.set(0, -0.03, -0.39);
        head.add(nose);

        // Mouth (happy upward curve, faces -Z)
        const mouthGeo = new THREE.TorusGeometry(0.07, 0.015, 6, 10, Math.PI);
        const mouth = new THREE.Mesh(mouthGeo, MAT.teddyMouth);
        mouth.position.set(0, -0.12, -0.36);
        mouth.rotation.x = -Math.PI * 0.1;
        head.add(mouth);

        // Bow-tie (faces -Z)
        const bowtieGroup = new THREE.Group();
        const bowGeo = new THREE.ConeGeometry(0.1, 0.15, 4);
        const bowLeft = new THREE.Mesh(bowGeo, MAT.teddyBowtie);
        bowLeft.rotation.z = Math.PI / 2;
        bowLeft.position.set(-0.08, 0, 0);
        bowtieGroup.add(bowLeft);
        const bowRight = new THREE.Mesh(bowGeo, MAT.teddyBowtie);
        bowRight.rotation.z = -Math.PI / 2;
        bowRight.position.set(0.08, 0, 0);
        bowtieGroup.add(bowRight);
        const bowKnot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 4), MAT.teddyBowtie);
        bowtieGroup.add(bowKnot);
        bowtieGroup.position.set(0, 0.35, -0.35);
        body.add(bowtieGroup);

        // Arms
        const armGeo = new THREE.CapsuleGeometry(0.1, 0.3, 4, 8);

        this.leftArm = new THREE.Group();
        const leftArmMesh = new THREE.Mesh(armGeo, MAT.teddyBody);
        leftArmMesh.castShadow = true;
        this.leftArm.add(leftArmMesh);
        this.leftArm.position.set(-0.5, 0.15, 0);
        body.add(this.leftArm);

        this.rightArm = new THREE.Group();
        const rightArmMesh = new THREE.Mesh(armGeo, MAT.teddyBody);
        rightArmMesh.castShadow = true;
        this.rightArm.add(rightArmMesh);
        this.rightArm.position.set(0.5, 0.15, 0);
        body.add(this.rightArm);

        // Paw pads on arms (face -Z)
        const pawGeo = new THREE.SphereGeometry(0.08, 6, 4);
        const leftPaw = new THREE.Mesh(pawGeo, MAT.teddyLight);
        leftPaw.position.set(0, -0.22, -0.05);
        this.leftArm.add(leftPaw);
        const rightPaw = new THREE.Mesh(pawGeo, MAT.teddyLight);
        rightPaw.position.set(0, -0.22, -0.05);
        this.rightArm.add(rightPaw);

        // Legs
        const legGeo = new THREE.CapsuleGeometry(0.12, 0.25, 4, 8);

        this.leftLeg = new THREE.Group();
        const leftLegMesh = new THREE.Mesh(legGeo, MAT.teddyBody);
        leftLegMesh.castShadow = true;
        this.leftLeg.add(leftLegMesh);
        this.leftLeg.position.set(-0.2, -0.45, 0);
        body.add(this.leftLeg);

        this.rightLeg = new THREE.Group();
        const rightLegMesh = new THREE.Mesh(legGeo, MAT.teddyBody);
        rightLegMesh.castShadow = true;
        this.rightLeg.add(rightLegMesh);
        this.rightLeg.position.set(0.2, -0.45, 0);
        body.add(this.rightLeg);

        // Feet pads (face -Z)
        const footGeo = new THREE.SphereGeometry(0.1, 6, 4);
        const leftFoot = new THREE.Mesh(footGeo, MAT.teddyLight);
        leftFoot.position.set(0, -0.2, -0.05);
        this.leftLeg.add(leftFoot);
        const rightFoot = new THREE.Mesh(footGeo, MAT.teddyLight);
        rightFoot.position.set(0, -0.2, -0.05);
        this.rightLeg.add(rightFoot);

        // Tail (now faces +Z = toward camera)
        const tailGeo = new THREE.SphereGeometry(0.1, 8, 6);
        const tail = new THREE.Mesh(tailGeo, MAT.teddyBody);
        tail.position.set(0, -0.15, 0.4);
        body.add(tail);
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
        // Ease-out for satisfying deceleration
        const eased = 1 - Math.pow(1 - this.spinProgress, 2);
        // 540 degrees (1.5 full rotations) ending at PI (facing camera)
        this.mesh.rotation.y = eased * Math.PI * 3;
        // Arms out during spin
        this.leftArm.rotation.z = -1.0;
        this.rightArm.rotation.z = 1.0;
        this.leftArm.rotation.x = 0;
        this.rightArm.rotation.x = 0;
        // Little hop during spin
        this.body.position.y = Math.sin(this.spinProgress * Math.PI) * 0.2;
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
        this.moveDir = dir; // -1, 0, or 1
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
                // Ease-in for a natural fall
                const eased = t * t;
                this.body.rotation.x = eased * (Math.PI / 2);
                // Sink down slightly as tipping
                this.mesh.position.y = PHYSICS.GROUND_Y - eased * 0.3;
                // Reset limbs to neutral during fall
                this.leftArm.rotation.x = -eased * 0.5;
                this.rightArm.rotation.x = -eased * 0.5;
                this.leftLeg.rotation.x = eased * 0.3;
                this.rightLeg.rotation.x = eased * 0.3;
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
        // Collect all materials for opacity
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
                    // Restore opacity
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
    }

    getBoundingBox() {
        const pos = this.mesh.position;
        // Slightly shrunk for forgiving hits
        return new THREE.Box3(
            new THREE.Vector3(pos.x - 0.3, pos.y - 0.5, pos.z - 0.3),
            new THREE.Vector3(pos.x + 0.3, pos.y + 0.6, pos.z + 0.3)
        );
    }
}
