export function lerp(a, b, t) {
    return a + (b - a) * t;
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

export function randomInt(min, max) {
    return Math.floor(randomRange(min, max + 1));
}

export function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function smoothstep(t) {
    return t * t * (3 - 2 * t);
}
