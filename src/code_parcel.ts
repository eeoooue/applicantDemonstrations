
export class CodeParcel {

    public vertexShaderCode: string;
    public fragmentShaderCode: string;
    public startingCode: string;

    constructor(vertexShaderCode: string, fragmentShaderCode: string, startingCode: string){

        this.vertexShaderCode = vertexShaderCode;
        this.fragmentShaderCode = fragmentShaderCode;
        this.startingCode = startingCode;
    }
}