










var gl;
var verticesString;
var indicesString;
var vertexShaderCode;
var fragmentShaderCode;
var cameraPosition;
var rotation = 0;
var indices;



function initialiseWebGL() {
    canvas = document.getElementById("webGLCanvas");
    gl = canvas.getContext("webgl");
    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
    loadBuffers();
    loadShaders();
}



function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}



function loadBuffers() {
    var vertices = verticesString.split(',');
    [
        0.0, 0.75, 0.0, 1.0, 0.0, 0.0,
        -0.75, -0.75, 0.0, 0.0, 1.0, 0.0,
        0.75, -0.75, 0.0, 0.0, 0.0, 1.0
    ];

    indices = indicesString.split(',');

    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var Index_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    /*======= Associating shaders to buffer objects =======*/

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
}




function loadShaders() {

    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertexShaderCode);
    gl.compileShader(vertShader);

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragmentShaderCode);
    gl.compileShader(fragShader);


    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
}


function bind_a_position(){

    var coord = gl.getAttribLocation(shaderProgram, "a_position");
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 6 * 4, 0);
    gl.enableVertexAttribArray(coord);
}

function bind_a_normal(){

    var coord = gl.getAttribLocation(shaderProgram, "a_normal");
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
    gl.enableVertexAttribArray(coord);
}
