import * as GaussianSplats3D from '../gaussian-splats-3d.module.js';
import * as THREE from 'three';

// ===== DEBUGGING SETUP =====
const DEBUG = true;
function log(...args) {
  if (DEBUG) console.log('[DEBUG]', ...args);
}

// ===== SCENE SETUP =====
const threeScene = new THREE.Scene();
const lookAt = new THREE.Vector3(5.694504, -2.95283, 1.1030717);

// ===== HORIZONTALLY ALIGNED SEGMENTS =====
const floorCount = 8;
const floorHeight = 0.5;
const floorWidth = 0.45;
const spacing = 0.05;
const buildingGroup = new THREE.Group();

for (let i = 0; i < floorCount; i++) {
  const geometry = new THREE.BoxGeometry(floorWidth, floorHeight, floorWidth);
  const hue = (i / floorCount) * 360;
  const color = new THREE.Color(`hsl(${hue}, 70%, 60%)`);

  const material = new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity: 1,
    emissive: new THREE.Color(0x000000),
    emissiveIntensity: 0,
    depthWrite: true,
    colorWrite: true
  });

  const mesh = new THREE.Mesh(geometry, material);
  const totalLength = floorCount * (floorWidth + spacing);
  const offsetX = -totalLength / 2 + i * (floorWidth + spacing) + floorWidth / 2;

  mesh.position.set(lookAt.x + offsetX, lookAt.y, lookAt.z);
  mesh.userData.floorNumber = i + 1;

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
  sharedMemoryForWorkers: false
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

  function animateOpacity(mesh, targetOpacity, targetEmissive = 0) {
    gsap.to(mesh.material, {
      opacity: targetOpacity,
      emissiveIntensity: targetEmissive,
      duration: 0.3,
      onUpdate: () => {
        mesh.material.needsUpdate = true;
      }
    });
  }

  function applyHoverMaterial(mesh) {
    animateOpacity(mesh, 0.6, 0.6);
    mesh.material.colorWrite = true;
    mesh.material.depthWrite = true;
    mesh.material.emissive.set(0x3399ff);
    log('Hover applied to floor', mesh.userData.floorNumber);
  }

  function applySelectedMaterial(mesh) {
    animateOpacity(mesh, 1, 1);
    mesh.material.colorWrite = true;
    mesh.material.depthWrite = true;
    mesh.material.emissive.set(0xffaa00);
    log('Selected floor', mesh.userData.floorNumber);
  }

  function resetMaterial(mesh) {
    animateOpacity(mesh, 0, 0);
    mesh.material.colorWrite = false;
    mesh.material.depthWrite = false;
    mesh.material.emissive.set(0x000000);
    log('Reset floor', mesh.userData.floorNumber);
  }

  function onMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(buildingGroup.children);

    const previousHovered = hoveredFloor;
    hoveredFloor = null;

    if (intersects.length > 0) {
      const floor = intersects[0].object;

      if (floor !== selectedFloor) {
        applyHoverMaterial(floor);
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
      label.style.display = 'none';
    }

    if (previousHovered && previousHovered !== selectedFloor && previousHovered !== hoveredFloor) {
      resetMaterial(previousHovered);
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
        resetMaterial(clickedFloor);
        selectedFloor = null;
        infoPanel.style.display = 'none';
        return;
      }

      if (selectedFloor) {
        resetMaterial(selectedFloor);
      }

      selectedFloor = clickedFloor;
      applySelectedMaterial(clickedFloor);

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
        resetMaterial(selectedFloor);
        selectedFloor = null;
      }
      infoPanel.style.display = 'none';
    }
  }

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('click', onClick);

  renderer.domElement.addEventListener('mouseleave', () => {
    if (hoveredFloor && hoveredFloor !== selectedFloor) {
      resetMaterial(hoveredFloor);
      hoveredFloor = null;
    }
    label.style.display = 'none';
    log('Mouse left canvas');
  });
}).catch(console.error);
