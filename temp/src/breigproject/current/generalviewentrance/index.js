import * as GaussianSplats3D from "../../../gaussian-splats-3d.module.js";
import Paths from '../../../urls.js';
import { createLoadingImage, createStartButton, BLACK_BUTTON_COLORS, GREY_BUTTON_COLORS, createCustomLoader, createNavigationButton } from '../../../helpers/button_helper.ts';

// ✅ Create initial picture
const initialPicture = createLoadingImage('/assets/Initial_picture.webp');
// ✅ Create second image (used to trigger scene loading)
const secondImage = createStartButton('/assets/start_button.png');
secondImage.style.display = 'none';

const { loaderContainer, loaderBar } = createCustomLoader();

let isSceneLoaded = false;
let buttonsCreated = false;

const loadScene = () => {
  if (isSceneLoaded) return;
  isSceneLoaded = true;

  console.log('Starting scene load...');

  // ✅ Hide second image when loading starts
  secondImage.style.display = 'none';

  const viewer = new GaussianSplats3D.Viewer({
    cameraUp: [0, -1, 0],
    'initialCameraPosition': [2.29149, -2.45657, -9.16148],
    'initialCameraLookAt': [3.01607, -0.97057, -5.02296],
    'inMemoryCompressionLevel': 1,
    'renderMode': GaussianSplats3D.RenderMode.Continuous,
    'sceneRevealMode': GaussianSplats3D.SceneRevealMode.Gradual,
    'splatSortDistanceMapPrecision': 16,
    'sceneFadeInRateMultiplier': 20,
    'dynamicScene': false,
    'sharedMemoryForWorkers': false,
    showLoadingUI: false,
  });

  viewer.addSplatScene('/assets/Breig_current.ksplat', {
    splatAlphaRemovalThreshold: 15,
    progressiveLoad: true,
    showLoadingUI: false,
    position: [0, 1, 0],
    rotation: [0, 0, 0, 1],
    scale: [1.5, 1.5, 1.5],
    onProgress: (progress) => {
      console.log(`Loading progress: ${progress.toFixed(2)}%`);

      // ✅ Update loader bar width correctly
      loaderBar.style.width = `${Math.min(progress, 100)}%`;

      // ✅ Remove initial picture after 25% progress
      if (progress > 40 && initialPicture.style.opacity !== '0') {
        console.log('Progress > 25% → Fading out initial picture');

        initialPicture.style.transition = 'opacity 0.4s ease';
        initialPicture.style.opacity = '0';

        setTimeout(() => {
          initialPicture.remove();

          // ✅ Show buttons ONLY AFTER initial picture disappears
          if (!buttonsCreated) {
            buttonsCreated = true;

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
                buttonContainer.style.left = '50%';
              } else {
                // Если ширина больше 768px, возвращаем на 48%
                buttonContainer.style.left = '50%';
              }
            };
            
            // ✅ Первоначальный вызов для установки позиции
            updateButtonPosition();
            
            // ✅ Добавляем слушатель для отслеживания изменений размера экрана
            mediaQuery.addEventListener('change', updateButtonPosition);

            console.log('Container:', BLACK_BUTTON_COLORS.backgroundColor);
            console.log('Type of container:', typeof buttonContainer);

            createNavigationButton(buttonContainer,"Current", true, BLACK_BUTTON_COLORS);
            createNavigationButton(buttonContainer,"Future", false, GREY_BUTTON_COLORS, Paths.futureProjectHtmlPath);
          }
        }, 400); // ✅ Ensure fade-out completes before removing
      }

      // ✅ Remove loader after loading completes
      if (progress >= 100) {
        console.log('Progress = 100% → Removing loader');

        loaderContainer.style.transition = 'opacity 0.3s ease';
        loaderContainer.style.opacity = '0';

        setTimeout(() => loaderContainer.remove(), 300);
      }
    },
  }).then(() => {

    viewer.start();

    const camera = viewer.camera;
    const controls = viewer.controls;
    if (controls) {
      controls.minDistance = 2;
      controls.maxDistance = 12;
      controls.minPolarAngle = Math.PI / 10;
      controls.maxPolarAngle = Math.PI / 2.5;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.2;
    }
  }).catch(error => {
    console.error("Error loading scene:", error);
  });
};

// ✅ Handle secondImage click to start loading
secondImage.addEventListener('click', loadScene);
