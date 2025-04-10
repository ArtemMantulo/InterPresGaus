import * as GaussianSplats3D from "../gaussian-splats-3d.module.js";

import * as THREE from 'three';

const threeScene = new THREE.Scene();
// Create DropInViewer instance

// Initialize the existing viewer as usual
const viewer = new GaussianSplats3D.Viewer({
    'cameraUp': [0, -1, 0],
    'initialCameraPosition': [4.81449, 2.15657, -2.88348],
    'initialCameraLookAt': [1.30379, 3.66157, -0.98232],
    'inMemoryCompressionLevel': 1,
    'renderMode': GaussianSplats3D.RenderMode.OnChange,
    'sceneRevealMode': GaussianSplats3D.SceneRevealMode.Gradual,
    'splatSortDistanceMapPrecision': 16,
    'sceneFadeInRateMultiplier': 20,
    'dynamicScene': false,
    'sharedMemoryForWorkers': false
});

// Adding the splat scene to the viewer
viewer.addSplatScene('/assets/GIGA_MAG32.ksplat', {
    'splatAlphaRemovalThreshold': 15,
    'showLoadingUI': true,
    'progressiveLoad': true,
    'position': [0, 1, 0],
    'rotation': [0, 0, 0, 1],
    'scale': [1.5, 1.5, 1.5]
})
.then(() => {
    viewer.start();
    //threeScene.add(viewer);

    // Optional: Add camera controls
    const controls = viewer.controls;
    if (controls) {
        controls.minDistance = 3;
        controls.maxDistance = 9;
        controls.minPolarAngle = Math.PI / 6;
        controls.maxPolarAngle = Math.PI / 2.7;
    }

    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2;

    // Run the animation
    //viewer.animatePointCloudToSplats();
})
.catch(error => {
    console.error("Ошибка при загрузке сцены:", error);
});