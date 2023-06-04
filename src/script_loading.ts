
import { WebGlHost } from "./webglhost.js";
import { GetTriangleModel } from "./models/triangle.js";
import { Model } from "./model.js";
import { CodeParcel } from "./code_parcel.js";

export class LoadingDemo {

    public host: WebGlHost | undefined;

    constructor(model: Model, parcel: CodeParcel) {

        this.initializeDemo(model, parcel.vertexShaderCode, parcel.fragmentShaderCode, "loading");
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

                this.host = new WebGlHost(gl, model.vertices, model.indices, vertexShaderCode, fragmentShaderCode, pageTitle);
                this.host.loadingPageBindShaders();
            }
        }
    }
}


const vertexShaderCode: string =
    'attribute vec3 a_position;' +
    'attribute vec3 a_colour;' +
    'varying vec4 v_colour;' +
    'void main(void) {' +
    ' gl_Position = vec4(a_position, 1.0);' +
    ' v_colour = vec4(a_colour, 1.0);' +
    '}';

const fragmentShaderCode: string =
    'precision mediump float;' +
    'varying vec4 v_colour;' +
    'void main(void) {' +
    ' gl_FragColor = v_colour;' +
    '}';

const startingCode: string = "0.0, 0.75, 0.0, 1.0, 0.0, 0.0,-0.75, -0.75, 0.0, 0.0, 1.0, 0.0, 0.75, -0.75, 0.0, 0.0, 0.0, 1.0";


const parcel = new CodeParcel(vertexShaderCode, fragmentShaderCode, startingCode);
const triangleModel = GetTriangleModel();
new LoadingDemo(triangleModel, parcel);