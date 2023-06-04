import { WebGlHost } from "../webglhost.js";
export class WebGlLoadingDemo extends WebGlHost {
    clickEvent() {
        this.reloadBuffers();
    }
    reloadBuffers() {
        var textAreaContent = this.getCodeSnippet();
        this.vertices = this.toNumArray(textAreaContent.split(","));
        this.loadBuffers();
        this.loadingPageBindShaders();
    }
    toNumArray(strings) {
        var ans = new Array();
        strings.forEach(function (s) {
            ans.push(+s);
        });
        return ans;
    }
}
