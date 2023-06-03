import { WebGlHost } from "./webglhost.js";
export class PageLoader {
    static initialiseLightingTutorial(vertices, indices) {
        var vertexShaderCode = 'attribute vec3 a_position;\r\n' +
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
        var fragmentShaderCode = 'precision mediump float;\r\n\r\n' +
            'varying vec3 v_normal;\r\n\r\n' +
            'void main(void) {\r\n' +
            ' gl_FragColor = vec4(v_normal * 0.5 + 0.5, 1.0);\r\n' +
            '}';
        const codeSection = document.getElementById("code");
        if (codeSection && codeSection instanceof HTMLTextAreaElement) {
            codeSection.value = fragmentShaderCode;
            var host = new WebGlHost(vertices, indices, vertexShaderCode, fragmentShaderCode, "lighting");
            host.lightingPageBindShaders();
            host.startRotationLoop();
        }
    }
    static initialiseCameraTutorial(vertices, indices) {
        var vertexShaderCode = 'attribute vec3 a_position;\r\n' +
            'attribute vec3 a_normal;\r\n\r\n' +
            'uniform vec3 u_cameraPosition;\r\n\r\n' +
            'varying vec4 v_colour;\r\n\r\n' +
            'void main(void) {\r\n' +
            ' gl_Position = vec4(a_position, 1.0);\r\n' +
            ' v_colour = vec4(a_normal * 0.5 + 0.5, 1.0);\r\n' +
            '}';
        var fragmentShaderCode = 'precision mediump float;' +
            'varying vec4 v_colour;' +
            'void main(void) {' +
            ' gl_FragColor = v_colour;' +
            '}';
        const codeSection = document.getElementById("code");
        if (codeSection && codeSection instanceof HTMLTextAreaElement) {
            codeSection.value = vertexShaderCode;
            var host = new WebGlHost(vertices, indices, vertexShaderCode, fragmentShaderCode, "camera");
            host.cameraPageBindShaders();
            host.setupCameraMovement();
        }
    }
}
