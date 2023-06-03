import { StanfordBunny } from "./models/stanfordbunny.js";
import { PageLoader } from "./pageloader.js";
function LoadBunnyPage() {
    const bunnyModel = new StanfordBunny();
    PageLoader.initialiseLightingTutorial(bunnyModel.bunnyVertices, bunnyModel.bunnyIndices);
}
LoadBunnyPage();
