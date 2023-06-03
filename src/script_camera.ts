
import { SphereModel } from "./models/sphere.js";
import { WebGlHost } from "./webglhost.js";

export class CameraDemo {

    public vertexShaderCode: string =
        'attribute vec3 a_position;\r\n' +
        'attribute vec3 a_normal;\r\n\r\n' +
        'uniform vec3 u_cameraPosition;\r\n\r\n' +
        'varying vec4 v_colour;\r\n\r\n' +
        'void main(void) {\r\n' +
        ' gl_Position = vec4(a_position - u_cameraPosition, 1.0);\r\n' +
        ' v_colour = vec4(a_normal * 0.5 + 0.5, 1.0);\r\n' +
        '}';

    public fragmentShaderCode: string =
        'precision mediump float;' +
        'varying vec4 v_colour;' +
        'void main(void) {' +
        ' gl_FragColor = v_colour;' +
        '}';

    public startingCode: string;

    public model: SphereModel = new SphereModel();

    constructor() {

        this.startingCode = this.vertexShaderCode;
        this.initializeDemo();
        this.populateTextArea();
    }

    public populateTextArea() {

        const codeSection: HTMLElement | null = document.getElementById("code");
        if (codeSection instanceof HTMLTextAreaElement) {
            codeSection.value = this.startingCode;
        }
    }

    public initializeDemo() {

        var host = new WebGlHost(this.model.vertices, this.model.indices, this.vertexShaderCode, this.fragmentShaderCode, "camera");
        host.bindPositionAndNormal();
        host.setupCameraMovement();
    }
}

new CameraDemo();
