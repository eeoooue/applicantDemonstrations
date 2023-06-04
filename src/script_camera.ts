
import { CodeParcel } from "./code_parcel.js";
import { GetSphereModel } from "./models/sphere.js";
import { Model } from "./model.js";
import { WebGlHost } from "./webglhost.js";
import { WebGlCameraDemo } from "./demos/camerademo.js";


export class CameraDemo {

    constructor(model: Model, parcel: CodeParcel) {

        this.initializeDemo(model, parcel.vertexShaderCode, parcel.fragmentShaderCode, "camera");
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

                var host = new WebGlCameraDemo(gl, model.vertices, model.indices, vertexShaderCode, fragmentShaderCode, pageTitle);
                host.bindPositionAndNormal();
                host.setupCameraMovement();
            }
        }
    }
}


const vertexShaderCode: string =
    'attribute vec3 a_position;\r\n' +
    'attribute vec3 a_normal;\r\n\r\n' +
    'uniform vec3 u_cameraPosition;\r\n\r\n' +
    'varying vec4 v_colour;\r\n\r\n' +
    'void main(void) {\r\n' +
    ' gl_Position = vec4(a_position, 1.0);\r\n' +
    ' v_colour = vec4(a_normal * 0.5 + 0.5, 1.0);\r\n' +
    '}';

const fragmentShaderCode: string =
    'precision mediump float;' +
    'varying vec4 v_colour;' +
    'void main(void) {' +
    ' gl_FragColor = v_colour;' +
    '}';

const startingCode: string = vertexShaderCode;

const parcel = new CodeParcel(vertexShaderCode, fragmentShaderCode, startingCode);
const sphereModel: Model = GetSphereModel();
new CameraDemo(sphereModel, parcel);
