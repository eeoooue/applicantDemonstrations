import { CodeParcel } from "./code_parcel.js";
import { GetSphereModel } from "./models/sphere.js";
import { WebGlCameraDemo } from "./demos/camerademo.js";
export class CameraDemo {
    constructor(model, parcel) {
        this.initializeDemo(model, parcel.vertexShaderCode, parcel.fragmentShaderCode, "camera");
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
                var host = new WebGlCameraDemo(gl, model.vertices, model.indices, vertexShaderCode, fragmentShaderCode, pageTitle);
                host.bindPositionAndNormal();
                host.setupCameraMovement();
            }
        }
    }
}
const vertexShaderCode = 'attribute vec3 a_position;\r\n' +
    'attribute vec3 a_normal;\r\n\r\n' +
    'uniform vec3 u_cameraPosition;\r\n\r\n' +
    'varying vec4 v_colour;\r\n\r\n' +
    'void main(void) {\r\n' +
    ' gl_Position = vec4(a_position, 1.0);\r\n' +
    ' v_colour = vec4(a_normal * 0.5 + 0.5, 1.0);\r\n' +
    '}';
const fragmentShaderCode = 'precision mediump float;' +
    'varying vec4 v_colour;' +
    'void main(void) {' +
    ' gl_FragColor = v_colour;' +
    '}';
const startingCode = vertexShaderCode;
const parcel = new CodeParcel(vertexShaderCode, fragmentShaderCode, startingCode);
const sphereModel = GetSphereModel();
new CameraDemo(sphereModel, parcel);
