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
        antialias: false,
        alpha: true,
    });
    renderer3D.setSize(renderWidth, renderHeight);
    renderer3D.setClearColor(0x000000, 1); //
    document.body.appendChild(renderer3D.domElement); //

    // Создаем основную сцену для 3D объектов
    const threeScene = new THREE.Scene();

    // Инициализация Viewer
    const viewer = new GaussianSplats3D.Viewer({
        sharedMemoryForWorkers: false, // этот параметр лучше не трогать, упадет отображенеи фреймов через вставку на другие страницы
        sceneFadeInRateMultiplier: 10,
        threeScene: threeScene,
        renderer: renderer3D,
        splatSortDistanceMapPrecision: 32,
        inMemoryCompressionLevel: 1,
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

    // Создаем первый куб - белый, меньшего размера, с регулируемой позицией
    const smallCubeGeometry = new THREE.BoxGeometry(4.4, 1.8, 0.3); // Размеры 0.5 x 0.5 x 0.5
    const whiteMaterial = new THREE.MeshBasicMaterial({
        color: "#e1dcdb",
    }); // Белый цвет
    const smallCube = new THREE.Mesh(smallCubeGeometry, whiteMaterial);
    smallCube.position.set(-0.1, -0.75, -1.93); // Позиция
    threeScene.add(smallCube); // Добавляем в threeScene

    // Создаем второй куб
    const largeCubeGeometry = new THREE.BoxGeometry(4.4, 0.3, 2.2);
    const largeCube = new THREE.Mesh(largeCubeGeometry, whiteMaterial);
    largeCube.position.set(-0.1, 0, -0.76); // Позиция в центре
    threeScene.add(largeCube); // Добавляем в threeScene

    // Загружаем внешний файл и добавляем его в Viewer
    viewer
        .addSplatScene(
            url /* из места вызова функции прокидывается ссылка из БД */,
            {
                progressiveLoad: true,
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
