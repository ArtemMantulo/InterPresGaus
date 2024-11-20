// @ts-ignore
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
// @ts-ignore
import * as THREE from "three";

export const renderer = (url: string) => {
    // НАЧАЛО БЕЗОПАСНОЙ ЗОНЫ

 // Создаем основную сцену для 3D объектов
    const threeScene = new THREE.Scene();

    // Инициализация Viewer
    const viewer = new GaussianSplats3D.Viewer({
        sharedMemoryForWorkers: false, // этот параметр лучше не трогать, упадет отображенеи фреймов через вставку на другие страницы
        sceneFadeInRateMultiplier: 10,
        threeScene: threeScene,
        renderer: renderer3D,
        renderMode: GaussianSplats3D.RenderMode.OnChange,

        //useBuiltInControls: false,  // Не используем встроенные контролы
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

    // Анимация сцены
    function animate() {
        requestAnimationFrame(() => setTimeout(animate, 1000 / 60)); // Ограничение FPS до 60

        viewer.update();
        viewer.render();
    }

    animate();

    // КОНЕЦ БЕЗОПАСНОЙ ЗОНЫ
};
