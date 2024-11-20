// @ts-ignore
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
// @ts-ignore
import * as THREE from "three";

export const renderer = (url: string) => {
    // НАЧАЛО БЕЗОПАСНОЙ ЗОНЫ
    // Создаем новую сцену Three.js
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
    cameraUp: [0, -1, 0],
    initialCameraPosition: [-2, -2, 4],
    initialCameraLookAt: [0, 1.65, 0]
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
