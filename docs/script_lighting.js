import { StanfordBunny } from "./models/stanfordbunny.js";
import { WebGlHost } from "./webglhost.js";
export class LightingDemo {
    constructor() {
        this.vertexShaderCode = 'attribute vec3 a_position;\r\n' +
            'attribute vec3 a_normal;\r\n\r\n' +
            'uniform float u_rotation;\r\n\r\n' +
            'varying vec3 v_normal;\r\n\r\n' +
            'void main(void) {\r\n' +
            'float c = cos(u_rotation);' +
            'float s = sin(u_rotation);' +
            'mat4 rot = mat4 (c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1);' +
            ' gl_Position = rot * vec4(a_position, 1.0);\r\n' +
            ' v_normal = a_normal;\r\n' +
            '}';
        this.fragmentShaderCode = 'precision mediump float;\r\n\r\n' +
            'varying vec3 v_normal;\r\n\r\n' +
            'void main(void) {\r\n' +
            ' gl_FragColor = vec4(v_normal * 0.5 + 0.5, 1.0);\r\n' +
            '}';
        this.model = new StanfordBunny();
        this.startingCode = this.fragmentShaderCode;
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
        this.host = new WebGlHost(this.model.vertices, this.model.indices, this.vertexShaderCode, this.fragmentShaderCode, "lighting");
        this.host.lightingPageBindShaders();
        this.host.startRotationLoop();
    }
}
new LightingDemo();
