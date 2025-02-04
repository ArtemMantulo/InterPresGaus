import * as GaussianSplats3D from "../gaussian-splats-3d.module.js"


const viewer = new GaussianSplats3D.Viewer({
    'cameraUp': [0, -1, 0],
    'initialCameraPosition': [ 2.042969746283587, 4.7470375733382544, 2.9667169128794133],
    'inMemoryCompressionLevel': 1,
    'renderMode': GaussianSplats3D.RenderMode.OnChange,
    'sceneRevealMode': GaussianSplats3D.SceneRevealMode.Gradual,
    'splatSortDistanceMapPrecision': 16,
    'sceneFadeInRateMultiplier': 20,
    'dynamicScene': false,
    // 'initialCameraLookAt': [	1.03942, 3.57931, -4.03766],
    'initialCameraLookAt': [  -2.39246, 2.65146, -0.82320],
    'sharedMemoryForWorkers': false
});

viewer.addSplatScene('../assets/Breig_final.ksplat', {
    'splatAlphaRemovalThreshold': 15,
    'showLoadingUI': true,
    'progressiveLoad': true,
    'position': [0, 1, 0],
    'rotation': [0, 0, 0, 1],
    'scale': [1.5, 1.5, 1.5]
})
.then(() => {
  viewer.start();

  setTimeout(() => {
    console.log("Camera Position:", viewer.camera.position);
    console.log("Camera Target:", viewer.camera.target);
}, 5000); 

  // Access the camera controls (if available)
  const controls = viewer.controls; // Hypothetical property to access controls
  if (controls) {
    controls.minDistance = 3; // Set minimum zoom distance
    controls.maxDistance = 6; // Set maximum zoom distance

    // Optionally, limit vertical camera angles
    controls.minPolarAngle = Math.PI / 4; // Minimum angle (45 degrees above horizon)
    controls.maxPolarAngle = Math.PI / 2.2; // Maximum angle (directly above the object)
  } else {
    console.warn(
      "Camera controls are not directly accessible. Check Viewer API."
    );
  }

  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.0;

  // Запускаем анимацию перехода от точек к сплатам
  //viewer.animatePointCloudToSplats();
})
.catch(error => {
    console.error("Ошибка при загрузке сцены:", error);
});
