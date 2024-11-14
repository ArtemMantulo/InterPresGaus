import React, { ReactElement, useEffect } from "react";
import { useDispatch } from "@/shared/store/store";
import { useSelector } from "react-redux";
import { getFrame } from "@/shared/store/slices/frame/thunks";
import { selectFrame } from "@/shared/store/slices/frame";
// @ts-ignore
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
// @ts-ignore
import * as THREE from "three";
import { useParams } from "next/navigation";

const Frames = (): ReactElement => {
    const dispatch = useDispatch();
    const frame = useSelector(selectFrame);
    const params = useParams();

    useEffect(() => {
        if (params?.id) {
            dispatch(getFrame(params.id as string));
        }
    }, [params]);

    useEffect(() => {
        if (frame?.url) {
            const renderWidth = window.innerWidth;
            const renderHeight = window.innerHeight;
            const renderer3D = new THREE.WebGLRenderer({
                antialias: false,
                alpha: true,
            });
            renderer3D.setSize(renderWidth, renderHeight);
            renderer3D.setClearColor(0x000000, 1); //
            document.body.appendChild(renderer3D.domElement); //

            const threeScene = new THREE.Scene();

            const viewer = new GaussianSplats3D.Viewer({
                sharedMemoryForWorkers: false,
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
            });

            const camera = viewer.camera;
            camera.position.set(-1, -4, 6);
            camera.up.set(0, -1, 0).normalize();
            camera.lookAt(new THREE.Vector3(0, 4, 0));

            const smallCubeGeometry = new THREE.BoxGeometry(4.4, 1.8, 0.3);
            const whiteMaterial = new THREE.MeshBasicMaterial({
                color: "#e1dcdb",
            });
            const smallCube = new THREE.Mesh(smallCubeGeometry, whiteMaterial);
            smallCube.position.set(-0.1, -0.75, -1.93);
            threeScene.add(smallCube);
            const largeCubeGeometry = new THREE.BoxGeometry(4.4, 0.3, 2.2);
            const largeCube = new THREE.Mesh(largeCubeGeometry, whiteMaterial);
            largeCube.position.set(-0.1, 0, -0.76);
            threeScene.add(largeCube);

            const animate = () => {
                requestAnimationFrame(() => setTimeout(animate, 1000 / 30)); // Ограничение FPS до 30
                viewer.update();
                viewer.render();
            };

            viewer
                .addSplatScene(
                    "https://huggingface.co/spaces/Vision70s/GaussianVision70s/resolve/main/roomCropMaxCleaned.ply",
                    {
                        progressiveLoad: true,
                    },
                )
                .then(() => {
                    animate();
                });

            animate();
            // const threeScene = new THREE.Scene();

            // // Добавляем освещение в сцену
            // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            // threeScene.add(ambientLight);

            // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            // directionalLight.position.set(5, 10, 7.5);
            // threeScene.add(directionalLight);
            // const config = frame.config
            //     ? JSON.parse(frame.config)
            //     : {
            //           sharedMemoryForWorkers: false,
            //           cameraUp: [0, -1, 0],
            //           initialCameraPosition: [-2, -2, 4],
            //           initialCameraLookAt: [0, 1.65, 0],
            //       };

            // const config2 = frame.config_viewer
            //     ? JSON.parse(frame.config_viewer)
            //     : {
            //           showLoadingUI: true,
            //           progressiveLoad: true,
            //           position: [0, 1, 0],
            //           rotation: [0, 0, 0, 1],
            //           scale: [1.0, 1.0, 1.0],
            //       };

            // const viewer = new Viewer({
            //     threeScene,
            //     ...config,
            // });
            // // Загружаем сцену
            // viewer
            //     .addSplatScene(frame.url, { ...config2 })
            //     .then(() => {
            //         viewer.start();
            //     })
            //     .catch((error: any) => {
            //         console.error("Ошибка загрузки сцены:", error);
            //     });

            // // Обновляем сцены в цикле рендеринга
            // viewer.renderer.setAnimationLoop(() => {
            //     viewer.update();
            // });

            // return () => {
            //     viewer.dispose();
            // };
        }
    }, [frame]);

    return <div></div>;
};

export default Frames;
