import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// Get Model ID
const urlParams = new URLSearchParams(window.location.search);
const modelId = urlParams.get('model');

// Update Back Link
const backBtn = document.getElementById('back-btn');
if (modelId) {
    backBtn.href = `model-details.html?model=${modelId}`;
} else {
    backBtn.href = 'index.html';
}

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);
// Add some fog for depth
scene.fog = new THREE.Fog(0x111111, 10, 50);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 2.0;
controls.minDistance = 3;
controls.maxDistance = 10;
controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent going below ground

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(5, 10, 7.5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
scene.add(dirLight);

// Ground Plane
const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    metalness: 0.5,
    roughness: 0.1,
    side: THREE.DoubleSide
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Grid Helper for "Tech" feel
const gridHelper = new THREE.GridHelper(50, 50, 0x333333, 0x111111);
scene.add(gridHelper);

// Placeholder Car (Sleek Box) because we don't have the GLTF file yet
// User instruction: Replace 'assets/models/porsche_911.glb' with real file
const loader = new GLTFLoader();
const modelPath = 'assets/models/porsche_911.glb'; // Expected path

// Create a Placeholder Group
const carGroup = new THREE.Group();
scene.add(carGroup);

function createPlaceholderCar() {
    // Car Body
    const bodyGeometry = new THREE.BoxGeometry(4.5, 1.2, 2);
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xd5001c, // Porsche Red
        metalness: 0.7,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.75;
    body.castShadow = true;
    body.receiveShadow = true;
    carGroup.add(body);

    // Cabin
    const cabinGeometry = new THREE.BoxGeometry(2.5, 0.8, 1.8);
    const cabinMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x111111,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9
    });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.y = 1.6;
    body.castShadow = true;
    carGroup.add(cabin);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.5 });

    const positions = [
        { x: -1.5, z: 1 }, { x: 1.5, z: 1 },
        { x: -1.5, z: -1 }, { x: 1.5, z: -1 }
    ];

    positions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(pos.x, 0.4, pos.z);
        wheel.castShadow = true;
        carGroup.add(wheel);
    });

    document.getElementById('loading-screen').style.opacity = 0;
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
    }, 500);

    console.log("Placeholder car created. Add 'assets/models/porsche_911.glb' to see a real model.");
}

// Try to load real model, fallback to placeholder
loader.load(
    modelPath,
    function (gltf) {
        const model = gltf.scene;
        model.scale.set(1.5, 1.5, 1.5); // Adjust scale as needed
        model.traverse((o) => {
            if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
            }
        });
        carGroup.add(model);

        // Hide loading
        document.getElementById('loading-screen').style.opacity = 0;
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
        }, 500);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.warn('Real model not found, loading placeholder.', error);
        createPlaceholderCar();
    }
);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// UI Handlers
document.getElementById('auto-rotate-btn').addEventListener('click', (e) => {
    controls.autoRotate = !controls.autoRotate;
    e.target.textContent = controls.autoRotate ? 'Stop Rotation' : 'Start Rotation';
});

document.getElementById('reset-view-btn').addEventListener('click', () => {
    controls.reset();
});

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
