import * as GaussianSplats3D from '../gaussian-splats-3d.module.js';
import * as THREE from 'three';
import { initializePins, clearPins } from '../utils/pinManager.js';

const navItems = document.querySelectorAll('.navlist__item');
const amenitiesCard = document.getElementById('amenitiesCard');
const apartmentsCard = document.getElementById('apartmentsCard');
const apartmentCard = document.getElementById('apartmentCard');

const aptcoors = {
  'apt-101': { x: 2.5, y: -0.6, z: -6.8 },
  'apt-102': { x: 1, y: -1, z: -1 },
  'apt-103': { x: 3, y: -3, z: -3 },
  villa: { x: 5, y: -3, z: -3 },
};

const pinData = [
  {
    label: 'Parking',
    icon: '../assets/Pin.png',
    position: new THREE.Vector3(1.13333, -0.95538, -4.7512),
  },
  { label: 'Pool', icon: '../assets/pool.png', position: new THREE.Vector3(2.32044, -1.02103, -4.15728) },
  { label: 'Gym', icon: '../assets/gym_icon.png', position: new THREE.Vector3(2.67868, -1.10441, -6.7061) },
  {
    label: 'Lounge Area by the Pool',
    icon: '../assets/lounge_area_pool.png',
    position: new THREE.Vector3(2.65646, -0.98472, -5.70358),
    description: 'Pool with a cozy lounge area, ideal for relaxation and gatherings.',
  },
  {
    label: 'Children Playground',
    icon: '../assets/children_playground.png',
    position: new THREE.Vector3(4.08201, -0.99597, -4.11901),
  },
];

const aptData = {
  1: { aptNumber: 1, description: 'Some info about apt', size: 62 },
  2: { aptNumber: 2, description: 'Some info about apt', size: 54 },
  3: { aptNumber: 3, description: 'Some info about apt', size: 90 },
  4: { aptNumber: 4, description: 'Some info about apt', size: 90 },
  5: { aptNumber: 5, description: 'Some info about apt', size: 90 },
  6: { aptNumber: 6, description: 'Some info about apt', size: 90 },
  7: { aptNumber: 7, description: 'Some info about apt', size: 90 },
  8: { aptNumber: 8, description: 'Some info about apt', size: 90 },
  9: { aptNumber: 9, description: 'Some info about apt', size: 90 },
};

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
    colorWrite: false,
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
const marker = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
marker.position.copy(lookAt);
threeScene.add(marker);

// ===== LIGHTING =====
threeScene.add(new THREE.AmbientLight(0xffffff, 0.4));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 5);
threeScene.add(dirLight);

// ===== LABEL (hover info) =====
const label = document.createElement('div');
Object.assign(label.style, {
  position: 'absolute',
  padding: '4px 8px',
  background: 'rgba(0,0,0,0.7)',
  color: 'white',
  borderRadius: '4px',
  fontSize: '14px',
  pointerEvents: 'none',
  display: 'none',
  zIndex: '1000',
});
document.body.appendChild(label);

// ===== VIEWER SETUP =====
const viewer = new GaussianSplats3D.Viewer({
  threeScene,
  cameraUp: [0, -1, 0],
  initialCameraPosition: [-2.83355, -3.39966, -4.5543],
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

let controls;

const resetCameraView = () => {
  gsap.to(viewer.camera.position, {
    duration: 1.5,
    x: -1.17621,
    y: -3.92368,
    z: -7.46254,
    onComplete: () => {
      viewer.setupEventHandlers();
      viewer.controls.enabled = true;
      viewer.controls.enableZoom = true;
      viewer.controls.enableRotate = true;
      viewer.controls.enablePan = true;
    },
  });
};

// ===== LOAD SCENE & INTERACTION =====
viewer
  .addSplatScene('../assets/Breig_future.ksplat', {
    splatAlphaRemovalThreshold: 15,
    showLoadingUI: true,
    progressiveLoad: true,
    position: [0, 1, 0],
    rotation: [0, 0, 0, 1],
    scale: [1.5, 1.5, 1.5],
  })
  .then(() => {
    viewer.start();

    controls = viewer.controls;
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
      const currentActive = Array.from(document.getElementsByClassName('active'))[0];
      if (currentActive.textContent !== 'Apartments') {
        return;
      }
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
      const currentActive = Array.from(document.getElementsByClassName('active'))[0];
      if (currentActive.textContent !== 'Apartments') {
        return;
      }
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(buildingGroup.children);

      if (intersects.length > 0) {
        const clickedFloor = intersects[0].object;

        if (selectedFloor === clickedFloor) {
          hideFloor(selectedFloor);
          selectedFloor = null;
          return;
        }

        if (selectedFloor) {
          hideFloor(selectedFloor);
        }

        selectedFloor = clickedFloor;
        showFloor(clickedFloor);

        const floorNum = clickedFloor.userData.floorNumber;
        const data = aptData[floorNum];

        // Show the apartment card and populate with data
        const apartmentCard = document.getElementById('apartmentCard');
        const apartmentCardContent = document.getElementById('apartmentCardContent');
        if (data) {
          apartmentCardContent.innerHTML = `
            <h3>Apartment ${data.aptNumber}</h3>
            <p class="description">${data.description}</p>
            <p class="size">sq: <strong>${data.size} m²</strong></p>
            <div class="card-buttons">
              <button class="btn primary">▶ Visit unit</button>
              <button class="btn secondary">Street View</button>
            </div>
          `;
          apartmentCard.classList.remove('hidden');
        } else {
          apartmentCardContent.innerHTML = `<h3>No data for apartment ${floorNum}</h3>`;
          apartmentCard.classList.remove('hidden');
        }
      } else {
        hideFloor(selectedFloor);
        selectedFloor = null;
      }
    }

    function hideFloor(floor) {
      floor.material.opacity = 0;
      floor.material.colorWrite = false;
      floor.material.depthWrite = false;
    }

    function showFloor(floor) {
      floor.material.opacity = 1;
      floor.material.colorWrite = true;
      floor.material.depthWrite = true;
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
  })
  .catch(console.error);

// const mousePosition = viewer.disableMouse();

//setTimeout(viewer.enebleMouse(mousePosition), 10000)
//viewer.enebleMouse(mousePosition)

navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(el => el.classList.remove('active'));
    item.classList.add('active');

    const text = item.textContent.trim();
    amenitiesCard.classList.add('hidden');
    apartmentsCard.classList.add('hidden');

    if (text === 'Amenities') {
      apartmentsCard.classList.add('hidden');
      apartmentCard.classList.add('hidden');
      resetCameraView();
      setTimeout(() => initializePins(pinData, viewer.camera, viewer.renderer, viewer.controls), 1000);
    } else if (text === 'Apartments') {
      amenitiesCard.classList.add('hidden');
      apartmentsCard.classList.remove('hidden');
      clearPins();
    } else if (text === 'Home') {
      amenitiesCard.classList.add('hidden');
      apartmentsCard.classList.add('hidden');
      apartmentCard.classList.add('hidden');
      resetCameraView();
      clearPins();
    }
  });
});

document.querySelectorAll('.apartment-options li').forEach(li => {
  const dataAttr = li.getAttribute('data-apt-id');
  li.addEventListener('click', () => {
    moveCameraToApartment(dataAttr);
  });
});

function moveCameraToApartment(aptName) {
  const camera = viewer.camera;

  gsap.to(camera.position, {
    duration: 1.5,
    x: aptcoors[aptName].x,
    y: aptcoors[aptName].y,
    z: aptcoors[aptName].z,
    onComplete: () => {
      viewer.controls.enabled = false;
      viewer.controls.enableZoom = false;
      viewer.controls.enableRotate = false;
      viewer.controls.enablePan = false;
    },
  });

  viewer.removeEventHandlers();
}
