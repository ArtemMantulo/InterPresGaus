import * as GaussianSplats3D from '../gaussian-splats-3d.module.js';
import * as THREE from 'three';
import {initializePins} from '../utils/pinManager.js';


// ===== SCENE SETUP =====
const threeScene = new THREE.Scene();
const lookAt = new THREE.Vector3(1.48304, -0.85783, -5.5530717);

// ===== HORIZONTALLY ALIGNED SEGMENTS =====
const floorCount = 12;
const floorHeight = 0.14;
const floorWidth = 0.11;
const floorDepth = 0.4;
const spacing = 0.0135;

const buildingGroup = new THREE.Group();

for (let i = 0; i < floorCount; i++) {
  const geometry = new THREE.BoxGeometry(floorWidth, floorHeight, floorDepth);
  const hue = (i / floorCount) * 360;
  const color = new THREE.Color(`hsl(${hue}, 70%, 60%)`);

  const material = new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity: 1,
    emissive: new THREE.Color(0x000000),
    emissiveIntensity: 1,
    depthWrite: false,
    colorWrite: false
  });

  const mesh = new THREE.Mesh(geometry, material);

  const totalLength = floorCount * (floorWidth + spacing);
  const offsetX = -totalLength / 2 + i * (floorWidth + spacing) + floorWidth / 2;

  mesh.position.set(lookAt.x + offsetX, lookAt.y, lookAt.z);
  mesh.userData.floorNumber = i + 1;

  buildingGroup.add(mesh);
}

buildingGroup.rotation.y = THREE.MathUtils.degToRad(-13);
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
  threeScene,
  cameraUp: [0, -1, 0],
  initialCameraPosition: [-2.83355, -3.39966, -4.55430],
  initialCameraLookAt: [2.88504, -0.80033, -4.34717],
  inMemoryCompressionLevel: 1,
  renderMode: GaussianSplats3D.RenderMode.OnChange,
  sceneRevealMode: GaussianSplats3D.SceneRevealMode.Gradual,
  splatSortDistanceMapPrecision: 16,
  sceneFadeInRateMultiplier: 20,
  dynamicScene: false,
  sharedMemoryForWorkers: false,
  renderMode: GaussianSplats3D.RenderMode.Always, 
});

// ===== LOAD SCENE & INTERACTION =====
viewer.addSplatScene('../assets/Breig_future.ksplat', {
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

      label.innerText = `${floor.userData.floorNumber} block`;
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

  const pinData = [
    { label: 'Parking', icon: '../assets/Pin.png', position: new THREE.Vector3(1.13333, -0.95538, -4.75120) },
    { label: 'Pool', icon: '../assets/pool.png', position: new THREE.Vector3(2.32044, -1.02103, -4.15728) },
    { label: 'Gym', icon: '../assets/gym_icon.png', position: new THREE.Vector3(	2.67868, -1.10441, -6.7061) },
    { label: 'Lounge Area by the Pool', icon: '../assets/lounge_area_pool.png', position: new THREE.Vector3(	2.65646, -0.98472, -5.70358) },
    { label: 'Children Playground', icon: '../assets/children_playground.png', position: new THREE.Vector3(		4.08201, -0.99597, -4.11901) },
  ];
  
  initializePins(pinData, camera, renderer, controls)
  


  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('click', onClick);
}).catch(console.error);


const mousePosition = viewer.disableMouse()

//setTimeout(viewer.enebleMouse(mousePosition), 10000)
//viewer.enebleMouse(mousePosition)