// @ts-ignore
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
// @ts-ignore
import * as THREE from "three";

export const renderer = (url: string) => {
    // НАЧАЛО БЕЗОПАСНОЙ ЗОНЫ

    // Устанавливаем размеры рендера напрямую
    const renderWidth = window.innerWidth; // Автоматический размер по ширине окна
    const renderHeight = window.innerHeight; // Автоматический размер по высоте окна

    // Рендер для 3D сцены
    const renderer3D = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    renderer3D.setSize(renderWidth, renderHeight);
    renderer3D.setClearColor(0x000000, 0); //
    document.body.appendChild(renderer3D.domElement); //

    // Создаем основную сцену для 3D объектов
    const threeScene = new THREE.Scene();

    // Инициализация Viewer
    const viewer = new GaussianSplats3D.Viewer({
        sharedMemoryForWorkers: false, // этот параметр лучше не трогать, упадет отображенеи фреймов через вставку на другие страницы
        sceneFadeInRateMultiplier: 10,
        threeScene: threeScene,
        renderer: renderer3D,
        renderMode: GaussianSplats3D.RenderMode.OnChange,

        camera: new THREE.PerspectiveCamera(
            65,
            renderWidth / renderHeight,
            0.1,
            500,
        ),
        //useBuiltInControls: false,  // Не используем встроенные контролы
    });

    const camera = viewer.camera;
    camera.position.set(-1, -4, 6);
    camera.up.set(0, -1, 0).normalize();
    camera.lookAt(new THREE.Vector3(0, 4, 0));



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
