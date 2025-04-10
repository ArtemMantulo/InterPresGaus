import * as GaussianSplats3D from "../gaussian-splats-3d.module.js";
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Создание сцены Three.js
const threeScene = new THREE.Scene();

// Инициализация DropInViewer
const viewer = new GaussianSplats3D.DropInViewer({
    'cameraUp': [0, 1, 0], // Ось Y направлена вверх
    'initialCameraPosition': [4.81449, 2.15657, -2.88348],
    'initialCameraLookAt': [1.30379, 3.66157, -0.98232],
    'splatSortDistanceMapPrecision': 16,
    'sceneFadeInRateMultiplier': 20,
    'dynamicScene': false,
    'sharedMemoryForWorkers': false
});

// Добавление сплат-сцены
viewer.addSplatScene('../assets/GIGA_MAG32.ksplat', {
    'splatAlphaRemovalThreshold': 15,
    'showLoadingUI': true,
    'progressiveLoad': true,
    'position': [0, 1, 0], // Центрируем сцену
    'rotation': [0, 1, 0, 0], // Возможный поворот
    'scale': [1.5, 1.5, 1.5]
})
.then(() => {
    // Добавляем viewer в Three.js сцену
    threeScene.add(viewer);

    // Настраиваем WebGL рендерер
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Настраиваем камеру
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(4, 1, 5);

    // Добавляем освещение
    const light = new THREE.AmbientLight(0xffffff, 1);
    threeScene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    threeScene.add(directionalLight);

    // Добавляем OrbitControls для управления камерой
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 3;
    controls.maxDistance = 9;
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = Math.PI / 2.7;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2;

    // Анимационный цикл
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(threeScene, camera);
    }

    // Запускаем анимацию
    animate();
})
.catch(error => {
    console.error("Error loading splat scene:", error);
});