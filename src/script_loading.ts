

import { WebGlHost } from "./webglhost.js";
import { TriangleModel } from "./models/triangle.js";

export class LoadingDemo {

    public vertexShaderCode: string =
        'attribute vec3 a_position;' +
        'attribute vec3 a_colour;' +
        'varying vec4 v_colour;' +
        'void main(void) {' +
        ' gl_Position = vec4(a_position, 1.0);' +
        ' v_colour = vec4(a_colour, 1.0);' +
        '}';

    public fragmentShaderCode: string =
        'precision mediump float;' +
        'varying vec4 v_colour;' +
        'void main(void) {' +
        ' gl_FragColor = v_colour;' +
        '}';

    public startingCode: string = "0.0, 0.75, 0.0, 1.0, 0.0, 0.0,-0.75, -0.75, 0.0, 0.0, 1.0, 0.0, 0.75, -0.75, 0.0, 0.0, 0.0, 1.0";

    public model: TriangleModel = new TriangleModel();

    constructor() {

        this.initializeDemo();
    }

    public initializeDemo() {

        const codeSection: HTMLElement | null = document.getElementById("code");
        const startingCode: string = "0.0, 0.75, 0.0, 1.0, 0.0, 0.0,-0.75, -0.75, 0.0, 0.0, 1.0, 0.0, 0.75, -0.75, 0.0, 0.0, 0.0, 1.0";

        if (codeSection && codeSection instanceof HTMLTextAreaElement) {

            codeSection.value = startingCode;
            var host = new WebGlHost(this.model.vertices, this.model.indices, this.vertexShaderCode, this.fragmentShaderCode, "loading");
            host.loadingPageBindShaders();
        }
    }
}


new LoadingDemo();