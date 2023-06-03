
import { SphereModel } from "./models/sphere.js";
import { PageLoader } from "./pageloader.js";

function loadCameraPage(): void  {

    const sphere: SphereModel = new SphereModel();
    PageLoader.initialiseCameraTutorial(sphere.sphereVertices, sphere.sphereIndices);
}

loadCameraPage();
