import * as THREE from 'three';

export function createBuilding() {
  const buildingGroup = new THREE.Group();

  const blockCount = 12;           // 12 секций
  const floorCount = 1;            // 2 этажа
  const blockWidth = 0.11;          // Ширина одной секции
  const blockDepth = 0.38;          // Глубина секции
  const floorHeight = 0.1;         // Высота одного этажа

  // Начальная точка здания
  const startX = 0.994504;
  const startY = -0.87033;
  const startZ = -5.4930717;

  for (let i = 0; i < blockCount; i++) {
    for (let j = 0; j < floorCount; j++) {
      const geometry = new THREE.BoxGeometry(blockWidth, floorHeight, blockDepth);
      const color = new THREE.Color(`hsl(${(i / blockCount) * 360}, 50%, 65%)`);
      const material = new THREE.MeshStandardMaterial({
        color,
        transparent: true,
        opacity: 0,          // почти невидимый, но видимый для raycaster
        depthWrite: false,
        colorWrite: false
      });

      const mesh = new THREE.Mesh(geometry, material);

      // Располагаем блоки вдоль оси X
      mesh.position.set(
        startX + i * (blockWidth + 0.013),     // Добавляем небольшое расстояние между блоками
        startY + j * floorHeight,
        startZ
      );

      mesh.userData.block = i + 1;
      mesh.userData.floor = j + 1;

      buildingGroup.add(mesh);
    }
  }

  buildingGroup.rotation.y = THREE.MathUtils.degToRad(-11);
  return buildingGroup;
}