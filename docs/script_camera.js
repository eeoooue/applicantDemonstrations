import { CodeParcel } from "./code_parcel.js";
import { GetSphereModel } from "./models/sphere.js";
import { DemoBuilder } from "./demo_builder.js";
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
new DemoBuilder(sphereModel, parcel, "camera");
