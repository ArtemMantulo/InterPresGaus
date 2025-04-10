import * as GaussianSplats3D from '../gaussian-splats-3d.module.js';

export function initViewer(threeScene) {
  const viewer = new GaussianSplats3D.Viewer({
    threeScene,
    cameraUp: [0, -1, 0],
    initialCameraPosition: [-2.83355, -3.39966, -4.55430],
    initialCameraLookAt: [2.88504, -0.80033, -4.34717],
    inMemoryCompressionLevel: 1,
    renderMode: GaussianSplats3D.RenderMode.OnChange,
    sceneRevealMode: GaussianSplats3D.SceneRevealMode.Gradual,
    splatSortDistanceMapPrecision: 16,
    sceneFadeInRateMultiplier: 20,
    dynamicScene: false,
    sharedMemoryForWorkers: false
  });

  return viewer;
}