import { TriangleModel } from "./models/triangle.js";
import { PageLoader } from "./pageloader.js";
function LoadLoadingPage() {
    const triangle = new TriangleModel();
    PageLoader.initialiseVBOTutorial(triangle.vertices, triangle.indices);
}
LoadLoadingPage();
