import { WebGlLoadingDemo } from "./demos/loadingdemo.js";
import { WebGlCameraDemo } from "./demos/camerademo.js";
import { WebGlLightingDemo } from "./demos/lightingdemo.js";
export class DemoBuilder {
    constructor(model, parcel, pageTitle) {
        this.initializeDemo(model, parcel.vertexShaderCode, parcel.fragmentShaderCode, pageTitle);
        this.populateTextArea(parcel.startingCode);
    }
    populateTextArea(startingCode) {
        const codeSection = document.getElementById("code");
        if (codeSection instanceof HTMLTextAreaElement) {
            codeSection.value = startingCode;
        }
    }
    initializeDemo(model, vertexShaderCode, fragmentShaderCode, pageTitle) {
        const canvas = document.getElementById("webGLCanvas");
        if (canvas instanceof HTMLCanvasElement) {
            const gl = canvas.getContext("webgl");
            if (gl instanceof WebGLRenderingContext) {
                gl.clearColor(0.2, 0.2, 0.2, 1.0);
                gl.enable(gl.DEPTH_TEST);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.viewport(0, 0, canvas.width, canvas.height);
                switch (pageTitle) {
                    case "loading":
                        this.host = new WebGlLoadingDemo(gl, model, vertexShaderCode, fragmentShaderCode);
                        return;
                    case "lighting":
                        this.host = new WebGlLightingDemo(gl, model, vertexShaderCode, fragmentShaderCode);
                        return;
                    case "camera":
                        this.host = new WebGlCameraDemo(gl, model, vertexShaderCode, fragmentShaderCode);
                        return;
                }
            }
        }
    }
}
