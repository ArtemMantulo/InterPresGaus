export function loadSplatScene(viewer) {
    return viewer.addSplatScene('../assets/Breig_future.ksplat', {
      splatAlphaRemovalThreshold: 15,
      showLoadingUI: true,
      progressiveLoad: true,
      position: [0, 1, 0],
      rotation: [0, 0, 0, 1],
      scale: [1.5, 1.5, 1.5]
    }).then(() => {
      viewer.start();
  
      const controls = viewer.controls;
      if (controls) {
        controls.minDistance = 1;
        controls.maxDistance = 9;
        controls.minPolarAngle = Math.PI / 20;
        controls.maxPolarAngle = Math.PI / 2.3;
        controls.autoRotate = false;
        controls.autoRotateSpeed = 0.2;
      }
    });
  }
  