
import { TriangleModel } from "./models/triangle.js";
import { PageLoader } from "./pageloader.js";

function LoadLoadingPage(): void  {

    const triangle: TriangleModel = new TriangleModel();
    PageLoader.initialiseVBOTutorial(triangle.vertices, triangle.indices);
}

LoadLoadingPage();