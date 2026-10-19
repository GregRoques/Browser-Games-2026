import * as THREE from 'three';
import { COLORS } from './Constants.js';

// Shared gradient map for toon shading (3-tone)
const gradientCanvas = document.createElement('canvas');
gradientCanvas.width = 4;
gradientCanvas.height = 1;
const ctx = gradientCanvas.getContext('2d');
ctx.fillStyle = '#444';
ctx.fillRect(0, 0, 1, 1);
ctx.fillStyle = '#999';
ctx.fillRect(1, 0, 1, 1);
ctx.fillStyle = '#ccc';
ctx.fillRect(2, 0, 1, 1);
ctx.fillStyle = '#fff';
ctx.fillRect(3, 0, 1, 1);

const gradientMap = new THREE.CanvasTexture(gradientCanvas);
gradientMap.minFilter = THREE.NearestFilter;
gradientMap.magFilter = THREE.NearestFilter;

function toon(color, opts = {}) {
    return new THREE.MeshToonMaterial({
        color,
        gradientMap,
        transparent: opts.transparent || false,
        opacity: opts.opacity !== undefined ? opts.opacity : 1,
        side: opts.side || THREE.FrontSide,
        emissive: opts.emissive || 0x000000,
        emissiveIntensity: opts.emissiveIntensity || 0,
    });
}

function _createBrickTexture() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx2 = canvas.getContext('2d');

    // Mortar background
    ctx2.fillStyle = '#2D1B4E';
    ctx2.fillRect(0, 0, size, size);

    const brickColors = ['#3A2555', '#4A3268', '#352050'];
    const brickW = 40;
    const brickH = 18;
    const mortarSize = 3;
    const rows = Math.ceil(size / (brickH + mortarSize));
    const cols = Math.ceil(size / (brickW + mortarSize)) + 1;

    for (let row = 0; row < rows; row++) {
        const offsetX = (row % 2 === 1) ? (brickW + mortarSize) / 2 : 0;
        const y = row * (brickH + mortarSize);

        for (let col = -1; col < cols; col++) {
            const x = col * (brickW + mortarSize) + offsetX;

            // Random brick color
            const baseColor = brickColors[Math.floor(Math.random() * brickColors.length)];
            ctx2.fillStyle = baseColor;
            ctx2.fillRect(x, y, brickW, brickH);

            // Weathering splotches
            for (let s = 0; s < 3; s++) {
                const sx = x + Math.random() * brickW;
                const sy = y + Math.random() * brickH;
                const sr = 2 + Math.random() * 5;
                ctx2.fillStyle = `rgba(0,0,0,${0.05 + Math.random() * 0.15})`;
                ctx2.beginPath();
                ctx2.arc(sx, sy, sr, 0, Math.PI * 2);
                ctx2.fill();
            }

            // Crack lines
            if (Math.random() < 0.3) {
                ctx2.strokeStyle = `rgba(0,0,0,${0.15 + Math.random() * 0.2})`;
                ctx2.lineWidth = 0.5 + Math.random();
                ctx2.beginPath();
                const cx = x + Math.random() * brickW;
                const cy = y + Math.random() * brickH;
                ctx2.moveTo(cx, cy);
                ctx2.lineTo(cx + (Math.random() - 0.5) * 15, cy + (Math.random() - 0.5) * 10);
                ctx2.stroke();
            }
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 3);
    return texture;
}

function basic(color, opts = {}) {
    return new THREE.MeshBasicMaterial({
        color,
        transparent: opts.transparent || false,
        opacity: opts.opacity !== undefined ? opts.opacity : 1,
        side: opts.side || THREE.FrontSide,
    });
}

export const MAT = {
    // Teddy
    teddyBody:     toon(COLORS.TEDDY_BODY),
    teddyLight:    toon(COLORS.TEDDY_LIGHT),
    teddyDark:     toon(COLORS.TEDDY_DARK),
    teddyNose:     toon(COLORS.TEDDY_NOSE),
    teddyEye:      basic(COLORS.TEDDY_EYE),
    teddyEyeShine: basic(COLORS.TEDDY_EYE_SHINE),
    teddyMouth:    toon(COLORS.TEDDY_MOUTH),
    teddyBowtie:   toon(COLORS.TEDDY_BOWTIE),
    teddyBlush:    toon(COLORS.TEDDY_BLUSH, { transparent: true, opacity: 0.5 }),

    // Heart Girl
    hgSkin:        toon(COLORS.HG_SKIN),
    hgHair:        toon(COLORS.HG_HAIR),
    hgDress:       toon(COLORS.HG_DRESS),
    hgCrown:       toon(COLORS.HG_CROWN),
    hgHeart:       toon(COLORS.HG_HEART),
    hgShoe:        toon(COLORS.HG_SHOE),
    hgBlush:       toon(COLORS.HG_BLUSH, { transparent: true, opacity: 0.5 }),
    hgEye:         basic(COLORS.HG_EYE),
    hgEyeShine:    basic(COLORS.HG_EYE_SHINE),
    hgMouth:       toon(COLORS.HG_MOUTH),

    // Floor
    floorStone:    toon(COLORS.FLOOR_STONE),
    floorStoneAlt: toon(COLORS.FLOOR_STONE_ALT),
    floorEdge:     toon(COLORS.FLOOR_EDGE),

    // Walls
    wallMain:      toon(COLORS.WALL_MAIN),
    wallTrim:      toon(COLORS.WALL_TRIM),
    wallBrick:     new THREE.MeshToonMaterial({
        color: 0xFFFFFF,
        map: _createBrickTexture(),
        gradientMap,
    }),

    // Decorations
    candleFlame:   toon(COLORS.CANDLE_FLAME, { emissive: COLORS.CANDLE_FLAME, emissiveIntensity: 0.6 }),
    candleWax:     toon(COLORS.CANDLE_WAX),
    webColor:      toon(COLORS.WEB_COLOR, { transparent: true, opacity: 0.5, side: THREE.DoubleSide }),
    pumpkin:       toon(COLORS.PUMPKIN),
    pumpkinFace:   basic(COLORS.PUMPKIN_FACE),
    portraitFrame: toon(COLORS.PORTRAIT_FRAME),
    clockFace:     toon(COLORS.CLOCK_FACE),
    clockHands:    toon(COLORS.CLOCK_HANDS, { emissive: COLORS.CLOCK_HANDS, emissiveIntensity: 0.2 }),
    clockRing:     toon(COLORS.CLOCK_RING),
    torchBracket:  toon(COLORS.TORCH_BRACKET),

    // Enemies
    mummyWrap:     toon(COLORS.MUMMY_WRAP),
    mummyEye:      basic(COLORS.MUMMY_EYE),
    zombieSkin:    toon(COLORS.ZOMBIE_SKIN),
    zombieDark:    toon(COLORS.ZOMBIE_DARK),
    batBody:       toon(COLORS.BAT_BODY),
    batWing:       toon(COLORS.BAT_WING, { side: THREE.DoubleSide }),
    batEye:        basic(COLORS.BAT_EYE),
    ghostBody:     toon(COLORS.GHOST_BODY, { transparent: true, opacity: 0.35 }),
    ghostEye:      basic(COLORS.GHOST_EYE),
    spiderBody:    toon(COLORS.SPIDER_BODY),
    spiderLeg:     toon(COLORS.SPIDER_LEG),
    spiderEye:     basic(COLORS.SPIDER_EYE),
    spiderWeb:     toon(COLORS.SPIDER_WEB, { transparent: true, opacity: 0.4 }),

    // Skeleton
    skeletonBone:  toon(COLORS.SKELETON_BONE),
    skeletonDark:  toon(COLORS.SKELETON_DARK),
    skeletonEye:   basic(COLORS.SKELETON_EYE),
    boneProj:      toon(COLORS.BONE_PROJ),

    // Jack-o-Lantern
    jackoBody:     toon(COLORS.JACKO_BODY),
    jackoFace:     toon(COLORS.JACKO_FACE, { emissive: COLORS.JACKO_FACE, emissiveIntensity: 0.8 }),
    jackoStem:     toon(COLORS.JACKO_STEM),
    fireProj:      basic(COLORS.FIRE_PROJ),
    fireInner:     basic(COLORS.FIRE_INNER),

    // Finish
    finishBanner:  toon(COLORS.FINISH_BANNER, { emissive: COLORS.FINISH_BANNER, emissiveIntensity: 0.3 }),
    finishPole:    toon(COLORS.FINISH_POLE),
};
