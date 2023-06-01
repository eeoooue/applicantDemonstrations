
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
	document.getElementById("code").value = vertexShaderCode;
	fragmentShaderCode =
		'precision mediump float;' +
		'varying vec4 v_colour;' +
		'void main(void) {' +
		' gl_FragColor = v_colour;' +
		'}';
	document.getElementById("code").value = vertexShaderCode;
	initialiseWebGL();
	bindShaders2();
	document.addEventListener('keyup', onSimpleKeyUp, false);
}
