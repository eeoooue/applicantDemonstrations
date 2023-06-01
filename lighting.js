

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


	fragmentShaderCode = 
			'precision mediump float;\r\n\r\n' +
			'varying vec3 v_normal;\r\n\r\n' +
			'void main(void) {\r\n' +
               ' gl_FragColor = vec4(v_normal * 0.5 + 0.5, 1.0);\r\n' +
            '}';


	document.getElementById("code").value = fragmentShaderCode;

    var host = new WebGlHost(verticesString, indicesString, vertexShaderCode, fragmentShaderCode);

	host.initialiseWebGL();
	lightingPageBindShaders(host);

	window.requestAnimationFrame(host.update);
}


function lightingPageBindShaders(host){

    host.bind_a_position();
    host.bind_a_normal();
    host.render();
}



function reloadPixelShader() {

    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertexShaderCode);
    gl.compileShader(vertShader);

    fragmentShaderCode = document.getElementById("code").value;
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragmentShaderCode);
    gl.compileShader(fragShader);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    lightingPageBindShaders();
    render();
}

