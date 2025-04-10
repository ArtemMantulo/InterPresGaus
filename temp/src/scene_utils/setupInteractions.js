import * as THREE from 'three';
import { updateInfoPanel } from './updateInfoPanel.js';

export function setupInteractions(viewer, buildingGroup, label, infoPanel) {
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
      updateInfoPanel(infoPanel.textSection, floorNum);
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
}
