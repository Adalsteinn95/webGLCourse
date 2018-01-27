/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Sýnir notkun á lyklaborðsatburðum til að hreyfa spaða
//
//    Hjálmtýr Hafsteinsson, janúar 2018
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

/*circle values*/
var numCirclePoints = 30;
var radius = 0.4;
var center = vec2(0, 0);

var circle_points = [];

var bufferIdP;
var bufferIdB;


window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var vertices = [
        vec2(-0.1, -0.9),
        vec2(-0.1, -0.86),
        vec2(0.1, -0.86),
        vec2(0.1, -0.9)
    ];


    circle_points.push(center);
    createCirclePoints(center, radius, numCirclePoints);


    // Load the data into the GPU for the ball
    bufferIdB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdB);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(circle_points), gl.DYNAMIC_DRAW);

    // Load the data into the GPU for the panel
    bufferIdP = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdP);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW);



    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

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

        /*make sure the paddle doesn't go out of bounds*/
        if (vertices[3][0] > 1 || vertices[3][0] < -1) {
            if (xmove < 0) {
                for (i = 0; i < 4; i++) {
                    vertices[i][0] += xmove;
                }
            }
        } else if (vertices[0][0] > 1 || vertices[0][0] < -1) {
            if (xmove > 0) {
                for (i = 0; i < 4; i++) {
                    vertices[i][0] += xmove;
                }
            }
        } else {
            for (i = 0; i < 4; i++) {
                vertices[i][0] += xmove;
            }
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdP);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
    });

    render();
}

// Create the points of the circle
function createCirclePoints(cent, rad, k) {
    circle_points = [];
    var dAngle = 2 * Math.PI / k;
    for (i = k; i >= 0; i--) {
        a = i * dAngle;
        var p = vec2(rad * Math.sin(a) + cent[0], rad * Math.cos(a) + cent[1]);
        circle_points.push(p);
    }
}


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);




    //draw the panel first
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdP);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdB);
    gl.drawArrays(gl.TRIANGLE_FAN,0,flatten(circle_points));

    window.requestAnimFrame(render);
}