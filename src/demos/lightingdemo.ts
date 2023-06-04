
import { WebGlHost } from "../webglhost.js";

export class WebGlLightingDemo extends WebGlHost {

    public rotation = 0;

    public override onloadHook(): void {
    
        this.bindPositionAndNormal();
        this.startRotationLoop();
    }

    public override clickEvent(): void {
        
        this.reloadPixelShader();
    }

    public reloadPixelShader(): void {

        this.fragmentShaderCode = this.getCodeSnippet();
        this.loadShaders();
        this.bindPositionAndNormal();
        this.renderCycle();
    }

    public updateRotation() {

        if (this.shaderProgram) {

            var gl: WebGLRenderingContext = this.gl;
            var uRotationLocation = gl.getUniformLocation(this.shaderProgram, "u_rotation");
            gl.uniform1f(uRotationLocation, this.rotation);
            this.rotation = (this.rotation + 0.01) % 6.28;
        }

        this.renderCycle();
        window.requestAnimationFrame(() => { this.updateRotation() });
    }

    public startRotationLoop() {

        window.requestAnimationFrame(() => { this.updateRotation() });
    }
}

