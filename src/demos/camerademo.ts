
import { WebGlHost } from "../webglhost.js";

export class WebGlCameraDemo extends WebGlHost {

    public override onloadHook(): void {
        
        this.bindPositionAndNormal();
        this.setupCameraMovement();
    }

    public override clickEvent(): void {
        
        this.reloadVertexShader();
    }

    reloadVertexShader() {

        this.vertexShaderCode = this.getCodeSnippet();
        this.loadShaders();
        this.updateSimpleCameraPosition();
        this.renderCycle();
    }

    public setupCameraMovement() {

        document.addEventListener('keyup', (event) => {
            this.updateCameraPositionOnKeyUp(event);
        }, false);
    }

    updateSimpleCameraPosition() {

        if (!this.shaderProgram) {
            return;
        }

        var gl: WebGLRenderingContext = this.gl;
        var uCamPosLocation = gl.getUniformLocation(this.shaderProgram, "u_cameraPosition");
        gl.uniform3f(uCamPosLocation, this.cameraPosition[0], this.cameraPosition[1], this.cameraPosition[2]);
    }

    public updateCameraPositionOnKeyUp(event: KeyboardEvent) {

        if (this.moveCamera(event.key)) {
            this.updateSimpleCameraPosition();
        }
        this.renderCycle();
    }

    public moveCamera(key: string): boolean {

        if (key == 'd') {
            this.cameraPosition[0] = this.cameraPosition[0] + 0.05;
        }
        else if (key == 'a') {
            this.cameraPosition[0] = this.cameraPosition[0] - 0.05;
        }
        else if (key == 'w') {
            this.cameraPosition[1] = this.cameraPosition[1] + 0.05;
        }
        else if (key == 's') {
            this.cameraPosition[1] = this.cameraPosition[1] - 0.05;
        }
        else {
            return false;
        }
        return true;
    }
}
