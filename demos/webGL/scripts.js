var gl;
var verticesString;
var indicesString;
var vertexShaderCode;
var fragmentShaderCode;
var cameraPosition;
var rotation = 0;

function getHeader(page)
{
	var header = '\
	<div id="wrapper">\
		<h1 style=\"padding:15px;">Code Along at https://tinyurl.com/ct5nrhtd</h1>\
		<div id="nav">\
		<ul>'
		
		var links = new Array("Setting the Scene", "index.html", 
		"Graphics Pipeline", "pipeline.html", 
		"Loading Data", "loading.html",
		"Camera Control", "camera.html", 
		"Lighting", "lighting.html");
		
		for(i = links.length - 2; i >= 0 ; i-=2)
		{
			header = header + '<li';
			if(links[i + 1] == page)
			{
				header = header + ' class="selected"';				
			}
			header = header + '>\
			<a href="' + links[i + 1] + '">' + links[i] + '</a>\
			</li>';
		}
		
		header = header + '\
		</ul>\
		</div>\
		<div id="content">';
	return header;
}

function writeHeader(callback, page)
{
	document.write(getHeader(page));
	document.write("<canvas width = \"500\" height = \"500\" id = \"webGLCanvas\"></canvas>");
	writeForm(callback);
}

function writeHeader2(page)
{
	document.write(getHeader(page));
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
	bindShaders1();
}

function initialiseCameraTutorial()
{
	verticesString = sphereVerticesString;
	indicesString = sphereIndicesString;
	cameraPosition = [ 0.0, 0.0, 0.0]; 
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

function bindShaders1()
{
	     var coord = gl.getAttribLocation(shaderProgram, "a_position");
         gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 6 * 4, 0);
         gl.enableVertexAttribArray(coord);	
		 coord = gl.getAttribLocation(shaderProgram, "a_colour");
         gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
         gl.enableVertexAttribArray(coord);
		 render();
}

function bindShaders2()
{
	     var coord = gl.getAttribLocation(shaderProgram, "a_position");
         gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 6 * 4, 0);
         gl.enableVertexAttribArray(coord);	
		 coord = gl.getAttribLocation(shaderProgram, "a_normal");
         gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
         gl.enableVertexAttribArray(coord);
		 render();
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

function reloadPixelShader()
{
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
	bindShaders2();
	render();	
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

function updateSimpleCameraPosition()
{
	var uCamPosLocation = gl.getUniformLocation(shaderProgram, "u_cameraPosition");
	gl.uniform3f(uCamPosLocation,
		cameraPosition[0], 
		cameraPosition[1], 
		cameraPosition[2], 
		cameraPosition[3]);
}

function update()
{
	var uRotationLocation = gl.getUniformLocation(shaderProgram, "u_rotation");
	gl.uniform1f(uRotationLocation, rotation);
	rotation = rotation + 0.01;
	if(rotation > 6.28)
	{
		rotation = rotation - 6.28;
	}
	render();
	requestAnimationFrame(update);
}

function onSimpleKeyUp(event)
{
	if (event.key == 'd')
	{
		cameraPosition[0] = cameraPosition[0] + 0.05;
		updateSimpleCameraPosition();
	}
	else if (event.key == 'a')
	{
		cameraPosition[0] = cameraPosition[0] - 0.05;
		updateSimpleCameraPosition();	}
	else if (event.key == 'w')
	{
		cameraPosition[1] = cameraPosition[1] + 0.05;
		updateSimpleCameraPosition();	}	
	else if (event.key == 's')
	{
		cameraPosition[1] = cameraPosition[1] - 0.05;
		updateSimpleCameraPosition();	
	}
	
	render();
}

function writeFooter()
{
	document.write("</div><div id=\"footer\"><p><b>Simon Grey</b> - <i>S.Grey@hull.ac.uk</i></p></div></div>");
}