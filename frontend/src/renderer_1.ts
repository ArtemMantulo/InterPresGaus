// @ts-ignore
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
// @ts-ignore
import * as THREE from "three";

export const renderer = (url: string) => {
    // НАЧАЛО БЕЗОПАСНОЙ ЗОНЫ

    const viewer = new GaussianSplats3D.Viewer({
    'cameraUp': [0, -5, 0],
    'initialCameraPosition': [1, 0, -3],
    'inMemoryCompressionLevel': 1,
    'renderMode': GaussianSplats3D.RenderMode.OnChange,
    'sceneRevealMode': GaussianSplats3D.SceneRevealMode.Gradual,
    'splatSortDistanceMapPrecision': 32,
    'sceneFadeInRateMultiplier': 20,
    'initialCameraLookAt': [0, 1, 0]
});
   // Загружаем внешний файл и добавляем его в Viewer
    viewer
        .addSplatScene(
            url /* из места вызова функции прокидывается ссылка из БД */,
            {
                progressiveLoad: true,
                showLoadingUI: false,
            },
        )
        .then(() => {
            animate();
        });

.then(() => {
    viewer.start();
})
.catch(error => {
    console.error("Ошибка при загрузке сцены:", error);
});


    // КОНЕЦ БЕЗОПАСНОЙ ЗОНЫ
};
