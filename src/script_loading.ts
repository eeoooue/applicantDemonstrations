
import { CodeParcel } from "./code_parcel.js";
import { GetTriangleModel } from "./models/triangle.js";
import { DemoBuilder } from "./demo_builder.js";

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
new DemoBuilder(triangleModel, parcel, "loading");
