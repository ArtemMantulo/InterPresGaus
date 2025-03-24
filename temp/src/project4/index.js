import * as GaussianSplats3D from "../gaussian-splats-3d.module.js"
//import Paths from '../../../urls.js';
//import { createGoToPreviousPageButton, createRedirectButton } from '../../../helpers/button_helper.ts';


const viewer = new GaussianSplats3D.Viewer({
    'cameraUp': [0, -1, 0],
    'initialCameraPosition': [0.71449, 2.15657, 3.88348],
    'inMemoryCompressionLevel': 1,
    'renderMode': GaussianSplats3D.RenderMode.OnChange,
    'sceneRevealMode': GaussianSplats3D.SceneRevealMode.Gradual,
    'splatSortDistanceMapPrecision': 16,
    'sceneFadeInRateMultiplier': 20,
    'dynamicScene': false,
    'initialCameraLookAt': [-2.73942, 0.67931, -1.33766],
    'sharedMemoryForWorkers': false
});

viewer.addSplatScene('/assets/atrium2crop.ksplat', {
    'splatAlphaRemovalThreshold': 15,
    'showLoadingUI': true,
    'progressiveLoad': true,
    'position': [0, 1, 0],
    'rotation': [0, 0, 0, 1],
    'scale': [1.5, 1.5, 1.5]
})
.then(() => {

viewer.start();
//const camera = viewer.camera; // Ensure this is accessible

  // Access the camera controls (if available)
  const controls = viewer.controls; // Hypothetical property to access controls
  if (controls) {
    controls.minDistance = 4; // Set minimum zoom distance
    controls.maxDistance = 9; // Set maximum zoom distance

    // Optionally, limit vertical camera angles
    controls.minPolarAngle = Math.PI / 6; // Minimum angle (45 degrees above horizon)
    controls.maxPolarAngle = Math.PI / 2.7; // Maximum angle (directly above the object)
  } else {
    console.warn(
      "Camera controls are not directly accessible. Check Viewer API."
    );
  }

  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.2;

  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.flexDirection = 'column';
  buttonContainer.style.gap = '10px';
  buttonContainer.style.position = 'absolute';
  buttonContainer.style.top = '35%';
  buttonContainer.style.left = '10px';
  buttonContainer.style.zIndex = '1000';
  document.body.appendChild(buttonContainer);

  //createRedirectButton('Future project view', Paths.futureProjectHtmlPath, buttonContainer);
  //createRedirectButton('General view', Paths.currentProjectSecondVisitHtmlPath, buttonContainer);

  // Запускаем анимацию перехода от точек к сплатам
  //viewer.animatePointCloudToSplats();
})
.catch(error => {
    console.error("Ошибка при загрузке сцены:", error);
});
