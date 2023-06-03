

export class WebGlHost {

    public gl: WebGLRenderingContext | undefined | null;

    public vertices: number[];
    public indices: number[];

    public vertexShaderCode: string;
    public fragmentShaderCode: string;
    public cameraPosition: number[] = [0.0, 0.0, 0.0];
    public rotation = 0;
    public shaderProgram: WebGLProgram | undefined | null;

    public pageString: string;

    constructor(vertices: number[], indices: number[], vertexShaderCode: string, fragmentShaderCode: string, pageString: string) {

        this.vertices = vertices;
        this.indices = indices;

        this.vertexShaderCode = vertexShaderCode;
        this.fragmentShaderCode = fragmentShaderCode;
        this.pageString = pageString;

        this.initialiseWebGL();
        this.addButtonListener();
    }

    private initialiseWebGL(): void {

        const canvas: HTMLElement | null = document.getElementById("webGLCanvas");

        if (canvas instanceof HTMLCanvasElement) {

            this.gl = canvas.getContext("webgl");

            if (this.gl) {
                var gl: WebGLRenderingContext = this.gl;

                gl.clearColor(0.2, 0.2, 0.2, 1.0);
                gl.enable(gl.DEPTH_TEST);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.viewport(0, 0, canvas.width, canvas.height);
                this.loadBuffers();
                this.loadShaders();
            }
        }
    }

    public addButtonListener(): void {

        var button = document.getElementById("update-button")

        button?.addEventListener("click", () => {
            this.clickEvent();
        })
    }

    public clickEvent(): void {

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

    public renderCycle(): void {

        if (!this.gl) {
            return;
        }

        var gl: WebGLRenderingContext = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }

    toNumArray(strings: string[]): number[] {

        var ans: number[] = new Array<number>();

        strings.forEach(function (s) {
            ans.push(+s);
        })

        return ans;
    }

    loadBuffers(): void {

        if (!this.gl) {
            return;
        }

        var gl: WebGLRenderingContext = this.gl;

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

    //#region shaderProgram

    setupShaderProgram(vertShader: WebGLShader, fragShader: WebGLShader) {

        if (!this.gl || !this.shaderProgram) {
            return;
        }

        var gl: WebGLRenderingContext = this.gl;

        gl.attachShader(this.shaderProgram, vertShader);
        gl.attachShader(this.shaderProgram, fragShader);
        gl.linkProgram(this.shaderProgram);
        gl.useProgram(this.shaderProgram);
    }


    loadShaders(): void {

        // this is always called by any webgl demo

        if (!this.gl) {
            return;
        }

        var gl: WebGLRenderingContext = this.gl;
        const vertShader = this.compileShader(gl.VERTEX_SHADER, this.vertexShaderCode);
        const fragShader = this.compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderCode);
        this.shaderProgram = gl.createProgram();

        if (!vertShader || !fragShader) {
            return;
        }

        this.setupShaderProgram(vertShader, fragShader);
    }

    compileShader(type: number, shaderCode: string): WebGLShader | undefined {

        if (!this.gl) {
            return;
        }

        var gl: WebGLRenderingContext = this.gl;
        const shader: WebGLShader | null = gl.createShader(type);
        if (shader) {
            gl.shaderSource(shader, shaderCode);
            gl.compileShader(shader);
            return shader;
        }
    }

    reloadBuffers() {

        // specific to loading page

        var textAreaContent = this.getCodeSnippet();
        this.vertices = this.toNumArray(textAreaContent.split(","));
        this.loadBuffers();
        this.loadingPageBindShaders();
    }

    reloadPixelShader(): void {

        // specific to lighting page 

        this.fragmentShaderCode = this.getCodeSnippet();
        this.loadShaders();
        this.bindPositionAndNormal();
        this.renderCycle();
    }

    reloadVertexShader() {

        // specific to camera page

        this.vertexShaderCode = this.getCodeSnippet();
        this.loadShaders();
        this.updateSimpleCameraPosition();
        this.renderCycle();
    }

    updateSimpleCameraPosition() {

        if (!this.gl || !this.shaderProgram) {
            return;
        }

        var gl: WebGLRenderingContext = this.gl;
        var uCamPosLocation = gl.getUniformLocation(this.shaderProgram, "u_cameraPosition");
        gl.uniform3f(uCamPosLocation, this.cameraPosition[0], this.cameraPosition[1], this.cameraPosition[2]);
    }

    public updateRotation() {

        if (this.gl && this.shaderProgram) {

            var gl: WebGLRenderingContext = this.gl;
            var uRotationLocation = gl.getUniformLocation(this.shaderProgram, "u_rotation");
            gl.uniform1f(uRotationLocation, this.rotation);
            this.rotation = (this.rotation + 0.01) % 6.28;
        }

        this.renderCycle();
        window.requestAnimationFrame(() => { this.updateRotation() });
    }

    bindAttribute(attributeName: string, offset: number) {

        if (!this.gl || !this.shaderProgram) {
            return;
        }

        var gl: WebGLRenderingContext = this.gl;
        var coord = gl.getAttribLocation(this.shaderProgram, attributeName);
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 6 * 4, offset);
        gl.enableVertexAttribArray(coord);
    }

    //#endregion


    public updateCameraPositionOnKeyUp(event: KeyboardEvent) {

        if (this.moveCamera(event.key)) {
            this.updateSimpleCameraPosition();
        }
        this.renderCycle();
    }

    public moveCamera(key: string): boolean {

        if (key == 'd') {
            this.cameraPosition[0] = this.cameraPosition[0] + 0.05;
        }
        else if (key == 'a') {
            this.cameraPosition[0] = this.cameraPosition[0] - 0.05;
        }
        else if (key == 'w') {
            this.cameraPosition[1] = this.cameraPosition[1] + 0.05;
        }
        else if (key == 's') {
            this.cameraPosition[1] = this.cameraPosition[1] - 0.05;
        }
        else {
            return false;
        }
        return true;
    }

    getCodeSnippet(): string {

        const codeSection: HTMLElement | null = document.getElementById("code");
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

    setupCameraMovement() {

        document.addEventListener('keyup', (event) => {
            this.updateCameraPositionOnKeyUp(event);
        }, false);
    }

    public startRotationLoop() {

        window.requestAnimationFrame(() => { this.updateRotation() });
    }
}

