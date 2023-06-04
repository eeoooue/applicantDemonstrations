
import { Model } from "./model.js";
import { GetBunnyModel } from "./models/stanfordbunny.js";
import { WebGlHost } from "./webglhost.js";
import { CodeParcel } from "./code_parcel.js";

export class LightingDemo {

    public host: WebGlHost | undefined;

    constructor(model: Model, parcel: CodeParcel) {

        this.initializeDemo(model, parcel.vertexShaderCode, parcel.fragmentShaderCode);
        this.populateTextArea(parcel.startingCode);
    }

    public populateTextArea(startingCode: string) {

        const codeSection: HTMLElement | null = document.getElementById("code");
        if (codeSection instanceof HTMLTextAreaElement) {
            codeSection.value = startingCode;
        }
    }

    public initializeDemo(model: Model, vertexShaderCode: string, fragmentShaderCode: string) {

        const canvas: HTMLElement | null = document.getElementById("webGLCanvas");

        if (canvas instanceof HTMLCanvasElement) {

            const gl: WebGLRenderingContext | null = canvas.getContext("webgl");

            if (gl instanceof WebGLRenderingContext) {

                gl.clearColor(0.2, 0.2, 0.2, 1.0);
                gl.enable(gl.DEPTH_TEST);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.viewport(0, 0, canvas.width, canvas.height);

                this.host = new WebGlHost(gl, model.vertices, model.indices, vertexShaderCode, fragmentShaderCode, "lighting");
                this.host.bindPositionAndNormal();
                this.host.startRotationLoop();
            }
        }
    }
}

const vertexShaderCode: string =
    'attribute vec3 a_position;\r\n' +
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

const fragmentShaderCode: string =
    'precision mediump float;\r\n\r\n' +
    'varying vec3 v_normal;\r\n\r\n' +
    'void main(void) {\r\n' +
    ' gl_FragColor = vec4(v_normal * 0.5 + 0.5, 1.0);\r\n' +
    '}';

    
const bunnyModel: Model = GetBunnyModel();
const parcel = new CodeParcel(vertexShaderCode, fragmentShaderCode, fragmentShaderCode);
new LightingDemo(bunnyModel, parcel);

