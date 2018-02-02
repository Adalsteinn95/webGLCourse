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
var bufferIdSquare;

var colorA = vec4(1.0, 0.0, 0.0, 1.0);
var colorB = vec4(1.0, 1.0, 0.0, 0.2);
var colorC = vec4(0.0, 1.0, 0.0, 1.0);
var colorD = vec4(0.0, 1.0, 0.0, 1.0);

var multiColor =[ vec4( 1.0, 0.0, 0.0, 1.0 ), vec4( 0.0, 1.0, 0.0, 1.0 ), vec4( 0.0, 0.0, 1.0, 1.0 ) ];


/* ball attribute*/

var numCirclePoints = 30;
var radius = 0.02;
var center = vec2(0.5, 0);

var points = [];

var directon = "right-upper";

var offsetx = 0;
var offsety = 0;

/* Panel */

var verticesPanel;
var score = 0;
var scoreBoard;
var xmove = 0;

/* collision detection */
var prevX;
var prevY;
var nextX;
var prevX;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }


    // Two triangles
    verticesPanel = [
        vec2(-0.1, -0.9),
        vec2(-0.1, -0.86),
        vec2(0.1, -0.86),
        vec2(0.1, -0.9)
    ];

    /* squares */
    verticesSquare1 = [
        vec2(-0.1, 0.53),
        vec2(-0.1, 0.48),
        vec2(0.1, 0.48),
        vec2(0.1, 0.53)
    ];

    verticesSquare2 = [
        vec2(-0.6, 0.53),
        vec2(-0.6, 0.48),
        vec2(-0.4, 0.48),
        vec2(-0.4, 0.53)
    ];

    verticesSquare3 = [
        vec2(0.4, 0.53),
        vec2(0.4, 0.48),
        vec2(0.6, 0.48),
        vec2(0.6, 0.53)
    ];

    scoreBoard = document.querySelector('h1');
    scoreBoard.textContent = score;


    points.push(center);
    createCirclePoints(center, radius, numCirclePoints);

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
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);


    /* define squares buffer */
    bufferIdSquare = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdSquare);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesSquare1), gl.STATIC_DRAW);

    bufferIdSquare2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdSquare2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesSquare2), gl.STATIC_DRAW);

    bufferIdSquare3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdSquare3);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesSquare3), gl.STATIC_DRAW);

    // Get location of shader variable vPosition
    locPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer( locPosition, 4, gl.FLOAT, false, 0, 0 );
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
            case 87: // w
                xmove = 0.0;
                offsety = 0.005
                break;
            case 65: // a
                xmove = 0.0;
                offsetx = -0.005
                break;
            case 68: // d
                xmove = 0.0;
                offsetx = 0.005
                break
            case 83: // s
                xmove = 0.0;
                offsety = -0.005
                break
            default:
                xmove = 0.0;
                offsety = 0;
                offsetx = 0;
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


        /* move the ball based on wasd keys */



    });

    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    /**
     * 
     * BALL MOVEMENT
     * 
     * 
     */

    var drx = 0.01;
    var dry = 0.01;

    if (offsetx > 0 || offsetx < 0) {
        drx = 0.01 + offsetx;
    }
    if (offsety > 0 || offsety < 0) {
        dry = 0.01 + offsety;
    }




    for (i = 0; i < points.length; i++) {

        if (directon === "right-upper") {
            points[i][0] += drx;
            points[i][1] += dry;
        }

        if (directon === "left-upper") {
            points[i][0] -= drx;
            points[i][1] += dry;
        }

        if (directon === "right-under") {
            points[i][0] += drx;
            points[i][1] -= dry;
        }

        if (directon === "left-under") {
            points[i][0] -= drx;
            points[i][1] -= dry;
        }
    }

    /* collision on walls */

    if (points[0][0] + drx > 1 - radius) {

        if (directon === "right-upper") {
            directon = "left-upper";
        }
        if (directon === "right-under") {
            directon = "left-under";
        }
    }

    if (points[0][1] + dry > 1 - radius) {
        if (directon === "left-upper") {
            directon = "left-under";
        }
        if (directon === "right-upper") {
            directon = "right-under";
        }
    }

    if (points[0][0] < -1 + radius) {
        if (directon === "left-under") {
            directon = "right-under";
        }
        if (directon === "left-upper") {
            directon = "right-upper";
        }
    }


    /* collision for panel */
    if (points[0][0]  > verticesPanel[0][0] && points[0][0] < verticesPanel[3][0]) {
        if (points[0][1] - radius  < verticesPanel[1][1] && points[0][1] - radius > verticesPanel[0][1]) {

            var circle = points[0][0];
            var left = verticesPanel[0][0];
            var right = verticesPanel[3][0];

            var closer = closest(circle, [left, right]);


            if (directon === "left-under") {
                if (closer === right) {
                    directon = "right-upper";
                } else {
                    directon = "left-upper";
                }

            }
            if (directon === "right-under") {
                if (closer === left) {
                    directon = "left-upper";
                } else {
                    directon = "right-upper";
                }
            }
        }
    }

    for (var i = 0; i < 3; i++) {
        var check = [];
        if (i === 0) {
            check = [verticesSquare1[0][0], verticesSquare1[3][0], verticesSquare1[0][1], verticesSquare1[1][1]];
        } else if (i === 1) {
            check = [verticesSquare2[0][0], verticesSquare2[3][0], verticesSquare2[0][1], verticesSquare2[1][1]];
        } else {
            check = [verticesSquare3[0][0], verticesSquare3[3][0], verticesSquare3[0][1], verticesSquare3[1][1]];
        }
        if (points[0][0] + radius > check[0] && points[0][0] + radius < check[1] || points[0][0] - radius > check[0] && points[0][0] - radius < check[1]) {
            if (points[0][1] + radius > check[3] && points[0][1] + radius < check[2] || points[0][1] - radius > check[3] && points[0][1] - radius < check[2]) {
                if (directon === "left-under") {
                    directon = "left-upper";
                } else if (directon === "right-under") {
                    directon = "right-upper";
                } else if (directon === "left-upper") {
                    directon = "left-under";
                } else if (directon === "right-upper") {
                    directon = "right-under";
                }

                var b = generateRandomNumber(0,0.9);

                if (i === 0) {
                    var a = generateRandomNumber(-0.3,0.3);

                    verticesSquare1 = [
                        vec2(a, b+0.05),
                        vec2(a, b),
                        vec2(a+0.2, b),
                        vec2(a+0.2, b+0.05)
                    ];

                } else if (i === 1) {
                    var a = generateRandomNumber(-0.9,-0.4);

                    verticesSquare2 = [
                        vec2(a, b+0.05),
                        vec2(a, b),
                        vec2(a+0.2, b),
                        vec2(a+0.2, b+0.05)
                    ];
                } else {
                    var a = generateRandomNumber(0.4,0.9);

                    verticesSquare3 = [
                        vec2(a, b+0.05),
                        vec2(a, b),
                        vec2(a+0.2, b),
                        vec2(a+0.2, b+0.05)
                    ];
                }

                score++;
            }
        }

    }

    if (points[0][1] < -1) {
        points = [];
        center = vec2(generateRandomNumber(-1,1), 0);

        var randomDirection = Math.floor(Math.random() * 4) + 1;

        if(randomDirection === 1){
            directon = "left-upper";
        } else if(randomDirection === 2){
            directon = "left-under";
        } else if(randomDirection === 3){
            directon = "right-upper";
        } else {
            directon = "right-under";
        }
        createCirclePoints(center, radius, numCirclePoints);
        score--;

    }

    scoreBoard.textContent = score;


    // HH: Send the new coordinates over to graphics memory
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdBall);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));



    // Draw Panel    
    gl.bindBuffer(gl.ARRAY_BUFFER, buferrIdPanel);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(verticesPanel));
    gl.vertexAttribPointer(locPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(locColor, flatten(colorA));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    // Draw Ball
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdBall);
    gl.vertexAttribPointer(locPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(locColor, flatten(multiColor));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length);


    //draw squares
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdSquare);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(verticesSquare1));
    gl.vertexAttribPointer(locPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(locColor, flatten(colorB));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdSquare2);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(verticesSquare2));
    gl.vertexAttribPointer(locPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(locColor, flatten(colorA));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdSquare3);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(verticesSquare3));
    gl.vertexAttribPointer(locPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(locColor, flatten(colorA));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


    if(score === 10){
        confirm("Byrja nýjan leik?");
        location.reload();
    } else {
        window.requestAnimFrame(render);
    }

}

// Create the points of the circle
function createCirclePoints(cent, rad, k) {
    var dAngle = 2 * Math.PI / k;
    for (i = k; i >= 0; i--) {
        a = i * dAngle;
        var p = vec2(0.6*rad * Math.sin(a) + cent[0], rad * Math.cos(a) + cent[1]);
        points.push(p);
    }
}

// find out wich number is closer
function closest(num, arr) {
    var curr = arr[0];
    var diff = Math.abs(num - curr);
    for (var val = 0; val < arr.length; val++) {
        var newdiff = Math.abs(num - arr[val]);
        if (newdiff < diff) {
            diff = newdiff;
            curr = arr[val];
        }
    }
    return curr;
}

/* random number generator */
function generateRandomNumber(min, max) {
    var randomNumber = Math.random() * (max - min) + min;
    return randomNumber;
};
