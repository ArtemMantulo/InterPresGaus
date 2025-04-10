import * as THREE from 'three';

export function createThreeJsScene() {
  const scene = new THREE.Scene();

  const marker = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  marker.position.set(-0.02201, 2.55283, 0.34280);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 10, 5);

  scene.add(ambient, dirLight);

  return { scene, marker };
}