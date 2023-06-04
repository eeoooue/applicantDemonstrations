import { Model } from "./model";

export abstract class WebGlHost {

    public gl: WebGLRenderingContext;

    public vertices: number[];
    public indices: number[];

    public vertexShaderCode: string;
    public fragmentShaderCode: string;
    public cameraPosition: number[] = [0.0, 0.0, 0.0];
    
    public shaderProgram: WebGLProgram | undefined | null;

    constructor(webGl: WebGLRenderingContext, model: Model, vertexShaderCode: string, fragmentShaderCode: string) {

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

    public onloadHook(): void { }

    abstract clickEvent(): void;

    public addButtonListener(): void {

        var button = document.getElementById("update-button")
        button?.addEventListener("click", () => {
            this.clickEvent();
        })
    }

    public renderCycle(): void {

        var gl: WebGLRenderingContext = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }

    loadBuffers(): void {

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

    setupShaderProgram(vertShader: WebGLShader, fragShader: WebGLShader) {

        if (!this.shaderProgram) {
            return;
        }

        var gl: WebGLRenderingContext = this.gl;

        gl.attachShader(this.shaderProgram, vertShader);
        gl.attachShader(this.shaderProgram, fragShader);
        gl.linkProgram(this.shaderProgram);
        gl.useProgram(this.shaderProgram);
    }


    loadShaders(): void {

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

        var gl: WebGLRenderingContext = this.gl;
        const shader: WebGLShader | null = gl.createShader(type);
        if (shader) {
            gl.shaderSource(shader, shaderCode);
            gl.compileShader(shader);
            return shader;
        }
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

    bindAttribute(attributeName: string, offset: number) {

        if (!this.shaderProgram) {
            return;
        }

        var gl: WebGLRenderingContext = this.gl;
        var coord = gl.getAttribLocation(this.shaderProgram, attributeName);
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 6 * 4, offset);
        gl.enableVertexAttribArray(coord);
    }
}
