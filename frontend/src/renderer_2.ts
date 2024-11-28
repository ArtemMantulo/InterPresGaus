// @ts-ignore
import * as GaussianSplats3D from "./mkkellogg/gaussian-splats-3d/build/gaussian-splats-3d.module.js";
// @ts-ignore
import * as THREE from "three";

export const renderer = (url: string) => {
    // НАЧАЛО БЕЗОПАСНОЙ ЗОНЫ

    // Создаем инстанс Viewer с параметрами камеры
    const viewer = new GaussianSplats3D.Viewer({
    'cameraUp': [0, -1, 0],
    'initialCameraPosition': [5.21449, 1.15657, -1.18348],
    'inMemoryCompressionLevel': 1,
    'renderMode': GaussianSplats3D.RenderMode.OnChange,
    'sceneRevealMode': GaussianSplats3D.SceneRevealMode.Gradual,
    'splatSortDistanceMapPrecision': 16,
    'sceneFadeInRateMultiplier': 20,
    'dynamicScene': false,
    'initialCameraLookAt': [	1.03942, 3.57931, -1.03766]
    });
    // Загружаем сцену
    viewer
        .addSplatScene(url, {
            showLoadingUI: true,
            progressiveLoad: true,
            position: [0, 1, 0],
            rotation: [0, 0, 0, 1],
            scale: [1.0, 1.0, 1.0],
        })
        .then(() => {
            viewer.start();
        })
        .catch((error: any) => {
            console.error("Ошибка загрузки сцены:", error);
        });

    // Обновляем сцены в цикле рендеринга
    viewer.renderer.setAnimationLoop(() => {
        viewer.update();
    });

    // КОНЕЦ БЕЗОПАСНОЙ ЗОНЫ
};
