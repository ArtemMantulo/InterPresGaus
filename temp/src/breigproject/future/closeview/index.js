import * as GaussianSplats3D from "../../../gaussian-splats-3d.module.js"
import Paths from '../../../urls.js';
import {  createNavigationButton, createCustomLoader, createZoomButton, GREY_BUTTON_COLORS, BLACK_BUTTON_COLORS } from '../../../helpers/button_helper.ts';

const { loaderContainer, loaderBar } = createCustomLoader(); 

const viewer = new GaussianSplats3D.Viewer({
    'cameraUp': [0, -1, 0],
    'initialCameraPosition': [1.71449, 0.35657, 5.08348],
    'initialCameraLookAt': [	0.37942, 2.67931, 0.03766],
    'inMemoryCompressionLevel': 1,
    'renderMode': GaussianSplats3D.RenderMode.OnChange,
    'sceneRevealMode': GaussianSplats3D.SceneRevealMode.Gradual,
    'splatSortDistanceMapPrecision': 16,
    'sceneFadeInRateMultiplier': 20,
    'dynamicScene': false,
    'sharedMemoryForWorkers': false
});

viewer.addSplatScene('/assets/Breig_future_close.ksplat', {
    'splatAlphaRemovalThreshold': 15,
    'showLoadingUI': true,
    'progressiveLoad': true,
    'position': [0, 1, 0],
    'rotation': [0, 0, 0, 1],
    'scale': [1.5, 1.5, 1.5],
    showLoadingUI: false,
    onProgress: (progress) => {
      console.log(`Loading progress: ${progress.toFixed(2)}%`);

      // ✅ Update loader bar width correctly
      loaderBar.style.width = `${Math.min(progress, 100)}%`;

      // ✅ Remove loader after loading completes
      if (progress >= 100) {
        console.log('Progress = 100% → Removing loader');

        loaderContainer.style.transition = 'opacity 0.3s ease';
        loaderContainer.style.opacity = '0';

        setTimeout(() => loaderContainer.remove(), 300);
      }
    },
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
            buttonContainer.style.padding = '4px';
            buttonContainer.style.alignItems = 'center';
            buttonContainer.style.gap = '2px';
            
            buttonContainer.style.position = 'absolute';
            buttonContainer.style.bottom = '32px';
            buttonContainer.style.left = '48%';
            buttonContainer.style.transform = 'translateX(-50%)';
            buttonContainer.style.zIndex = '1000';
            
            buttonContainer.style.width = '180px';
            buttonContainer.style.height = '32px';
            
            buttonContainer.style.backgroundColor = '#EAEAEA';
            buttonContainer.style.borderRadius = '40px';
            buttonContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            
            document.body.appendChild(buttonContainer);
            
            // 🖥️ Добавляем слушатель для изменений ширины экрана
            const mediaQuery = window.matchMedia('(max-width: 768px)');
            
            const updateButtonPosition = () => {
              if (mediaQuery.matches) {
                // Если ширина меньше 768px, фиксируем позицию на 46%
                buttonContainer.style.left = '44%';
              } else {
                // Если ширина больше 768px, возвращаем на 48%
                buttonContainer.style.left = '48%';
              }
            };
            
            // ✅ Первоначальный вызов для установки позиции
            updateButtonPosition();
            
            // ✅ Добавляем слушатель для отслеживания изменений размера экрана
            mediaQuery.addEventListener('change', updateButtonPosition);

  createNavigationButton(buttonContainer, "Current", false, GREY_BUTTON_COLORS, Paths.currentProjectSecondVisitHtmlPath);
  createNavigationButton(buttonContainer, "Future", true, BLACK_BUTTON_COLORS);
  createZoomButton(buttonContainer, 'zoom-out', GREY_BUTTON_COLORS, Paths.futureProjectHtmlPath);

  // Запускаем анимацию перехода от точек к сплатам
  //viewer.animatePointCloudToSplats();
})
.catch(error => {
    console.error("Ошибка при загрузке сцены:", error);
});
