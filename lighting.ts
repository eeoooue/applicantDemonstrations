



class WebGlHost {

    public gl: WebGLRenderingContext | null;
    public verticesString;
    public indicesString;
    public vertexShaderCode;
    public fragmentShaderCode;
    public cameraPosition: number[] = [0.0, 0.0, 0.0];
    public rotation = 0;
    public indices;
    public shaderProgram: WebGLProgram | null;

    constructor(verticesString, indicesString, vertexShaderCode, fragmentShaderCode, cameraPosition) {

        this.verticesString = verticesString;
        this.indicesString = indicesString;
        this.vertexShaderCode = vertexShaderCode;
        this.fragmentShaderCode = fragmentShaderCode;
        this.cameraPosition = cameraPosition;


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

    updateCameraPositionOnKeyUp(event: KeyboardEvent) {

        if (this.moveCamera(event.key)){
            this.updateSimpleCameraPosition();
        }
        this.render();
    }

    moveCamera(key: string) : boolean {

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

    reloadPixelShader() : void {

        if (!this.gl) {
            return;
        }

        var gl: WebGLRenderingContext = this.gl;

    
        var vertShader = gl.createShader(gl.VERTEX_SHADER);
        if (!vertShader){
            return;
        }
        
        gl.shaderSource(vertShader, this.vertexShaderCode);
        gl.compileShader(vertShader);

        const codeElement: HTMLElement | null = document.getElementById("code");

        if (!codeElement || !(codeElement instanceof HTMLTextAreaElement)){
            return;
        } 
        
        var fragmentShaderCode = codeElement.value;

        var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

        if (!fragShader){
            return;
        }

        gl.shaderSource(fragShader, fragmentShaderCode);
        gl.compileShader(fragShader);

        if (!fragShader){
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
        this.render();
    }

    lightingPageBindShaders(){

        this.bind_a_position();
        this.bind_a_normal();
        this.render();
    }
    
}






function initialiseLightingTutorial(bunnyVerticesString: string, bunnyIndicesString: string) {

    const verticesString = bunnyVerticesString;
    const indicesString = bunnyIndicesString;
    var cameraPosition: number[] = [0.0, 0.0, 0.0];
    var vertexShaderCode: string =
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


    var fragmentShaderCode: string =
        'precision mediump float;\r\n\r\n' +
        'varying vec3 v_normal;\r\n\r\n' +
        'void main(void) {\r\n' +
        ' gl_FragColor = vec4(v_normal * 0.5 + 0.5, 1.0);\r\n' +
        '}';



    const codeSection : HTMLElement | null = document.getElementById("code");

    if (codeSection && codeSection instanceof HTMLTextAreaElement){

        codeSection.value = fragmentShaderCode;
        var host = new WebGlHost(verticesString, indicesString, vertexShaderCode, fragmentShaderCode, cameraPosition);
        host.lightingPageBindShaders();
        window.requestAnimationFrame(host.update);
    }
}





