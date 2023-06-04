import { WebGlHost } from "./webglhost.js";
import { GetTriangleModel } from "./models/triangle.js";
export class LoadingDemo {
    constructor() {
        this.vertexShaderCode = 'attribute vec3 a_position;' +
            'attribute vec3 a_colour;' +
            'varying vec4 v_colour;' +
            'void main(void) {' +
            ' gl_Position = vec4(a_position, 1.0);' +
            ' v_colour = vec4(a_colour, 1.0);' +
            '}';
        this.fragmentShaderCode = 'precision mediump float;' +
            'varying vec4 v_colour;' +
            'void main(void) {' +
            ' gl_FragColor = v_colour;' +
            '}';
        this.model = GetTriangleModel();
        this.startingCode = "0.0, 0.75, 0.0, 1.0, 0.0, 0.0,-0.75, -0.75, 0.0, 0.0, 1.0, 0.0, 0.75, -0.75, 0.0, 0.0, 0.0, 1.0";
        this.initializeDemo(this.model);
        this.populateTextArea();
    }
    populateTextArea() {
        const codeSection = document.getElementById("code");
        if (codeSection instanceof HTMLTextAreaElement) {
            codeSection.value = this.startingCode;
        }
    }
    initializeDemo(model) {
        const canvas = document.getElementById("webGLCanvas");
        if (canvas instanceof HTMLCanvasElement) {
            const gl = canvas.getContext("webgl");
            if (gl instanceof WebGLRenderingContext) {
                gl.clearColor(0.2, 0.2, 0.2, 1.0);
                gl.enable(gl.DEPTH_TEST);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.viewport(0, 0, canvas.width, canvas.height);
                this.host = new WebGlHost(gl, model.vertices, model.indices, this.vertexShaderCode, this.fragmentShaderCode, "loading");
                this.host.loadingPageBindShaders();
            }
        }
    }
}
new LoadingDemo();
