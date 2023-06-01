function initialiseVBOTutorial()
{
	verticesString = "0.0, 0.75, 0.0, 1.0, 0.0, 0.0,-0.75, -0.75, 0.0, 0.0, 1.0, 0.0, 0.75, -0.75, 0.0, 0.0, 0.0, 1.0"
	indicesString = "0,1,2";
	vertexShaderCode =
            'attribute vec3 a_position;' +
			'attribute vec3 a_colour;' +
			'varying vec4 v_colour;' +
            'void main(void) {' +
               ' gl_Position = vec4(a_position, 1.0);' +
			   ' v_colour = vec4(a_colour, 1.0);' +
            '}';
	fragmentShaderCode = 
			'precision mediump float;' +
			'varying vec4 v_colour;' +
			'void main(void) {' +
               ' gl_FragColor = v_colour;' +
            '}';	
	document.getElementById("code").value = verticesString;
	initialiseWebGL();
	bindShaders1();
}