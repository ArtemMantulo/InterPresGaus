import { createThreeJsScene } from '../scene_utils/createScene.js';
import { createBuilding, createBuildingTwo } from '../scene_utils/createBuilding.js';
import { initViewer } from '../scene_utils/initViewer.js';
import { createLabel } from '../scene_utils/createLabel.js';
import { createInfoPanel } from '../scene_utils/createInfoPanel.js';
import { loadSplatScene } from '../scene_utils/loadSplatScene.js';
import { setupInteractions } from '../scene_utils/setupInteractions.js';

const { scene, marker } = createThreeJsScene();
const building = createBuilding();
const testBuilding = createBuildingTwo();
scene.add(building);
scene.add(marker);
scene.add(testBuilding);

const label = createLabel();
const infoPanel = createInfoPanel();

const viewer = initViewer(scene);
loadSplatScene(viewer).then(() => {
  setupInteractions(viewer, building, label, infoPanel);
});

const lookAt = new THREE.Vector3(5.694504, -2.95283, 1.1030717);

//initialCameraPosition: [-2.83355, -3.39966, -4.55430],
//initialCameraLookAt: [2.88504, -0.80033, -4.34717],