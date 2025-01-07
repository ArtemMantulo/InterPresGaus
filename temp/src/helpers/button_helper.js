import * as THREE from '../../node_modules/three';

function animateCameraTo(camera, controls, newPosition, target) {
  const duration = 1000; // Animation duration in milliseconds
  const start = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
  const end = { x: newPosition[0], y: newPosition[1], z: newPosition[2] };
  const delta = { x: end.x - start.x, y: end.y - start.y, z: end.z - start.z };
  const startTime = performance.now();

  function step() {
    const currentTime = performance.now();
    const elapsed = Math.min((currentTime - startTime) / duration, 1);

    camera.position.set(
      start.x + delta.x * elapsed,
      start.y + delta.y * elapsed,
      start.z + delta.z * elapsed
    );

    if (controls) controls.target.set(...target);

    if (elapsed < 1) {
      requestAnimationFrame(step);
    } else {
      camera.position.set(end.x, end.y, end.z);
      if (controls) controls.update();
    }
  }

  step();
}

export function createButton(reducedDistance, title, subtitle, position, target, buttonContainer, camera, controls, animateCameraTo) {
  const button = document.createElement('div');
  button.style.display = 'flex';
  button.style.flexDirection = 'column';
  button.style.alignItems = 'flex-start';
  button.style.padding = '10px 15px';
  button.style.marginBottom = '10px';
  button.style.background = 'rgba(0, 0, 0, 0.7)';
  button.style.color = 'white';
  button.style.border = '1px solid rgba(255, 255, 255, 0.5)';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.transition = 'transform 0.2s ease, background 0.3s ease';

  // Add hover effect (use JavaScript for event listeners)
  button.addEventListener('mouseover', () => {
    button.style.transform = 'scale(1.05)';
    button.style.background = 'rgba(0, 0, 0, 0.9)';
  });
  button.addEventListener('mouseout', () => {
    button.style.transform = 'scale(1)';
    button.style.background = 'rgba(0, 0, 0, 0.7)';
  });

  const titleElement = document.createElement('div');
  titleElement.style.fontSize = '16px';
  titleElement.style.fontWeight = 'bold';
  titleElement.innerText = title;
  button.appendChild(titleElement);

  const subtitleElement = document.createElement('div');
  subtitleElement.style.fontSize = '12px';
  subtitleElement.style.color = 'rgba(255, 255, 255, 0.7)';
  subtitleElement.innerText = subtitle;
  button.appendChild(subtitleElement);

  button.onclick = () => {
    const targetVector = new THREE.Vector3(...target);
    const positionVector = new THREE.Vector3(...position);
    const direction = positionVector.clone().sub(targetVector).normalize();

    const closerPosition = targetVector.clone().add(direction.multiplyScalar(reducedDistance));
    animateCameraTo(camera, controls, [closerPosition.x, closerPosition.y, closerPosition.z], target);
  };

  buttonContainer.appendChild(button);
}