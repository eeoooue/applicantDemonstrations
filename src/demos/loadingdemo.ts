
import { WebGlHost } from "../webglhost.js";

export class WebGlLoadingDemo extends WebGlHost {

    public override onloadHook(): void {

        this.loadingPageBindShaders();
    }

    public override clickEvent(): void {
        
        this.reloadBuffers();
    }

    reloadBuffers() {

        var textAreaContent = this.getCodeSnippet();
        this.vertices = this.toNumArray(textAreaContent.split(","));
        this.loadBuffers();
        this.loadingPageBindShaders();
    }

    toNumArray(strings: string[]): number[] {

        var ans: number[] = new Array<number>();

        strings.forEach(function (s) {
            ans.push(+s);
        })

        return ans;
    }
}

