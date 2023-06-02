var WebGlHost = /** @class */ (function () {
    function WebGlHost(verticesString, indicesString, vertexShaderCode, fragmentShaderCode, cameraPosition, pageString) {
        this.cameraPosition = [0.0, 0.0, 0.0];
        this.rotation = 0;
        this.verticesString = verticesString;
        this.indicesString = indicesString;
        this.vertexShaderCode = vertexShaderCode;
        this.fragmentShaderCode = fragmentShaderCode;
        this.cameraPosition = cameraPosition;
        this.pageString = pageString;
        this.initialiseWebGL();
        this.addButtonListener();
    }
    WebGlHost.prototype.initialiseWebGL = function () {
        var canvas = document.getElementById("webGLCanvas");
        if (canvas && canvas instanceof HTMLCanvasElement) {
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
    };
    WebGlHost.prototype.addButtonListener = function () {
        var _this = this;
        var button = document.getElementById("update-button");
        button === null || button === void 0 ? void 0 : button.addEventListener("click", function () {
            _this.clickEvent();
        });
    };
    WebGlHost.prototype.clickEvent = function () {
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
    };
    WebGlHost.prototype.renderCycle = function () {
        if (!this.gl) {
            return;
        }
        var gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    };
    WebGlHost.prototype.loadBuffers = function () {
        if (!this.gl) {
            return;
        }
        var gl = this.gl;
        var vertices = this.verticesString.split(',');
        var vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.indices = this.indicesString.split(',');
        var Index_Buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        /*======= Associating shaders to buffer objects =======*/
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    };
    WebGlHost.prototype.loadShaders = function () {
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
    };
    WebGlHost.prototype.bind_a_position = function () {
        if (!this.gl) {
            return;
        }
        var gl = this.gl;
        if (!this.shaderProgram) {
            return;
        }
        var coord = gl.getAttribLocation(this.shaderProgram, "a_position");
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 6 * 4, 0);
        gl.enableVertexAttribArray(coord);
        this.renderCycle();
    };
    WebGlHost.prototype.bind_a_normal = function () {
        if (!this.gl) {
            return;
        }
        var gl = this.gl;
        if (!this.shaderProgram) {
            return;
        }
        var coord = gl.getAttribLocation(this.shaderProgram, "a_normal");
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
        gl.enableVertexAttribArray(coord);
        this.renderCycle();
    };
    WebGlHost.prototype.bind_a_colour = function () {
        if (!this.gl) {
            return;
        }
        var gl = this.gl;
        if (!this.shaderProgram) {
            return;
        }
        var coord = gl.getAttribLocation(this.shaderProgram, "a_colour");
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
        gl.enableVertexAttribArray(coord);
    };
    WebGlHost.prototype.updateSimpleCameraPosition = function () {
        if (!this.gl) {
            return;
        }
        var gl = this.gl;
        if (!this.shaderProgram) {
            return;
        }
        var uCamPosLocation = gl.getUniformLocation(this.shaderProgram, "u_cameraPosition");
        gl.uniform3f(uCamPosLocation, this.cameraPosition[0], this.cameraPosition[1], this.cameraPosition[2]);
    };
    WebGlHost.prototype.updateCameraPositionOnKeyUp = function (event) {
        if (this.moveCamera(event.key)) {
            this.updateSimpleCameraPosition();
        }
        this.renderCycle();
    };
    WebGlHost.prototype.moveCamera = function (key) {
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
    };
    WebGlHost.prototype.reloadPixelShader = function () {
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
        var codeElement = document.getElementById("code");
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
    };
    WebGlHost.prototype.getCodeSnippet = function () {
        var codeSection = document.getElementById("code");
        if (codeSection && codeSection instanceof HTMLTextAreaElement) {
            return codeSection.value;
        }
        return "";
    };
    WebGlHost.prototype.reloadVertexShader = function () {
        if (!this.gl) {
            return;
        }
        var gl = this.gl;
        var vertexShaderCode = this.getCodeSnippet();
        var vertShader = gl.createShader(gl.VERTEX_SHADER);
        if (!vertShader) {
            return;
        }
        gl.shaderSource(vertShader, vertexShaderCode);
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
        // nothing was here before as it was calling plainly BindShaders() which doesnt exist
        // cameraPageBindShaders();
        var uCamPosLocation = gl.getUniformLocation(this.shaderProgram, "u_cameraPosition");
        gl.uniform3f(uCamPosLocation, this.cameraPosition[0], this.cameraPosition[1], this.cameraPosition[2]
        //, this.cameraPosition[3]
        );
        this.renderCycle();
    };
    WebGlHost.prototype.cameraPageBindShaders = function () {
        this.bind_a_position();
        this.bind_a_normal();
        this.renderCycle();
    };
    WebGlHost.prototype.lightingPageBindShaders = function () {
        this.bind_a_position();
        this.bind_a_normal();
        this.renderCycle();
    };
    WebGlHost.prototype.loadingPageBindShaders = function () {
        this.bind_a_position();
        this.bind_a_colour();
        this.renderCycle();
    };
    WebGlHost.prototype.reloadBuffers = function () {
        this.verticesString = this.getCodeSnippet();
        this.loadBuffers();
        this.loadingPageBindShaders();
    };
    WebGlHost.prototype.setupCameraMovement = function () {
        var _this = this;
        document.addEventListener('keyup', function (event) {
            _this.updateCameraPositionOnKeyUp(event);
        }, false);
    };
    WebGlHost.prototype.startRotationLoop = function () {
        var _this = this;
        window.requestAnimationFrame(function () { _this.updateRotation(); });
    };
    WebGlHost.prototype.updateRotation = function () {
        var _this = this;
        if (this.gl) {
            var gl = this.gl;
            if (this.shaderProgram) {
                var uRotationLocation = gl.getUniformLocation(this.shaderProgram, "u_rotation");
                gl.uniform1f(uRotationLocation, this.rotation);
                this.rotation = this.rotation + 0.01;
                if (this.rotation > 6.28) {
                    this.rotation = this.rotation - 6.28;
                }
            }
        }
        this.renderCycle();
        window.requestAnimationFrame(function () { _this.updateRotation(); });
    };
    return WebGlHost;
}());
var PageBuilder = /** @class */ (function () {
    function PageBuilder() {
    }
    PageBuilder.getHeader = function (page) {
        var header = '\
        <div id="wrapper">\
            <h1 style=\"padding:15px;">Code Along at https://tinyurl.com/ct5nrhtd</h1>\
            <div id="nav">\
            <ul>';
        var links = new Array("Setting the Scene", "index.html", "Graphics Pipeline", "pipeline.html", "Loading Data", "loading.html", "Camera Control", "camera.html", "Lighting", "lighting.html");
        for (var i = links.length - 2; i >= 0; i -= 2) {
            header = header + '<li';
            if (links[i + 1] == page) {
                header = header + ' class="selected"';
            }
            header = header + '>\
                <a href="' + links[i + 1] + '">' + links[i] + '</a>\
                </li>';
        }
        header = header + '\
            </ul>\
            </div>\
            <div id="content">';
        return header;
    };
    PageBuilder.writeHeaderAndCanvas = function (page) {
        document.write(this.getHeader(page));
        document.write("<canvas width = \"500\" height = \"500\" id = \"webGLCanvas\"></canvas>");
        this.writeForm();
    };
    PageBuilder.writePlainHeader = function (page) {
        document.write(this.getHeader(page));
    };
    PageBuilder.writeForm = function () {
        var formText = '\
        <form action="javascript: donothing()">\
            <textarea id="code" name="vs" rows="15" cols="50"></textarea>\
                <input type="submit" value="Update" id="update-button">\
        </form>';
        document.write(formText);
    };
    PageBuilder.writeFooter = function () {
        var footerDiv = '</div><div id="footer"><p><b>Simon Grey</b> - <i>S.Grey@hull.ac.uk</i></p></div></div>';
        document.write(footerDiv);
    };
    return PageBuilder;
}());
var PageLoader = /** @class */ (function () {
    function PageLoader() {
    }
    PageLoader.initialiseLightingTutorial = function (bunnyVerticesString, bunnyIndicesString) {
        var verticesString = bunnyVerticesString;
        var indicesString = bunnyIndicesString;
        var cameraPosition = [0.0, 0.0, 0.0];
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
        var codeSection = document.getElementById("code");
        if (codeSection && codeSection instanceof HTMLTextAreaElement) {
            codeSection.value = fragmentShaderCode;
            var host = new WebGlHost(verticesString, indicesString, vertexShaderCode, fragmentShaderCode, cameraPosition, "lighting");
            host.lightingPageBindShaders();
            host.startRotationLoop();
            // window.requestAnimationFrame(host.updateRotation);
        }
    };
    PageLoader.initialiseCameraTutorial = function (sphereVerticesString, sphereIndicesString) {
        var verticesString = sphereVerticesString;
        var indicesString = sphereIndicesString;
        var cameraPosition = [0.0, 0.0, 0.0];
        // temporary assignment below for personal testing
        var vertexShaderCode = 'attribute vec3 a_position;\r\n' +
            'attribute vec3 a_normal;\r\n\r\n' +
            'uniform vec3 u_cameraPosition;\r\n\r\n' +
            'varying vec4 v_colour;\r\n\r\n' +
            'void main(void) {\r\n' +
            ' gl_Position = vec4(a_position - u_cameraPosition, 1.0);\r\n' +
            ' v_colour = vec4(a_normal * 0.5 + 0.5, 1.0);\r\n' +
            '}';
        var fragmentShaderCode = 'precision mediump float;' +
            'varying vec4 v_colour;' +
            'void main(void) {' +
            ' gl_FragColor = v_colour;' +
            '}';
        var codeSection = document.getElementById("code");
        if (codeSection && codeSection instanceof HTMLTextAreaElement) {
            codeSection.value = vertexShaderCode;
            var host = new WebGlHost(verticesString, indicesString, vertexShaderCode, fragmentShaderCode, cameraPosition, "camera");
            host.cameraPageBindShaders();
            host.setupCameraMovement();
        }
    };
    PageLoader.initialiseVBOTutorial = function (verticesString, indicesString) {
        // camera pos doesnt change for this example
        var cameraPosition = [0.0, 0.0, 0.0];
        var vertexShaderCode = 'attribute vec3 a_position;' +
            'attribute vec3 a_colour;' +
            'varying vec4 v_colour;' +
            'void main(void) {' +
            ' gl_Position = vec4(a_position, 1.0);' +
            ' v_colour = vec4(a_colour, 1.0);' +
            '}';
        var fragmentShaderCode = 'precision mediump float;' +
            'varying vec4 v_colour;' +
            'void main(void) {' +
            ' gl_FragColor = v_colour;' +
            '}';
        var codeSection = document.getElementById("code");
        if (codeSection && codeSection instanceof HTMLTextAreaElement) {
            codeSection.value = verticesString;
            var host = new WebGlHost(verticesString, indicesString, vertexShaderCode, fragmentShaderCode, cameraPosition, "loading");
            host.loadingPageBindShaders();
        }
    };
    return PageLoader;
}());
