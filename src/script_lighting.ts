
import { StanfordBunny } from "./models/stanfordbunny.js";
import { PageLoader } from "./pageloader.js";

function LoadBunnyPage(): void {

    const bunnyModel: StanfordBunny = new StanfordBunny();
    PageLoader.initialiseLightingTutorial(bunnyModel.bunnyVertices, bunnyModel.bunnyIndices);
}

LoadBunnyPage();