import * as THREE from 'three';
import { COLORS, DIMS } from '../utils/Constants.js';

export class SceneManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(COLORS.BG_DARK);
        this.scene.fog = new THREE.FogExp2(COLORS.FOG, 0.04);

        // Camera
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(
            this._calcFOV(aspect),
            aspect,
            0.1,
            200
        );
        this.camera.position.set(0, 4, 8);
        this.camera.lookAt(0, 1, -5);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance',
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = isMobile ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;

        document.getElementById('game-canvas').appendChild(this.renderer.domElement);

        // Lights
        this._setupLights();

        // Resize
        window.addEventListener('resize', () => this._onResize());
    }

    _setupLights() {
        // Ambient
        const ambient = new THREE.AmbientLight(COLORS.AMBIENT_LIGHT, 0.5);
        this.scene.add(ambient);

        // Main directional
        const dirLight = new THREE.DirectionalLight(COLORS.DIR_LIGHT, 1.0);
        dirLight.position.set(3, 8, 5);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 512;
        dirLight.shadow.mapSize.height = 512;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 50;
        dirLight.shadow.camera.left = -15;
        dirLight.shadow.camera.right = 15;
        dirLight.shadow.camera.top = 10;
        dirLight.shadow.camera.bottom = -5;
        this.scene.add(dirLight);

        // Fill light from below for spooky up-lighting
        const fillLight = new THREE.PointLight(0x9B72CF, 0.4, 30);
        fillLight.position.set(0, -1, 0);
        this.scene.add(fillLight);
        this.fillLight = fillLight;

        // Hemisphere for ambient color variation
        const hemiLight = new THREE.HemisphereLight(0x6644AA, 0x2D1B4E, 0.3);
        this.scene.add(hemiLight);
    }

    updateFog(density, color) {
        this.scene.fog.density = density;
        this.scene.fog.color.set(color);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    _calcFOV(aspect) {
        return aspect < 1 ? 75 : 60;
    }

    _onResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const aspect = w / h;
        this.camera.aspect = aspect;
        this.camera.fov = this._calcFOV(aspect);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }
}
