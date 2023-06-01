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

function writeForm(callback)
{
	document.write("<form action=\"javascript:" + callback + "()\">\
		<textarea id=\"code\" name=\"vs\" rows=\"15\" cols=\"50\"></textarea>\
		  <input type=\"submit\" value=\"Update\">\
		</form>");
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

function reloadBuffers()
{
		verticesString = document.getElementById("code").value;
		loadBuffers();
		bindShaders1();
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



function writeFooter()
{
	document.write("</div><div id=\"footer\"><p><b>Simon Grey</b> - <i>S.Grey@hull.ac.uk</i></p></div></div>");
}