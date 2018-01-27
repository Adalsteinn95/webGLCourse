/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Sýnir notkun á tveimur minnissvæðum (VBO) og hvernig þau
//     eru virkjuð rétt fyrir teikningu í render().
//     Tvö VBO teiknuð með sömu liturum (og "uniform" breytu)
//
//    Hjálmtýr Hafsteinsson, janúar 2018
/////////////////////////////////////////////////////////////////
var gl;

// Global variables (accessed in render)
var locPosition;
var locColor;
var buferrIdPanel;
var bufferIdBall;
var colorA = vec4(1.0, 0.0, 0.0, 1.0);
var colorB = vec4(0.0, 1.0, 0.0, 1.0);

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }


    // Two triangles
    var verticesPanel = [
        vec2(-0.1, -0.9),
        vec2(-0.1, -0.86),
        vec2(0.1, -0.86),
        vec2(0.1, -0.9)
    ];
    var verticesBall = [
        vec2(0.1, -0.5),
        vec2(0.5, 0.5),
        vec2(0.9, -0.5),
    ];

    points.push( center );
    createCirclePoints( center, radius, numCirclePoints );

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Define two VBOs and load the data into the GPU
    buferrIdPanel = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buferrIdPanel);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesPanel), gl.STATIC_DRAW);

    bufferIdBall = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdBall);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesBall), gl.STATIC_DRAW);

    // Get location of shader variable vPosition
    locPosition = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(locPosition);

    locColor = gl.getUniformLocation(program, "rcolor");
    // Event listener for keyboard
    window.addEventListener("keydown", function (e) {
        switch (e.keyCode) {
            case 37: // vinstri ör
                xmove = -0.04;
                break;
            case 39: // hægri ör
                xmove = 0.04;
                break;
            default:
                xmove = 0.0;
        }
        /*
        /*make sure the paddle doesn't go out of bounds*/
        
        if (verticesPanel[3][0] > 1 || verticesPanel[3][0] < -1) {
            if (xmove < 0) {
                for (i = 0; i < 4; i++) {
                    verticesPanel[i][0] += xmove;
                }
            }
        } else if (verticesPanel[0][0] > 1 || verticesPanel[0][0] < -1) {
            if (xmove > 0) {
                for (i = 0; i < 4; i++) {
                    verticesPanel[i][0] += xmove;
                }
            }
        } else {
            for (i = 0; i < 4; i++) {
                verticesPanel[i][0] += xmove;
            }
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, buferrIdPanel);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(verticesPanel));
    });

    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw first triangle    
    gl.bindBuffer(gl.ARRAY_BUFFER, buferrIdPanel);
    gl.vertexAttribPointer(locPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(locColor, flatten(colorA));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    // Draw second triangle
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdBall);
    gl.vertexAttribPointer(locPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(locColor, flatten(colorB));
    gl.drawArrays(gl.TRIANGLES, 0, 3);



    window.requestAnimFrame(render);

}