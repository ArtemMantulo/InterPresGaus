// @ts-ignore
import * as GaussianSplats3D from "./mkkellogg/gaussian-splats-3d/build/gaussian-splats-3d.module.js";
// @ts-ignore
import * as THREE from "three";

export const renderer = (url: string) => {
    // НАЧАЛО БЕЗОПАСНОЙ ЗОНЫ

    const threeScene = new THREE.Scene();

    // Добавляем освещение в сцену
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    threeScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    threeScene.add(directionalLight);

    // Создаем инстанс Viewer с параметрами камеры
    const viewer = new GaussianSplats3D.Viewer({
        threeScene,
        sharedMemoryForWorkers: false,
        splatSortDistanceMapPrecision: 16,
        cameraUp: [0, -1, 0],
        initialCameraPosition: [5.39342, 0.66359, -0.53531],
        initialCameraLookAt: [0.88732, 2.80143, -0.64037],
        sceneFadeInRateMultiplier: 20,
        inMemoryCompressionLevel': 1,
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
