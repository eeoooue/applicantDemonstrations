import { WebGlHost } from "../webglhost.js";
export class WebGlLightingDemo extends WebGlHost {
    constructor() {
        super(...arguments);
        this.rotation = 0;
    }
    onloadHook() {
        this.bindPositionAndNormal();
        this.startRotationLoop();
    }
    clickEvent() {
        this.reloadPixelShader();
    }
    reloadPixelShader() {
        this.fragmentShaderCode = this.getCodeSnippet();
        this.loadShaders();
        this.bindPositionAndNormal();
        this.renderCycle();
    }
    updateRotation() {
        if (this.shaderProgram) {
            var gl = this.gl;
            var uRotationLocation = gl.getUniformLocation(this.shaderProgram, "u_rotation");
            gl.uniform1f(uRotationLocation, this.rotation);
            this.rotation = (this.rotation + 0.01) % 6.28;
        }
        this.renderCycle();
        window.requestAnimationFrame(() => { this.updateRotation(); });
    }
    startRotationLoop() {
        window.requestAnimationFrame(() => { this.updateRotation(); });
    }
}
