import { SphereModel } from "./models/sphere.js";
import { PageLoader } from "./pageloader.js";
function loadCameraPage() {
    const sphere = new SphereModel();
    PageLoader.initialiseCameraTutorial(sphere.sphereVertices, sphere.sphereIndices);
}
loadCameraPage();
