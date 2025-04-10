import { createThreeJsScene } from '../scene_utils/createScene.js';
import { createBuilding } from '../scene_utils/createBuilding.js';
import { initViewer } from '../scene_utils/initViewer.js';
import { createLabel } from '../scene_utils/createLabel.js';
import { createInfoPanel } from '../scene_utils/createInfoPanel.js';
import { loadSplatScene } from '../scene_utils/loadSplatScene.js';
import { setupInteractions } from '../scene_utils/setupInteractions.js';

const { scene, marker } = createThreeJsScene();
const building = createBuilding();
scene.add(building);
scene.add(marker);

const label = createLabel();
const infoPanel = createInfoPanel();

const viewer = initViewer(scene);
loadSplatScene(viewer).then(() => {
  setupInteractions(viewer, building, label, infoPanel);
});