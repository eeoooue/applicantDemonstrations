

class WebGlHost {

    public gl: WebGLRenderingContext | null;
    public verticesString;
    public indicesString;
    public vertexShaderCode;
    public fragmentShaderCode;
    public cameraPosition;
    public rotation = 0;
    public indices;
    public shaderProgram: WebGLProgram | null;

    constructor(verticesString, indicesString, vertexShaderCode, fragmentShaderCode) {

        this.verticesString = verticesString;
        this.indicesString = indicesString;
        this.vertexShaderCode = vertexShaderCode;
        this.fragmentShaderCode = fragmentShaderCode;


        this.initialiseWebGL();
    }


    private initialiseWebGL(): void {

        const canvas: HTMLElement | null = document.getElementById("webGLCanvas");

        if (canvas && canvas instanceof HTMLCanvasElement) {

            this.gl = canvas.getContext("webgl");

            if (!this.gl) {
                return;
            }

            var gl: WebGLRenderingContext = this.gl;

            gl.clearColor(0.2, 0.2, 0.2, 1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.viewport(0, 0, canvas.width, canvas.height);
            this.loadBuffers();
            this.loadShaders();
        }
    }

    render(): void {

        if (!this.gl) {
            return;
        }

        var gl: WebGLRenderingContext = this.gl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }

    loadBuffers(): void {

        if (!this.gl) {
            return;
        }

        var gl: WebGLRenderingContext = this.gl;

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
    }

    loadShaders(): void {

        if (!this.gl) {
            return;
        }

        var gl: WebGLRenderingContext = this.gl;



        var vertShader: WebGLShader | null = gl.createShader(gl.VERTEX_SHADER);

        if (!vertShader) {
            return;
        }

        gl.shaderSource(vertShader, this.vertexShaderCode);
        gl.compileShader(vertShader);

        var fragShader: WebGLShader | null = gl.createShader(gl.FRAGMENT_SHADER);

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


    update() {

        if (this.gl) {

            var gl: WebGLRenderingContext = this.gl;

            if (this.shaderProgram) {

                var uRotationLocation = gl.getUniformLocation(this.shaderProgram, "u_rotation");
                gl.uniform1f(uRotationLocation, this.rotation);
                this.rotation = this.rotation + 0.01;
                if (this.rotation > 6.28) {
                    this.rotation = this.rotation - 6.28;
                }
            }
        }

        this.render();

        requestAnimationFrame(this.update);
    }



    bind_a_position(): void {

        if (!this.gl) {
            return;
        }

        var gl: WebGLRenderingContext = this.gl;

        if (!this.shaderProgram) {
            return;
        }

        var coord = gl.getAttribLocation(this.shaderProgram, "a_position");
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 6 * 4, 0);
        gl.enableVertexAttribArray(coord);
        this.render();
    }

    bind_a_normal(): void {

        if (!this.gl) {
            return;
        }

        var gl: WebGLRenderingContext = this.gl;

        if (!this.shaderProgram) {
            return;
        }

        var coord = gl.getAttribLocation(this.shaderProgram, "a_normal");
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
        gl.enableVertexAttribArray(coord);
        this.render();
    }


    bind_a_colour() {

        if (!this.gl) {
            return;
        }

        var gl: WebGLRenderingContext = this.gl;

        if (!this.shaderProgram) {
            return;
        }

        var coord = gl.getAttribLocation(this.shaderProgram, "a_colour");
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
        gl.enableVertexAttribArray(coord);
    }

    updateSimpleCameraPosition() {

        if (!this.gl) {
            return;
        }

        var gl: WebGLRenderingContext = this.gl;

        if (!this.shaderProgram) {
            return;
        }

        var uCamPosLocation = gl.getUniformLocation(this.shaderProgram, "u_cameraPosition");
        gl.uniform3f(uCamPosLocation,
            this.cameraPosition[0],
            this.cameraPosition[1],
            this.cameraPosition[2]);
    }

    updateCameraPositionOnKeyUp(event) {

        if (this.moveCamera(event)){
            this.updateSimpleCameraPosition();
        }
        this.render();
    }

    moveCamera(event) : boolean {

        if (event.key == 'd') {
            this.cameraPosition[0] = this.cameraPosition[0] + 0.05;
            return true;
        }
        else if (event.key == 'a') {
            this.cameraPosition[0] = this.cameraPosition[0] - 0.05;
            return true;
        }
        else if (event.key == 'w') {
            this.cameraPosition[1] = this.cameraPosition[1] + 0.05;
            return true;
        }
        else if (event.key == 's') {
            this.cameraPosition[1] = this.cameraPosition[1] - 0.05;
            return true;
        }
        
        return false;
    }
}



