import * as GaussianSplats3D from '../gaussian-splats-3d.module.js';
import * as THREE from 'three';
import { initializePins, clearPins } from '../utils/pinManager.js';

const navItems = document.querySelectorAll('.navlist__item');
const amenitiesCard = document.getElementById('amenitiesCard');
const apartmentsCard = document.getElementById('apartmentsCard');
const apartmentCard = document.getElementById('apartmentCard');

const pinData = [
  {
    label: 'Parking',
    icon: '/assets/Pin.png',
    position: new THREE.Vector3(1.13333, -0.95538, -4.7512),
    description: 'Secure and accessible parking with convenient entry and exit.',
    imgSrc: "/assets/parking_photo.png"
  },
  { label: 'Pool', 
    icon: '/assets/pool.png', 
    position: new THREE.Vector3(2.32044, -1.02103, -4.15728),
    description: 'Calm, turquoise waters are protected by a coral reet, offering a serene and safe environment perfect for swimming and relaxation.',
    imgSrc: "/assets/children_playground_photo.png"

  },
  { label: 'Gym', 
    icon: '/assets/gym_icon.png', 
    position: new THREE.Vector3(2.67868, -1.10441, -6.7061),
    description: 'Fully equipped gym for workout and physical activities.',
    imgSrc: "/assets/gym_photo.png"
  },
  {
    label: 'Lounge Area by the Pool',
    icon: '/assets/lounge_area_pool.png',
    position: new THREE.Vector3(2.65646, -0.98472, -5.70358),
    description: 'Pool with a cozy lounge area, ideal for relaxation and gatherings.',
    imgSrc: "/assets/pool_chill_area_photo.png"
  },
  {
    label: 'Children Playground',
    icon: '/assets/children_playground.png',
    position: new THREE.Vector3(4.08201, -0.99597, -4.11901),
    description: 'Safe and fun playground for kids, with diverse play equipment.',
    imgSrc: '/assets/children_playground_photo.png'
  },
];

const unitPhoto = '/assets/units_photo.png';

const aptData = {
  1: { aptNumber: 1, description: 'Poolside view unit A type', size: 62, image: unitPhoto, availability: "Available" },
  2: { aptNumber: 2, description: 'Poolside view unit A type', size: 62, image: unitPhoto, availability: "Available" },
  3: { aptNumber: 3, description: 'Poolside view unit B type', size: 54, image: unitPhoto, availability: "Available" },
  4: { aptNumber: 4, description: 'Poolside view unit A type', size: 62, image: unitPhoto, availability: "Sold" },
  5: { aptNumber: 5, description: 'Poolside view unit A type', size: 90, image: unitPhoto, availability: "Available" },
  6: { aptNumber: 6, description: 'Poolside view unit A type', size: 90, image: unitPhoto, availability: "Available" },
  7: { aptNumber: 7, description: 'Poolside view unit C type', size: 68, image: unitPhoto, availability: "Available" },
  8: { aptNumber: 8, description: 'Poolside view unit A type', size: 90, image: unitPhoto, availability: "Available" },
  
  9: { aptNumber: 9, description: 'Poolside view unit A type', size: 90, image: '/assets/units_photo.png', availability: "Available"},
  10: { aptNumber: 10, description: 'Poolside view unit A type', size: 90, image: '/assets/units_photo.png', availability: "Sold"},
  11: { aptNumber: 11, description: 'Poolside view unit A type', size: 90, image: '/assets/units_photo.png', availability: "Available"},
  12: { aptNumber: 12, description: 'Poolside view unit D type', size: 90, image: '/assets/units_photo.png', availability: "Available"},
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
  initialCameraPosition: [1.10316, -3.17695, -9.93340],
  initialCameraLookAt: [2.26650, -0.99005, -5.24780],
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
  console.log(viewer.camera.position)
  gsap.to(viewer.camera.position, {
    duration: 2.5,
    x: -1.17621,
    y: -3.92368,
    z: -7.46254,
    onComplete: () => {
      viewer.setupEventHandlers()
      controls.enabled = true;
      controls.enableZoom = true;
      controls.enableRotate = true;
      controls.enablePan = true;
    }
  });
};

const resetCameraViewWithDisabledControls = () => {
  console.log(viewer.camera.position)
  gsap.to(viewer.camera.position, {
    duration: 2.5,
    x: -1.17621,
    y: -3.92368,
    z: -7.46254,
    onComplete: () => {
      viewer
      controls.enabled = true;
      controls.enableZoom = true;
      controls.enableRotate = true;
      controls.enablePan = true;
    }
  });
};

// const resetCameraView = () => {
//   const camera = viewer.camera;
//   const controls = viewer.controls;

//   const to = {
//     x: 0.01909,
//     y: -2.72932,
//     z: -7.49616,
//     targetX: 2.49640,   // замените на нужную точку
//     targetY: -0.53319,
//     targetZ: -5.33785
//   };
//   gsap.to({
//     x: camera.position.x,
//     y: camera.position.y,
//     z: camera.position.z,
//     targetX: controls.target.x,
//     targetY: controls.target.y,
//     targetZ: controls.target.z
//   }, {
//     duration: 2.5,
//     x: to.x,
//     y: to.y,
//     z: to.z,
//     targetX: to.targetX,
//     targetY: to.targetY,
//     targetZ: to.targetZ,
//     ease: "power2.inOut",
//     onUpdate: function () {
//       camera.position.set(this.targets()[0].x, this.targets()[0].y, this.targets()[0].z);
//       controls.target.set(this.targets()[0].targetX, this.targets()[0].targetY, this.targets()[0].targetZ);
//       controls.update();
//     },
//     onComplete: () => {
//       viewer.setupEventHandlers();
//       controls.enabled = true;
//       controls.enableZoom = true;
//       controls.enableRotate = true;
//       controls.enablePan = true;
//     }
//   });
// };

// ===== LOAD SCENE & INTERACTION =====
viewer
  .addSplatScene('/assets/Breig_future.ksplat', {
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
      const currentActive = document.querySelector('.navlist__item.active');
  if (!currentActive || currentActive.textContent.trim() !== 'Apartments') return;

  // Только для мыши, пальца или стилуса
  if (!['mouse', 'touch', 'pen'].includes(event.pointerType)) return;

  const rect = renderer.domElement.getBoundingClientRect();

  const pointer = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );

  raycaster.setFromCamera(pointer, camera);
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

    label.innerText = `Unit ${floor.userData.floorNumber}`;
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
      const currentActive = document.querySelector('.navlist__item.active');
      if (!currentActive || currentActive.textContent.trim() !== 'Apartments') return;
    
      const isTouch = event.type.startsWith('touch') || event.pointerType === 'touch';
      const input = isTouch ? (event.touches ? event.touches[0] : event) : event;
      if (!input) return;
    
      const rect = viewer.renderer.domElement.getBoundingClientRect();
    
      const mouse = new THREE.Vector2(
        ((input.clientX - rect.left) / rect.width) * 2 - 1,
        -((input.clientY - rect.top) / rect.height) * 2 + 1
      );
    
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, viewer.camera);
      const intersects = raycaster.intersectObjects(buildingGroup.children);
    
      if (intersects.length > 0) {
        const clickedFloor = intersects[0].object;
        const floorNum = clickedFloor.userData.floorNumber;
        const data = aptData[floorNum];
    
        // ✅ Подсветка
        if (selectedFloor && selectedFloor !== clickedFloor) {
          hideFloor(selectedFloor);
        }
        showFloor(clickedFloor);
        selectedFloor = clickedFloor;
    
        // 📦 Отображение карточки
        const apartmentCard = document.getElementById('apartmentCard');
        const apartmentCardContent = document.getElementById('apartmentCardContent');
        apartmentCardContent.innerHTML = '';
    
        if (data) {
          const template = document.getElementById('apartmentCardTemplate');
          const clone = template.content.cloneNode(true);
    
          clone.querySelector('img').src = data.image;
          clone.querySelector('img').alt = `Apartment ${data.aptNumber}`;
          clone.querySelector('h3').textContent = `Unit ${data.aptNumber}`;
          clone.querySelector('.description').textContent = data.description;
          clone.querySelector('.size strong').textContent = `${data.size} m²`;
          clone.querySelector('.availability').textContent = data.availability;
    
          apartmentCardContent.appendChild(clone);
    
          if (window.innerWidth <= 768) {
            apartmentsCard.classList.add('hidden');
          }
    
          apartmentCard.classList.remove('hidden');
        } else {
          apartmentCardContent.innerHTML = `<h3>No data for apartment ${floorNum}</h3>`;
          apartmentCard.classList.remove('hidden');
        }
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

    document.body.addEventListener('click', (e) => {
      const backBtn = e.target.closest('.btn-back');
      if (backBtn) {
        apartmentCard.classList.add('hidden');
        apartmentsCard.classList.remove('hidden');
    
        // Убрать подсветку с выбранного блока
        if (selectedFloor) {
          hideFloor(selectedFloor);
          selectedFloor = null;
        }
      }
    });
    // window.addEventListener('mousemove', onMouseMove);
    // window.addEventListener('click', onClick);
    window.addEventListener('pointerdown', onClick);
    window.addEventListener('pointermove', onMouseMove);
  })
  .catch(console.error);

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
      resetCameraViewWithDisabledControls();
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

const aptcoors = {
  'apt-101': {
    x: 2.50114,
    y: -1.5,
    z: -7,
    target: { x: 2.5, y: -1, z: -5.7 }
  },
  'apt-102': {
    x: 3.86658,
    y: -1.45791,
    z: -7.04782,
    target: { x: 3.27752, y: -0.94184, z: -6.28653 }
  },
  'apt-103': {
    x: 4.99252,
    y: -1.95072,
    z: -5.10572,
    target: { x: 3.92374, y: -0.84633, z: -3.56496 }
  },
  villas: {
    x: 5.35342,
    y: -1.55906,
    z: -5.00447,
    target: { x: 4, y: -0.83, z: -5 }
  }
};

function moveCameraToApartment(aptName) {
 const camera = viewer.camera;
  const targetData = aptcoors[aptName];

  if (!targetData) {
    console.warn(`Нет координат для ${aptName}`);
    return;
  }

  const from = {
    camX: camera.position.x,
    camY: camera.position.y,
    camZ: camera.position.z,
    targetX: controls.target.x,
    targetY: controls.target.y,
    targetZ: controls.target.z
  };

  const to = {
    camX: targetData.x,
    camY: targetData.y,
    camZ: targetData.z,
    targetX: targetData.target.x,
    targetY: targetData.target.y,
    targetZ: targetData.target.z
  };

  gsap.to(from, {
    duration: 2.5,
    ease: 'power2.inOut',
    camX: to.camX,
    camY: to.camY,
    camZ: to.camZ,
    targetX: to.targetX,
    targetY: to.targetY,
    targetZ: to.targetZ,
    onUpdate: () => {
      camera.position.set(from.camX, from.camY, from.camZ);
      controls.target.set(from.targetX, from.targetY, from.targetZ);
      controls.update();
    },
    onComplete: () => {
       viewer.controls.enabled = false;
       viewer.controls.enableZoom = false;
       viewer.controls.enableRotate = false;
       viewer.controls.enablePan = false;
    }
  });
  viewer.removeEventHandlers();
}

// function moveCameraToApartment(aptName) {
//   const camera = viewer.camera;

//   gsap.to(camera.position, {
//     duration: 2.5,
//     x: aptcoors[aptName].x,
//     y: aptcoors[aptName].y,
//     z: aptcoors[aptName].z,
//     onComplete: () => {
//       viewer.controls.enabled = false;
//       viewer.controls.enableZoom = false;
//       viewer.controls.enableRotate = false;
//       viewer.controls.enablePan = false;
//     },
//   });

//   viewer.removeEventHandlers();
// }