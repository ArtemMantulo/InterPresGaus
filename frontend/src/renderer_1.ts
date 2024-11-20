// @ts-ignore
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
// @ts-ignore
import * as THREE from "three";

export const renderer = (url: string) => {
    // НАЧАЛО БЕЗОПАСНОЙ ЗОНЫ

    const viewer = new GaussianSplats3D.Viewer({
         sharedMemoryForWorkers: false,
        cameraUp: [0, 1, 0], // Убедитесь, что направление камеры корректно
        initialCameraPosition: [1, 0, -3],
        inMemoryCompressionLevel: 1,
        renderMode: GaussianSplats3D.RenderMode.OnChange,
        sceneRevealMode: GaussianSplats3D.SceneRevealMode.Gradual,
        sceneFadeInRateMultiplier: 20,
        initialCameraLookAt: [0, 1, 0],
    });

    viewer
        .addSplatScene(url, {
            progressiveLoad: true,
            showLoadingUI: false,
        })
        .then(() => {
            viewer.start();

            // Запускаем цикл анимации
            animate();
        })
        .catch((error) => {
            console.error("Ошибка при загрузке сцены:", error);
        });

    // Цикл анимации
    function animate() {
        requestAnimationFrame(animate);
        viewer.update(); // Обновляет Viewer
    }
};


    // КОНЕЦ БЕЗОПАСНОЙ ЗОНЫ
};
