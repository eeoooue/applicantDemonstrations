export class WebGlHost {
    constructor(vertices, indices, vertexShaderCode, fragmentShaderCode, pageString) {
        this.cameraPosition = [0.0, 0.0, 0.0];
        this.rotation = 0;
        this.vertices = vertices;
        this.indices = indices;
        this.vertexShaderCode = vertexShaderCode;
        this.fragmentShaderCode = fragmentShaderCode;
        this.pageString = pageString;
        this.initialiseWebGL();
        this.addButtonListener();
    }
    initialiseWebGL() {
        const canvas = document.getElementById("webGLCanvas");
        if (canvas instanceof HTMLCanvasElement) {
            this.gl = canvas.getContext("webgl");
            if (!this.gl) {
                return;
            }
            var gl = this.gl;
            gl.clearColor(0.2, 0.2, 0.2, 1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.viewport(0, 0, canvas.width, canvas.height);
            this.loadBuffers();
            this.loadShaders();
        }
    }
    addButtonListener() {
        var button = document.getElementById("update-button");
        button === null || button === void 0 ? void 0 : button.addEventListener("click", () => {
            this.clickEvent();
        });
    }
    clickEvent() {
        switch (this.pageString) {
            case "loading":
                this.reloadBuffers();
                return;
            case "camera":
                this.reloadVertexShader();
                return;
            case "lighting":
                this.reloadPixelShader();
                return;
        }
    }
    renderCycle() {
        if (!this.gl) {
            return;
        }
        var gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }
    toNumArray(strings) {
        var ans = new Array();
        strings.forEach(function (s) {
            ans.push(+s);
        });
        return ans;
    }
    loadBuffers() {
        if (!this.gl) {
            return;
        }
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
    loadShaders() {
        if (!this.gl) {
            return;
        }
        var gl = this.gl;
        var vertShader = gl.createShader(gl.VERTEX_SHADER);
        if (!vertShader) {
            return;
        }
        gl.shaderSource(vertShader, this.vertexShaderCode);
        gl.compileShader(vertShader);
        var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (!fragShader) {
            return;
        }
        gl.shaderSource(fragShader, this.fragmentShaderCode);
        gl.compileShader(fragShader);
        this.shaderProgram = gl.createProgram();
        if (!this.shaderProgram) {
            return;
        }
        gl.attachShader(this.shaderProgram, vertShader);
        gl.attachShader(this.shaderProgram, fragShader);
        gl.linkProgram(this.shaderProgram);
        gl.useProgram(this.shaderProgram);
    }
    updateSimpleCameraPosition() {
        if (!this.gl) {
            return;
        }
        var gl = this.gl;
        if (!this.shaderProgram) {
            return;
        }
        var uCamPosLocation = gl.getUniformLocation(this.shaderProgram, "u_cameraPosition");
        gl.uniform3f(uCamPosLocation, this.cameraPosition[0], this.cameraPosition[1], this.cameraPosition[2]);
    }
    updateCameraPositionOnKeyUp(event) {
        if (this.moveCamera(event.key)) {
            this.updateSimpleCameraPosition();
        }
        this.renderCycle();
    }
    moveCamera(key) {
        if (key == 'd') {
            this.cameraPosition[0] = this.cameraPosition[0] + 0.05;
            return true;
        }
        else if (key == 'a') {
            this.cameraPosition[0] = this.cameraPosition[0] - 0.05;
            return true;
        }
        else if (key == 'w') {
            this.cameraPosition[1] = this.cameraPosition[1] + 0.05;
            return true;
        }
        else if (key == 's') {
            this.cameraPosition[1] = this.cameraPosition[1] - 0.05;
            return true;
        }
        return false;
    }
    reloadPixelShader() {
        if (!this.gl) {
            return;
        }
        var gl = this.gl;
        var vertShader = gl.createShader(gl.VERTEX_SHADER);
        if (!vertShader) {
            return;
        }
        gl.shaderSource(vertShader, this.vertexShaderCode);
        gl.compileShader(vertShader);
        const codeElement = document.getElementById("code");
        if (!codeElement || !(codeElement instanceof HTMLTextAreaElement)) {
            return;
        }
        var fragmentShaderCode = codeElement.value;
        var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (!fragShader) {
            return;
        }
        gl.shaderSource(fragShader, fragmentShaderCode);
        gl.compileShader(fragShader);
        if (!fragShader) {
            return;
        }
        this.shaderProgram = gl.createProgram();
        if (!this.shaderProgram) {
            return;
        }
        gl.attachShader(this.shaderProgram, vertShader);
        gl.attachShader(this.shaderProgram, fragShader);
        gl.linkProgram(this.shaderProgram);
        gl.useProgram(this.shaderProgram);
        this.lightingPageBindShaders();
        this.renderCycle();
    }
    getCodeSnippet() {
        const codeSection = document.getElementById("code");
        if (codeSection && codeSection instanceof HTMLTextAreaElement) {
            return codeSection.value;
        }
        return "";
    }
    reloadVertexShader() {
        if (!this.gl) {
            return;
        }
        var gl = this.gl;
        this.shaderProgram = gl.createProgram();
        if (!this.shaderProgram) {
            return;
        }
        var vertexShaderCode = this.getCodeSnippet();
        const vertShader = gl.createShader(gl.VERTEX_SHADER);
        if (!vertShader) {
            return;
        }
        gl.shaderSource(vertShader, vertexShaderCode);
        gl.compileShader(vertShader);
        const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (!fragShader) {
            return;
        }
        gl.shaderSource(fragShader, this.fragmentShaderCode);
        gl.compileShader(fragShader);
        gl.attachShader(this.shaderProgram, vertShader);
        gl.attachShader(this.shaderProgram, fragShader);
        gl.linkProgram(this.shaderProgram);
        gl.useProgram(this.shaderProgram);
        var uCamPosLocation = gl.getUniformLocation(this.shaderProgram, "u_cameraPosition");
        gl.uniform3f(uCamPosLocation, this.cameraPosition[0], this.cameraPosition[1], this.cameraPosition[2]);
        this.renderCycle();
    }
    bindAttribute(attributeName, offset) {
        if (!this.gl || !this.shaderProgram) {
            return;
        }
        var gl = this.gl;
        var coord = gl.getAttribLocation(this.shaderProgram, attributeName);
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 6 * 4, offset);
        gl.enableVertexAttribArray(coord);
    }
    loadingPageBindShaders() {
        this.bindAttribute("a_position", 0);
        this.bindAttribute("a_colour", 3 * 4);
        this.renderCycle();
    }
    cameraPageBindShaders() {
        this.bindAttribute("a_position", 0);
        this.bindAttribute("a_normal", 3 * 4);
        this.renderCycle();
    }
    lightingPageBindShaders() {
        this.bindAttribute("a_position", 0);
        this.bindAttribute("a_normal", 3 * 4);
        this.renderCycle();
    }
    reloadBuffers() {
        var textAreaContent = this.getCodeSnippet();
        this.vertices = this.toNumArray(textAreaContent.split(","));
        this.loadBuffers();
        this.loadingPageBindShaders();
    }
    setupCameraMovement() {
        document.addEventListener('keyup', (event) => {
            this.updateCameraPositionOnKeyUp(event);
        }, false);
    }
    startRotationLoop() {
        window.requestAnimationFrame(() => { this.updateRotation(); });
    }
    updateRotation() {
        if (this.gl) {
            var gl = this.gl;
            if (this.shaderProgram) {
                var uRotationLocation = gl.getUniformLocation(this.shaderProgram, "u_rotation");
                gl.uniform1f(uRotationLocation, this.rotation);
                this.rotation = (this.rotation + 0.01) % 6.28;
            }
        }
        this.renderCycle();
        window.requestAnimationFrame(() => { this.updateRotation(); });
    }
}
