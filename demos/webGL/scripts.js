var gl;
var verticesString;
var indicesString;
var vertexShaderCode;
var fragmentShaderCode;
var cameraPosition;

function writeHeader(callback)
{
	document.write("<div id=\"navBar\">\
	<ul>\
	<li>Setting the scene</li>\
	<li>Getting Started</li>\
	<li>Camera Control</li>\
	<li>Per-Pixel Lighting</li>\
	</ul>\
	</div>\
	<div id=\"content\">\
      <canvas width = \"400\" height = \"400\" id = \"webGLCanvas\"></canvas>");
		writeForm(callback);
}

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
}

function initialiseCameraTutorial()
{
	verticesString = "0.0, 0.75, 0.0, 1.0, 0.0, 0.0,-0.75, -0.75, 0.0, 0.0, 1.0, 0.0, 0.75, -0.75, 0.0, 0.0, 0.0, 1.0"
	indicesString = "0,1,2";
	cameraPosition = [ 0.0, 0.0, 0.0]; 
	vertexShaderCode =
            'attribute vec3 a_position;\r\n' +
			'attribute vec3 a_colour;\r\n\r\n' +
			'uniform vec3 u_cameraPosition;\r\n\r\n' +
			'varying vec4 v_colour;\r\n\r\n' +
            'void main(void) {\r\n' +
               ' gl_Position = vec4(a_position, 1.0);\r\n' +
			   ' v_colour = vec4(a_colour, 1.0);\r\n' +
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
	document.addEventListener('keyup', onKeyUp, false);	
}

function writeForm(callback)
{
	document.write("<form action=\"javascript:" + callback + "()\">\
		<textarea id=\"code\" name=\"vs\" rows=\"15\" cols=\"50\"></textarea>\
		  <input type=\"submit\" value=\"Update\">\
		</form>");
}

function initialiseWebGL()
{
    canvas = document.getElementById("webGLCanvas");
    gl = canvas.getContext("webgl");
    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0,0,canvas.width,canvas.height);	  
	loadBuffers();	  
	loadShaders();
    bindShaders();
	render();
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
}

function loadBuffers()
{
	     var vertices = verticesString.split(',');
		 [
            0.0,0.75,0.0, 1.0, 0.0, 0.0,
            -0.75,-0.75,0.0, 0.0, 1.0, 0.0,
            0.75,-0.75,0.0, 0.0, 0.0, 1.0
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

function bindShaders()
{
	     var coord = gl.getAttribLocation(shaderProgram, "a_position");
         gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 6 * 4, 0);
         gl.enableVertexAttribArray(coord);	
		 coord = gl.getAttribLocation(shaderProgram, "a_colour");
         gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
         gl.enableVertexAttribArray(coord);	
}

function reloadBuffers()
{
		verticesString = document.getElementById("code").value;
		loadBuffers();
		bindShaders();
		render();
}

function loadShaders()
{  
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

function reloadVertexShader()
{
	vertexShaderCode = document.getElementById("code").value;
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
	bindShaders();
	var uCamPosLocation = gl.getUniformLocation(shaderProgram, "u_cameraPosition");
	gl.uniform3f(uCamPosLocation,
	cameraPosition[0], 
	cameraPosition[1], 
	cameraPosition[2], 
	cameraPosition[3]);

	render();
}

function updateCameraPosition()
{
	var uCamPosLocation = gl.getUniformLocation(shaderProgram, "u_cameraPosition");
	gl.uniform3f(uCamPosLocation,
		cameraPosition[0], 
		cameraPosition[1], 
		cameraPosition[2], 
		cameraPosition[3]);
}

function onKeyUp(event)
{
	if (event.key == 'd')
	{
		cameraPosition[0] = cameraPosition[0] + 0.05;
		updateCameraPosition();
	}
	else if (event.key == 'a')
	{
		cameraPosition[0] = cameraPosition[0] - 0.05;
		updateCameraPosition();	}
	else if (event.key == 'w')
	{
		cameraPosition[1] = cameraPosition[1] + 0.05;
		updateCameraPosition();	}	
	else if (event.key == 's')
	{
		cameraPosition[1] = cameraPosition[1] - 0.05;
		updateCameraPosition();	
	}
	
	render();
}

function writeFooter()
{
	document.write("</div>");
}