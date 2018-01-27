"use strict";

var gl;

var theta = 0.0;
var thetaLoc;

var delay = 100;
var direction = true;

var vertices = [];
var type = "";

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    vertices = [
        vec2(-0.5, -0.5),
        vec2(-0.5, 0.5),
        vec2(0.5, -0.5),
        vec2(0.5, 0.5)
      ];

    // Load the data into the GPU

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 100, gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");


    document.getElementById("Controls").onclick = function (event) {
        switch (event.target.index) {
            case 0:
                type = "TRIANGLE"
                vertices = [
                    vec2(-0.5, 0.5),
                    vec2(-0.5, -0.5),
                    vec2(0.5, 0.5),
                    vec2(-0.5, -0.5),
                    vec2(0.5,0.5),
                    vec2(0.5,-0.5)
                ];

                break;
            case 1:
                type = "TRIANGLE_FAN"
                vertices = [
                    vec2(-0.5, -0.5),
                    vec2(-0.5, 0.5),
                    vec2(0.5, 0.5),
                    vec2(0.5, -0.5)
                ];

                break;
            case 2:
                type = "TRIANGLE_STRIP"
                vertices = [
                    vec2(-0.5, -0.5),
                    vec2(-0.5, 0.5),
                    vec2(0.5, -0.5),
                    vec2(0.5, 0.5)
                  ];

                break;
        }

    };




    render();
};

function render() {

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));

    if(type === "TRIANGLE"){
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    } else if(type === "TRIANGLE_FAN"){
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
 
    } else {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }



    setTimeout(
        function () {
            requestAnimFrame(render);
        }, delay
    );
}