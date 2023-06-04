import { WebGlHost } from "../webglhost.js";
export class WebGlCameraDemo extends WebGlHost {
    clickEvent() {
        this.reloadVertexShader();
    }
    reloadVertexShader() {
        // specific to camera page
        this.vertexShaderCode = this.getCodeSnippet();
        this.loadShaders();
        this.updateSimpleCameraPosition();
        this.renderCycle();
    }
    setupCameraMovement() {
        document.addEventListener('keyup', (event) => {
            this.updateCameraPositionOnKeyUp(event);
        }, false);
    }
    updateSimpleCameraPosition() {
        if (!this.shaderProgram) {
            return;
        }
        var gl = this.gl;
        var uCamPosLocation = gl.getUniformLocation(this.shaderProgram, "u_cameraPosition");
        gl.uniform3f(uCamPosLocation, this.cameraPosition[0], this.cameraPosition[1], this.cameraPosition[2]);
    }
    updateCameraPositionOnKeyUp(event) {
        if (this.moveCamera(event.key)) {
            this.updateSimpleCameraPosition();
        }
        this.renderCycle();
    }
    moveCamera(key) {
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
