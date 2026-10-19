import * as THREE from 'three';
import { MAT } from '../utils/MaterialPalette.js';
import { randomRange, randomChoice } from '../utils/MathUtils.js';
import { DIMS } from '../utils/Constants.js';

export class Decoration {
    static createCandle(side) {
        const group = new THREE.Group();

        const waxGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.3, 6);
        const wax = new THREE.Mesh(waxGeo, MAT.candleWax);
        wax.position.y = 0.15;
        group.add(wax);

        const flameGeo = new THREE.ConeGeometry(0.04, 0.12, 6);
        const flame = new THREE.Mesh(flameGeo, MAT.candleFlame);
        flame.position.y = 0.36;
        group.add(flame);

        const holderGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.06, 6);
        const holder = new THREE.Mesh(holderGeo, MAT.portraitFrame);
        holder.position.y = 0.03;
        group.add(holder);

        const x = side === 'left' ? -DIMS.WALL_OFFSET + 0.4 : DIMS.WALL_OFFSET - 0.4;
        group.position.set(x, 1.5, 0);

        return group;
    }

    static createWeb(side) {
        const group = new THREE.Group();

        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0.8, 0);
        shape.lineTo(0, -0.8);
        shape.closePath();

        const webGeo = new THREE.ShapeGeometry(shape);
        const web = new THREE.Mesh(webGeo, MAT.webColor);
        group.add(web);

        for (let i = 0; i < 3; i++) {
            const strandGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.7, 3);
            const strand = new THREE.Mesh(strandGeo, MAT.webColor);
            strand.rotation.z = -Math.PI / 4 + (i - 1) * 0.3;
            strand.position.set(0.2, -0.2, 0.01);
            group.add(strand);
        }

        const x = side === 'left' ? -DIMS.WALL_OFFSET + 0.3 : DIMS.WALL_OFFSET - 0.3;
        const rotY = side === 'left' ? 0.3 : -0.3;
        group.position.set(x, DIMS.CEILING_HEIGHT - 0.1, 0);
        group.rotation.y = rotY;

        return group;
    }

    static createCobwebCluster(side) {
        const group = new THREE.Group();

        // Multiple overlapping web triangles for a dense cluster
        for (let i = 0; i < 4; i++) {
            const size = randomRange(0.5, 1.2);
            const shape = new THREE.Shape();
            shape.moveTo(0, 0);
            shape.lineTo(size, randomRange(-0.1, 0.1));
            shape.lineTo(randomRange(-0.1, 0.1), -size);
            shape.closePath();

            const geo = new THREE.ShapeGeometry(shape);
            const mesh = new THREE.Mesh(geo, MAT.webColor);
            mesh.rotation.z = randomRange(-0.3, 0.3);
            mesh.position.set(randomRange(-0.2, 0.2), randomRange(-0.2, 0.2), i * 0.01);
            group.add(mesh);
        }

        // Cross strands
        for (let i = 0; i < 5; i++) {
            const len = randomRange(0.4, 1.0);
            const strandGeo = new THREE.CylinderGeometry(0.003, 0.003, len, 3);
            const strand = new THREE.Mesh(strandGeo, MAT.webColor);
            strand.rotation.z = randomRange(-1, 1);
            strand.position.set(randomRange(-0.2, 0.3), randomRange(-0.3, 0.1), 0.02);
            group.add(strand);
        }

        const x = side === 'left' ? -DIMS.WALL_OFFSET + 0.3 : DIMS.WALL_OFFSET - 0.3;
        group.position.set(x, DIMS.CEILING_HEIGHT - 0.2, 0);
        group.rotation.y = side === 'left' ? 0.4 : -0.4;

        return group;
    }

    static createPumpkin() {
        const group = new THREE.Group();

        const bodyGeo = new THREE.SphereGeometry(0.25, 10, 8);
        bodyGeo.scale(1.2, 0.9, 1);
        const body = new THREE.Mesh(bodyGeo, MAT.pumpkin);
        group.add(body);

        for (let i = 0; i < 6; i++) {
            const ribGeo = new THREE.TorusGeometry(0.24, 0.03, 4, 12, Math.PI * 2);
            const rib = new THREE.Mesh(ribGeo, MAT.pumpkin);
            rib.rotation.y = (i / 6) * Math.PI;
            group.add(rib);
        }

        const eyeGeo = new THREE.BoxGeometry(0.06, 0.06, 0.05);
        const leftEye = new THREE.Mesh(eyeGeo, MAT.pumpkinFace);
        leftEye.position.set(-0.08, 0.05, 0.22);
        group.add(leftEye);
        const rightEye = new THREE.Mesh(eyeGeo, MAT.pumpkinFace);
        rightEye.position.set(0.08, 0.05, 0.22);
        group.add(rightEye);

        const mouthGeo = new THREE.BoxGeometry(0.12, 0.04, 0.05);
        const mouth = new THREE.Mesh(mouthGeo, MAT.pumpkinFace);
        mouth.position.set(0, -0.06, 0.22);
        group.add(mouth);

        const stemGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.1, 4);
        const stem = new THREE.Mesh(stemGeo, new THREE.MeshToonMaterial({ color: 0x4A6B1A }));
        stem.position.y = 0.26;
        group.add(stem);

        const side = Math.random() > 0.5 ? 1 : -1;
        group.position.set(side * (DIMS.WALL_OFFSET - 1), 0.25, 0);

        return group;
    }

    static createPortrait(side) {
        const group = new THREE.Group();

        const frameGeo = new THREE.BoxGeometry(0.6, 0.8, 0.08);
        const frame = new THREE.Mesh(frameGeo, MAT.portraitFrame);
        group.add(frame);

        const canvasGeo = new THREE.BoxGeometry(0.45, 0.65, 0.02);
        const colors = [0x3E2769, 0x4A3662, 0x2D1B4E, 0x6B4C9A];
        const canvasMat = new THREE.MeshToonMaterial({ color: randomChoice(colors) });
        const canvas = new THREE.Mesh(canvasGeo, canvasMat);
        canvas.position.z = 0.04;
        group.add(canvas);

        const dotGeo = new THREE.SphereGeometry(0.04, 6, 4);
        const dotMat = new THREE.MeshBasicMaterial({ color: 0xFF4757 });
        const eye1 = new THREE.Mesh(dotGeo, dotMat);
        eye1.position.set(-0.08, 0.1, 0.06);
        group.add(eye1);
        const eye2 = new THREE.Mesh(dotGeo, dotMat);
        eye2.position.set(0.08, 0.1, 0.06);
        group.add(eye2);

        const x = side === 'left' ? -DIMS.WALL_OFFSET + 0.3 : DIMS.WALL_OFFSET - 0.3;
        group.position.set(x, 2.5, 0);
        group.rotation.y = side === 'left' ? Math.PI / 2 : -Math.PI / 2;

        return group;
    }

    static createClock(side) {
        const group = new THREE.Group();

        // Clock face (cylinder)
        const faceGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.06, 16);
        const face = new THREE.Mesh(faceGeo, MAT.clockFace);
        face.rotation.z = Math.PI / 2;
        face.rotation.y = side === 'left' ? Math.PI / 2 : -Math.PI / 2;
        group.add(face);

        // Outer ring
        const ringGeo = new THREE.TorusGeometry(0.32, 0.04, 6, 16);
        const ring = new THREE.Mesh(ringGeo, MAT.clockRing);
        ring.rotation.y = side === 'left' ? Math.PI / 2 : -Math.PI / 2;
        group.add(ring);

        // Hour markers (12 small dots)
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const markerGeo = new THREE.SphereGeometry(0.015, 4, 4);
            const marker = new THREE.Mesh(markerGeo, MAT.clockHands);
            const zOff = side === 'left' ? -0.04 : 0.04;
            marker.position.set(
                Math.cos(angle) * 0.24,
                Math.sin(angle) * 0.24,
                zOff
            );
            group.add(marker);
        }

        // Clock hands
        const hourGeo = new THREE.BoxGeometry(0.02, 0.15, 0.02);
        const hour = new THREE.Mesh(hourGeo, MAT.clockHands);
        hour.position.y = 0.075;
        const hourPivot = new THREE.Group();
        hourPivot.add(hour);
        hourPivot.rotation.z = randomRange(0, Math.PI * 2);
        group.add(hourPivot);
        group.userData.hourHand = hourPivot;

        const minGeo = new THREE.BoxGeometry(0.015, 0.22, 0.02);
        const min = new THREE.Mesh(minGeo, MAT.clockHands);
        min.position.y = 0.11;
        const minPivot = new THREE.Group();
        minPivot.add(min);
        minPivot.rotation.z = randomRange(0, Math.PI * 2);
        group.add(minPivot);
        group.userData.minHand = minPivot;

        // Center knob
        const knobGeo = new THREE.SphereGeometry(0.025, 6, 4);
        const knob = new THREE.Mesh(knobGeo, MAT.clockHands);
        group.add(knob);

        const x = side === 'left' ? -DIMS.WALL_OFFSET + 0.3 : DIMS.WALL_OFFSET - 0.3;
        group.position.set(x, 2.8, 0);

        group.userData.type = 'clock';
        return group;
    }

    static createChandelier() {
        const group = new THREE.Group();

        // Main ring
        const ringGeo = new THREE.TorusGeometry(0.5, 0.04, 6, 16);
        const ring = new THREE.Mesh(ringGeo, MAT.clockRing);
        ring.rotation.x = Math.PI / 2;
        group.add(ring);

        // Chain to ceiling
        const chainGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.8, 4);
        const chain = new THREE.Mesh(chainGeo, MAT.torchBracket);
        chain.position.y = 0.4;
        group.add(chain);

        // Candle holders around the ring (6 candles)
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const cx = Math.cos(angle) * 0.5;
            const cz = Math.sin(angle) * 0.5;

            // Holder arm
            const armGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.15, 4);
            const arm = new THREE.Mesh(armGeo, MAT.clockRing);
            arm.position.set(cx, -0.07, cz);
            group.add(arm);

            // Small candle
            const waxGeo = new THREE.CylinderGeometry(0.025, 0.03, 0.12, 4);
            const wax = new THREE.Mesh(waxGeo, MAT.candleWax);
            wax.position.set(cx, 0.0, cz);
            group.add(wax);

            // Flame
            const flameGeo = new THREE.ConeGeometry(0.02, 0.06, 4);
            const flame = new THREE.Mesh(flameGeo, MAT.candleFlame);
            flame.position.set(cx, 0.09, cz);
            group.add(flame);
        }

        group.position.set(0, DIMS.CEILING_HEIGHT - 0.9, 0);
        group.userData.type = 'chandelier';
        return group;
    }

    static createTorch(side) {
        const group = new THREE.Group();

        // Wall bracket
        const bracketGeo = new THREE.BoxGeometry(0.08, 0.08, 0.25);
        const bracket = new THREE.Mesh(bracketGeo, MAT.torchBracket);
        group.add(bracket);

        // Torch shaft
        const shaftGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.4, 6);
        const shaft = new THREE.Mesh(shaftGeo, MAT.portraitFrame);
        shaft.position.y = 0.2;
        const zOff = side === 'left' ? -0.1 : 0.1;
        shaft.position.z = zOff;
        group.add(shaft);

        // Flame (bigger than candle)
        const flameGeo = new THREE.ConeGeometry(0.06, 0.2, 6);
        const flame = new THREE.Mesh(flameGeo, MAT.candleFlame);
        flame.position.set(0, 0.5, zOff);
        group.add(flame);
        group.userData.flame = flame;

        // Inner flame
        const innerGeo = new THREE.ConeGeometry(0.03, 0.12, 4);
        const innerMat = new THREE.MeshBasicMaterial({ color: 0xFFE66D });
        const inner = new THREE.Mesh(innerGeo, innerMat);
        inner.position.set(0, 0.48, zOff);
        group.add(inner);

        const x = side === 'left' ? -DIMS.WALL_OFFSET + 0.3 : DIMS.WALL_OFFSET - 0.3;
        group.position.set(x, 2.0, 0);
        group.userData.type = 'torch';
        return group;
    }

    static createRandom(segmentZ) {
        const decorations = [];
        const r = Math.random;

        // Always try to place something on each wall side
        const leftDec = r() < 0.65;
        const rightDec = r() < 0.65;

        if (leftDec) {
            const type = r();
            let dec;
            if (type < 0.2) {
                dec = Decoration.createClock('left');
            } else if (type < 0.4) {
                dec = Decoration.createTorch('left');
            } else if (type < 0.55) {
                dec = Decoration.createPortrait('left');
            } else if (type < 0.7) {
                dec = Decoration.createCandle('left');
            } else if (type < 0.85) {
                dec = Decoration.createCobwebCluster('left');
            } else {
                dec = Decoration.createWeb('left');
            }
            dec.position.z = segmentZ + randomRange(-3, 3);
            decorations.push(dec);
        }

        if (rightDec) {
            const type = r();
            let dec;
            if (type < 0.2) {
                dec = Decoration.createClock('right');
            } else if (type < 0.4) {
                dec = Decoration.createTorch('right');
            } else if (type < 0.55) {
                dec = Decoration.createPortrait('right');
            } else if (type < 0.7) {
                dec = Decoration.createCandle('right');
            } else if (type < 0.85) {
                dec = Decoration.createCobwebCluster('right');
            } else {
                dec = Decoration.createWeb('right');
            }
            dec.position.z = segmentZ + randomRange(-3, 3);
            decorations.push(dec);
        }

        // Chandelier (center ceiling, less frequent)
        if (r() < 0.12) {
            const ch = Decoration.createChandelier();
            ch.position.z = segmentZ;
            decorations.push(ch);
        }

        // Floor pumpkin
        if (r() < 0.15) {
            const pumpkin = Decoration.createPumpkin();
            pumpkin.position.z = segmentZ + randomRange(-3, 3);
            decorations.push(pumpkin);
        }

        return decorations;
    }
}
