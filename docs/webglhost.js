export class WebGlHost {
    constructor(webGl, model, vertexShaderCode, fragmentShaderCode) {
        this.cameraPosition = [0.0, 0.0, 0.0];
        this.gl = webGl;
        this.vertices = model.vertices;
        this.indices = model.indices;
        this.vertexShaderCode = vertexShaderCode;
        this.fragmentShaderCode = fragmentShaderCode;
        this.loadBuffers();
        this.loadShaders();
        this.addButtonListener();
        this.onloadHook();
    }
    onloadHook() { }
    addButtonListener() {
        var button = document.getElementById("update-button");
        button === null || button === void 0 ? void 0 : button.addEventListener("click", () => {
            this.clickEvent();
        });
    }
    renderCycle() {
        var gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }
    loadBuffers() {
        var gl = this.gl;
        var vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        var Index_Buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        /*======= Associating shaders to buffer objects =======*/
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    }
    setupShaderProgram(vertShader, fragShader) {
        if (!this.shaderProgram) {
            return;
        }
        var gl = this.gl;
        gl.attachShader(this.shaderProgram, vertShader);
        gl.attachShader(this.shaderProgram, fragShader);
        gl.linkProgram(this.shaderProgram);
        gl.useProgram(this.shaderProgram);
    }
    loadShaders() {
        var gl = this.gl;
        const vertShader = this.compileShader(gl.VERTEX_SHADER, this.vertexShaderCode);
        const fragShader = this.compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderCode);
        this.shaderProgram = gl.createProgram();
        if (!vertShader || !fragShader) {
            return;
        }
        this.setupShaderProgram(vertShader, fragShader);
    }
    compileShader(type, shaderCode) {
        var gl = this.gl;
        const shader = gl.createShader(type);
        if (shader) {
            gl.shaderSource(shader, shaderCode);
            gl.compileShader(shader);
            return shader;
        }
    }
    getCodeSnippet() {
        const codeSection = document.getElementById("code");
        if (codeSection && codeSection instanceof HTMLTextAreaElement) {
            return codeSection.value;
        }
        return "";
    }
    loadingPageBindShaders() {
        this.bindAttribute("a_position", 0);
        this.bindAttribute("a_colour", 3 * 4);
        this.renderCycle();
    }
    bindPositionAndNormal() {
        this.bindAttribute("a_position", 0);
        this.bindAttribute("a_normal", 3 * 4);
        this.renderCycle();
    }
    bindAttribute(attributeName, offset) {
        if (!this.shaderProgram) {
            return;
        }
        var gl = this.gl;
        var coord = gl.getAttribLocation(this.shaderProgram, attributeName);
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 6 * 4, offset);
        gl.enableVertexAttribArray(coord);
    }
}
