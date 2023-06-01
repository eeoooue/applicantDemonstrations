
function initialiseCameraTutorial() {
	verticesString = sphereVerticesString;
	indicesString = sphereIndicesString;
	cameraPosition = [0.0, 0.0, 0.0];
	vertexShaderCode =
		'attribute vec3 a_position;\r\n' +
		'attribute vec3 a_normal;\r\n\r\n' +
		'uniform vec3 u_cameraPosition;\r\n\r\n' +
		'varying vec4 v_colour;\r\n\r\n' +
		'void main(void) {\r\n' +
		' gl_Position = vec4(a_position, 1.0);\r\n' +
		' v_colour = vec4(a_normal * 0.5 + 0.5, 1.0);\r\n' +
		'}';


	// temporary assignment below for personal testing
	vertexShaderCode =
		'attribute vec3 a_position;\r\n' +
		'attribute vec3 a_normal;\r\n\r\n' +
		'uniform vec3 u_cameraPosition;\r\n\r\n' +
		'varying vec4 v_colour;\r\n\r\n' +
		'void main(void) {\r\n' +
		' gl_Position = vec4(a_position - u_cameraPosition, 1.0);\r\n' +
		' v_colour = vec4(a_normal * 0.5 + 0.5, 1.0);\r\n' +
		'}';


	document.getElementById("code").value = vertexShaderCode;
	fragmentShaderCode =
		'precision mediump float;' +
		'varying vec4 v_colour;' +
		'void main(void) {' +
		' gl_FragColor = v_colour;' +
		'}';

	document.getElementById("code").value = vertexShaderCode;
	initialiseWebGL();
	cameraPageBindShaders();
	document.addEventListener('keyup', updateCameraPositionOnKeyUp, false);
}



function reloadVertexShader() {

    vertexShaderCode = document.getElementById("code").value;
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertexShaderCode);
    gl.compileShader(vertShader);

	// I commented this out because fragmentShaderCode never changes (?)
    // var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    // gl.shaderSource(fragShader, fragmentShaderCode);
    // gl.compileShader(fragShader);
    shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

	// nothing was here before
	// cameraPageBindShaders();

    var uCamPosLocation = gl.getUniformLocation(shaderProgram, "u_cameraPosition");
    gl.uniform3f(uCamPosLocation,
        cameraPosition[0],
        cameraPosition[1],
        cameraPosition[2],
        cameraPosition[3]);

    render();
}



function cameraPageBindShaders(){

    bind_a_position();
    bind_a_normal();
    render();
}