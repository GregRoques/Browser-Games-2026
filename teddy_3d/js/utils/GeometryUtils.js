import * as THREE from 'three';

export function createSphere(radius, wSeg = 16, hSeg = 12) {
    return new THREE.SphereGeometry(radius, wSeg, hSeg);
}

export function createBox(w, h, d) {
    return new THREE.BoxGeometry(w, h, d);
}

export function createCylinder(rTop, rBottom, height, segments = 12) {
    return new THREE.CylinderGeometry(rTop, rBottom, height, segments);
}

export function createCone(radius, height, segments = 8) {
    return new THREE.ConeGeometry(radius, height, segments);
}

export function createCapsule(radius, length, capSeg = 8, radSeg = 12) {
    return new THREE.CapsuleGeometry(radius, length, capSeg, radSeg);
}

export function createTorus(radius, tube, radSeg = 12, tubeSeg = 8) {
    return new THREE.TorusGeometry(radius, tube, radSeg, tubeSeg);
}

export function makeGroup(...meshes) {
    const group = new THREE.Group();
    for (const m of meshes) group.add(m);
    return group;
}
