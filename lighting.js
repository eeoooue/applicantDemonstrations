function initialiseLightingTutorial()
{
	verticesString = bunnyVerticesString;
	indicesString = bunnyIndicesString;
	cameraPosition = [ 0.0, 0.0, 0.0]; 
	vertexShaderCode =
            'attribute vec3 a_position;\r\n' +
			'attribute vec3 a_normal;\r\n\r\n' +
			'uniform float u_rotation;\r\n\r\n' +
			'varying vec3 v_normal;\r\n\r\n' +
            'void main(void) {\r\n' +
			'float c = cos(u_rotation);'+
			'float s = sin(u_rotation);'+
			'mat4 rot = mat4 (c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1);'+
               ' gl_Position = rot * vec4(a_position, 1.0);\r\n' +
			   ' v_normal = a_normal;\r\n' +
            '}';
	document.getElementById("code").value = vertexShaderCode;
	fragmentShaderCode = 
			'precision mediump float;\r\n\r\n' +
			'varying vec3 v_normal;\r\n\r\n' +
			'void main(void) {\r\n' +
               ' gl_FragColor = vec4(v_normal * 0.5 + 0.5, 1.0);\r\n' +
            '}';	
	document.getElementById("code").value = fragmentShaderCode;
	initialiseWebGL();
	bindShaders2();
	window.requestAnimationFrame(update);
	document.addEventListener('keyup', onSimpleKeyUp, false);		
}


