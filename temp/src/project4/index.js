import * as GaussianSplats3D from '../gaussian-splats-3d.module.js';
import * as THREE from 'three';

// ===== SCENE SETUP =====
const threeScene = new THREE.Scene();
const lookAt = new THREE.Vector3(-0.02201, 2.55283, 0.34280);

// ===== 21-FLOOR SEGMENTED BUILDING =====
const floorCount = 21;
const floorHeight = 0.09;
const buildingGroup = new THREE.Group();

for (let i = 0; i < floorCount; i++) {
  const geometry = new THREE.BoxGeometry(0.45, floorHeight, 0.45);
  const hue = (i / floorCount) * 360;
  const color = new THREE.Color(`hsl(${hue}, 70%, 60%)`);
  const material = new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    colorWrite: false
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(lookAt.x, lookAt.y + i * floorHeight, lookAt.z);
  mesh.userData.floorNumber = floorCount - i;
  buildingGroup.add(mesh);
}

buildingGroup.rotation.y = THREE.MathUtils.degToRad(-22);
threeScene.add(buildingGroup);

// ===== MARKER =====
const marker = new THREE.Mesh(
  new THREE.SphereGeometry(0.05, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
marker.position.copy(lookAt);
threeScene.add(marker);

// ===== LIGHTING =====
threeScene.add(new THREE.AmbientLight(0xffffff, 0.4));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 5);
threeScene.add(dirLight);

// ===== LABEL (hover info) =====
const label = document.createElement('div');
label.style.position = 'absolute';
label.style.padding = '4px 8px';
label.style.background = 'rgba(0,0,0,0.7)';
label.style.color = 'white';
label.style.borderRadius = '4px';
label.style.fontSize = '14px';
label.style.pointerEvents = 'none';
label.style.display = 'none';
label.style.zIndex = '1000';
document.body.appendChild(label);

// ===== INFO PANEL (click) =====
const infoPanel = document.createElement('div');
infoPanel.style.position = 'absolute';
infoPanel.style.top = '20px';
infoPanel.style.right = '20px';
infoPanel.style.width = '180px';
infoPanel.style.borderRadius = '12px';
infoPanel.style.overflow = 'hidden';
infoPanel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
infoPanel.style.display = 'none';
infoPanel.style.zIndex = '1001';
infoPanel.style.fontFamily = 'sans-serif';
infoPanel.style.background = 'transparent';

const photoSection = document.createElement('div');
photoSection.style.height = '120px';
photoSection.style.backgroundImage = 'url(https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80)';
photoSection.style.backgroundSize = 'cover';
photoSection.style.backgroundPosition = 'center';

const textSection = document.createElement('div');
textSection.style.background = 'rgba(0, 0, 0, 0.65)';
textSection.style.color = 'white';
textSection.style.padding = '12px';
textSection.style.fontSize = '14px';
textSection.style.lineHeight = '1.4';

infoPanel.appendChild(photoSection);
infoPanel.appendChild(textSection);
document.body.appendChild(infoPanel);

// ===== VIEWER SETUP =====
const viewer = new GaussianSplats3D.Viewer({
  cameraUp: [0, -1, 0],
  initialCameraPosition: [-3.37861, -1.94630, 4.32924],
  initialCameraLookAt: [-2.30434, 0.23717, -0.30859],
  inMemoryCompressionLevel: 1,
  renderMode: GaussianSplats3D.RenderMode.OnChange,
  sceneRevealMode: GaussianSplats3D.SceneRevealMode.Gradual,
  splatSortDistanceMapPrecision: 16,
  sceneFadeInRateMultiplier: 20,
  dynamicScene: false,
  sharedMemoryForWorkers: false
});

// ===== LOAD SCENE & INTERACTION =====
viewer.addSplatScene('/assets/atrium2crop.ksplat', {
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
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2;
  }

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const camera = viewer.camera;
  const renderer = viewer.renderer;

  let hoveredFloor = null;
  let selectedFloor = null;

  function onMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(buildingGroup.children);

    if (intersects.length > 0) {
      const floor = intersects[0].object;
      if (hoveredFloor && hoveredFloor !== selectedFloor) {
        hoveredFloor.material.opacity = 0;
        hoveredFloor.material.colorWrite = false;
        hoveredFloor.material.depthWrite = false;
      }

      if (floor !== selectedFloor) {
        floor.material.opacity = 0.6;
        floor.material.colorWrite = true;
        floor.material.depthWrite = true;
      }

      hoveredFloor = floor;

      const point = intersects[0].point.clone().project(camera);
      const x = (point.x * 0.5 + 0.5) * rect.width + rect.left;
      const y = (1 - (point.y * 0.5 + 0.5)) * rect.height + rect.top;

      label.innerText = `${floor.userData.floorNumber} floor`;
      label.style.left = `${x}px`;
      label.style.top = `${y - 20}px`;
      label.style.display = 'block';
    } else {
      if (hoveredFloor && hoveredFloor !== selectedFloor) {
        hoveredFloor.material.opacity = 0;
        hoveredFloor.material.colorWrite = false;
        hoveredFloor.material.depthWrite = false;
      }
      hoveredFloor = null;
      label.style.display = 'none';
    }
  }

  function onClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(buildingGroup.children);

    if (intersects.length > 0) {
      const clickedFloor = intersects[0].object;

      if (selectedFloor === clickedFloor) {
        selectedFloor.material.opacity = 0;
        selectedFloor.material.colorWrite = false;
        selectedFloor.material.depthWrite = false;
        selectedFloor = null;
        infoPanel.style.display = 'none';
        return;
      }

      if (selectedFloor) {
        selectedFloor.material.opacity = 0;
        selectedFloor.material.colorWrite = false;
        selectedFloor.material.depthWrite = false;
      }

      selectedFloor = clickedFloor;
      clickedFloor.material.opacity = 1;
      clickedFloor.material.colorWrite = true;
      clickedFloor.material.depthWrite = true;

      const floorNum = clickedFloor.userData.floorNumber;
      textSection.innerHTML = `
        <strong>Info for Floor ${floorNum}</strong><br>
        • Offices: ${floorNum * 2}<br>
        • People: ${floorNum * 5}<br>
        • Elevators: ${floorNum % 3 + 1}
      `;
      infoPanel.style.display = 'block';
    } else {
      if (selectedFloor) {
        selectedFloor.material.opacity = 0;
        selectedFloor.material.colorWrite = false;
        selectedFloor.material.depthWrite = false;
        selectedFloor = null;
      }
      infoPanel.style.display = 'none';
    }
  }

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('click', onClick);
}).catch(console.error);
