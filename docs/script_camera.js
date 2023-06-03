import { SphereModel } from "./models/sphere.js";
import { WebGlHost } from "./webglhost.js";
export class CameraDemo {
    constructor() {
        this.vertexShaderCode = 'attribute vec3 a_position;\r\n' +
            'attribute vec3 a_normal;\r\n\r\n' +
            'uniform vec3 u_cameraPosition;\r\n\r\n' +
            'varying vec4 v_colour;\r\n\r\n' +
            'void main(void) {\r\n' +
            ' gl_Position = vec4(a_position, 1.0);\r\n' +
            ' v_colour = vec4(a_normal * 0.5 + 0.5, 1.0);\r\n' +
            '}';
        this.fragmentShaderCode = 'precision mediump float;' +
            'varying vec4 v_colour;' +
            'void main(void) {' +
            ' gl_FragColor = v_colour;' +
            '}';
        this.model = new SphereModel();
        this.startingCode = this.vertexShaderCode;
        this.initializeDemo();
        this.populateTextArea();
    }
    populateTextArea() {
        const codeSection = document.getElementById("code");
        if (codeSection instanceof HTMLTextAreaElement) {
            codeSection.value = this.startingCode;
        }
    }
    initializeDemo() {
        var host = new WebGlHost(this.model.sphereVertices, this.model.sphereIndices, this.vertexShaderCode, this.fragmentShaderCode, "lighting");
        host.cameraPageBindShaders();
        host.setupCameraMovement();
    }
}
new CameraDemo();
