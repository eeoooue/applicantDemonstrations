
import { WebGlLoadingDemo } from "./demos/loadingdemo.js";
import { WebGlCameraDemo } from "./demos/camerademo.js";
import { WebGlLightingDemo } from "./demos/lightingdemo.js";
import { WebGlHost } from "./webglhost.js";
import { Model } from "./model.js";
import { CodeParcel } from "./code_parcel.js";

export class DemoBuilder {

    public host: WebGlHost | undefined;

    constructor(model: Model, parcel: CodeParcel, pageTitle: string) {

        this.initializeDemo(model, parcel.vertexShaderCode, parcel.fragmentShaderCode, pageTitle);
        this.populateTextArea(parcel.startingCode);
    }

    public populateTextArea(startingCode: string) {

        const codeSection: HTMLElement | null = document.getElementById("code");
        if (codeSection instanceof HTMLTextAreaElement) {
            codeSection.value = startingCode;
        }
    }

    public initializeDemo(model: Model, vertexShaderCode: string, fragmentShaderCode: string, pageTitle: string) {

        const canvas: HTMLElement | null = document.getElementById("webGLCanvas");

        if (canvas instanceof HTMLCanvasElement) {

            const gl: WebGLRenderingContext | null = canvas.getContext("webgl");

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
