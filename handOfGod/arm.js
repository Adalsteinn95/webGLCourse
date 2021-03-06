/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Sýnir notkun stigveldislíkana.  Forritið robotArm er
//     úr kennslubókinni en nú er hægt að snúa líkaninu með mús.
//
//    Hjálmtýr Hafsteinsson, febrúar 2018
/////////////////////////////////////////////////////////////////
var NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)

var movement = false;
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var zDist = -25.0;

var points = [];
var colors = [];

var vertices = [
    vec4(-0.5, -0.5, 0.5, 1.0), 
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
];

// RGBA colors
var vertexColors = [
    vec4(0.8, 0.7, 0.6, 1), // Skincolour
    vec4(0.9, 0.75, 0.3, 1), // red
    vec4(0.8, 0.7, 0.4, 1), // yellow
    vec4(0.9, 0.8, 0.3, 1), // green
    vec4(0.85, 0.8, 0.4, 1), // blue
    vec4(0.9, 0.75, 0.5, 1), // magenta
    vec4(0.9, 0.75, 0.6, 1), // cyan
    vec4(0.9, 0.8, 0.5, 1) // white
];


// Parameters controlling the size of the Robot's arm

var BASE_HEIGHT = 7.0;
var BASE_WIDTH = 5;

/* finger */
var LOWER_ARM_HEIGHT = [1, 1.5, 1.7, 1.5, 1];
var LOWER_ARM_WIDTH = [0.8, 0.8, 0.8, 0.8, 0.8];

var UPPER_ARM_HEIGHT = [1, 1.3, 1.7, 1.5, 1];
var UPPER_ARM_WIDTH = [0.75, 0.75, 0.75, 0.75, 0.75];


/* position of the fingers on the hand */

var FINGER_POSITION = [1.8, 1, 0.2, -0.6, -1.4];

// Shader transformation matrices

var modelViewMatrix, projectionMatrix;

// Array of rotation angles (in degrees) for each rotation axis

var Base = 0;
var LowerArm = 1;
var UpperArm = 2;
var UppestArm = 3;

/* hand positions */

var handPositions = "normal";

/* fingers rotation */
var fingers_rotation = [{
        rotateX:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        },
        rotateY:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        },
        rotateZ:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        }
    },
    {
        rotateX:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        },
        rotateY:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        },
        rotateZ:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        }
    },
    {
        rotateX:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        },
        rotateY:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        },
        rotateZ:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        }
    },
    {
        rotateX:{
            rotationUpper: 0,
            rotationLower:  0,
            rotationUppest: 0,
        },
        rotateY:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        },
        rotateZ:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        }
    },
    {
        rotateX:{
            rotationUpper: 0,
            rotationLower: -40,
            rotationUppest: 0,
        },
        rotateY:{
            rotationUpper: 0,
            rotationLower: 90,
            rotationUppest: 0,
        },
        rotateZ:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        }
    }
]

function reset(){
    fingers_rotation = [{
        rotateX:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        },
        rotateY:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        },
        rotateZ:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        }
    },
    {
        rotateX:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        },
        rotateY:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        },
        rotateZ:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        }
    },
    {
        rotateX:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        },
        rotateY:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        },
        rotateZ:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        }
    },
    {
        rotateX:{
            rotationUpper: 0,
            rotationLower:  0,
            rotationUppest: 0,
        },
        rotateY:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        },
        rotateZ:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        }
    },
    {
        rotateX:{
            rotationUpper: 0,
            rotationLower: -40,
            rotationUppest: 0,
        },
        rotateY:{
            rotationUpper: 0,
            rotationLower: 90,
            rotationUppest: 0,
        },
        rotateZ:{
            rotationUpper: 0,
            rotationLower: 0,
            rotationUppest: 0,
        }
    }
]
}


var theta = [0];


var whichFinger = 0;

var angle = 0;

var modelViewMatrixLoc;

var vBuffer, cBuffer;

//----------------------------------------------------------------------------

function quad(a, b, c, d) {
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[b]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[d]);
}


function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

//____________________________________________

// Remmove when scale in MV.js supports scale matrices

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}


//--------------------------------------------------


window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.9, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    colorCube();

    // Load shaders and use the resulting shader program

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Create and initialize  buffer objects

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    projectionMatrix = perspective(60.0, 1.0, 0.1, 100.0);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

    //event listeners for mouse
    canvas.addEventListener("mousedown", function (e) {
        movement = true;
        origX = e.clientX;
        origY = e.clientY;
        e.preventDefault(); // Disable drag and drop
    });

    canvas.addEventListener("mouseup", function (e) {
        movement = false;
    });

    canvas.addEventListener("mousemove", function (e) {
        if (movement) {
            spinY = (spinY + (e.clientX - origX)) % 360;
            spinX = (spinX + (origY - e.clientY)) % 360;
            origX = e.clientX;
            origY = e.clientY;
        }
    });

    // Event listener for keyboard
    window.addEventListener("keydown", function (e) {
        switch (e.keyCode) {
            case 38: // upp ör
                zDist += 1.0;
                break;
            case 40: // niður ör
                zDist -= 1.0;
                break;
            case 90: // z - snýr stöpli áfram
                theta[0] = Math.min(180, theta[0] + 5);
                break;
            case 88: // x - snýr stöpli afturábak
                theta[0] = Math.max(-180, theta[0] - 5);
                break;
            case 65: // a - snýr neðri armi
                if(whichFinger == 4){
                    fingers_rotation[whichFinger].rotateY.rotationLower = Math.min(90, fingers_rotation[whichFinger].rotateY.rotationLower - 5);
                } else {
                    fingers_rotation[whichFinger].rotateX.rotationLower = Math.min(90, fingers_rotation[whichFinger].rotateX.rotationLower + 5);
                }
                break;
            case 83: // s - snýr neðri armi
                if(whichFinger == 4){
                    fingers_rotation[whichFinger].rotateY.rotationLower = Math.max(0, fingers_rotation[whichFinger].rotateY.rotationLower + 5);
                } else {
                    fingers_rotation[whichFinger].rotateX.rotationLower = Math.max(0, fingers_rotation[whichFinger].rotateX.rotationLower - 5);
                }
                break;
            case 81: // q - snýr efri armi
                fingers_rotation[whichFinger].rotateX.rotationUpper = Math.min(90, fingers_rotation[whichFinger].rotateX.rotationUpper + 5);
                break;
            case 87: // w - snýr efri armi
                fingers_rotation[whichFinger].rotateX.rotationUpper = Math.max(0, fingers_rotation[whichFinger].rotateX.rotationUpper - 5);
                break;
            case 49: //1
                fingers_rotation[whichFinger].rotateX.rotationUppest = Math.min(90, fingers_rotation[whichFinger].rotateX.rotationUppest + 5);
                break;
            case 50: //2
                fingers_rotation[whichFinger].rotateX.rotationUppest = Math.max(0, fingers_rotation[whichFinger].rotateX.rotationUppest - 5);
        }
    });

    // eventlistener for buttons
    var buttons = document.querySelectorAll(".Fingers Button");
    for (var i = 0; i < buttons.length; i++) {

        buttons[i].addEventListener("click", (i) => {
            whichFinger = i.path[0].id - 1;
        });
    }

    var positions = document.querySelectorAll(".Positions Button");
    for (var i = 0; i < positions.length; i++) {

        positions[i].addEventListener("click", (i) => {

            reset();
            if(i.target.id == 1){
                handPositions = "normal";
            } else if(i.target.id == 2){
                
                handPositions = "knuckles";
                
            } else if(i.target.id == 3){
                handPositions = "oneFinger";
            } else if(i.target.id == 4){
                handPositions = "weird";
                
            } else if(i.target.id == 5){
                handPositions = "rock";
            } 
        });
    }

    // Event listener for mousewheel
    window.addEventListener("mousewheel", function (e) {
        if (e.wheelDelta > 0.0) {
            zDist += 1.0;
        } else {
            zDist -= 1.0;
        }
    });


    render();
}

//----------------------------------------------------------------------------


function base(number) {
    var s = scalem(UPPER_ARM_WIDTH[number], BASE_HEIGHT * 0.5 , BASE_WIDTH * 0.7);
    var instanceMatrix = mult(translate(0.0, 0.8 * BASE_HEIGHT, 0.1), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//----------------------------------------------------------------------------


function upperArm(number) {
    var s = scalem(UPPER_ARM_WIDTH[number], UPPER_ARM_HEIGHT[number], UPPER_ARM_WIDTH[number]);
    var instanceMatrix = mult(translate(0.0, 0.5 * UPPER_ARM_HEIGHT[number], FINGER_POSITION[number]), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//----------------------------------------------------------------------------

function lowerArm(number) {

    var s = scalem(LOWER_ARM_WIDTH[number], LOWER_ARM_HEIGHT[number], LOWER_ARM_WIDTH[number]);
    var instanceMatrix = mult(translate(0.0, 0.5 * LOWER_ARM_HEIGHT[number], FINGER_POSITION[number]), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//----------------------------------------------------------------------------


var render = function () {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mvstack = [];

    // staðsetja áhorfanda og meðhöndla músarhreyfingu
    var mv = lookAt(vec3(0.0, 2.0, zDist), vec3(0.0, 2.0, 0.0), vec3(0.0, 1.0, 0.0));
    mv = mult(mv, rotate(spinX, [1, 0, 0]));
    mv = mult(mv, rotate(spinY, [0, 1, 0]));

    /* movement to new positions */ 

    if(handPositions === "knuckles"){
        if(fingers_rotation[4].rotateX.rotationUpper > 90){

        } else {
            for(var i = 0; i < 4; i++){
                fingers_rotation[i].rotateX.rotationLower += 1;
                fingers_rotation[i].rotateX.rotationUpper += 1;
                fingers_rotation[i].rotateX.rotationUppest += 1;
            }
        
            fingers_rotation[4].rotateX.rotationUpper += 1;
        }
    } else if(handPositions === "oneFinger"){
        if(fingers_rotation[4].rotateX.rotationUpper > 90){
             
        } else {
            for(var i = 0; i < 3; i++){
                fingers_rotation[i].rotateX.rotationLower += 1;
                fingers_rotation[i].rotateX.rotationUpper += 1;
                fingers_rotation[i].rotateX.rotationUppest += 1;
            }
    
            fingers_rotation[4].rotateX.rotationUpper += 1;
        }
    } else if(handPositions === "weird"){
        if(fingers_rotation[3].rotateY.rotationUpper > 90){
             
        } else {
            for(var i = 0; i < 4; i++){
                fingers_rotation[i].rotateY.rotationLower += 1;
            }
    
            if(fingers_rotation[0].rotateX.rotationLower <= 20){
                fingers_rotation[0].rotateX.rotationLower += 1;
            }
            if(fingers_rotation[1].rotateX.rotationLower <= 15){
                fingers_rotation[1].rotateX.rotationLower += 1;
            }
            if(fingers_rotation[3].rotateX.rotationLower >= -15){
                fingers_rotation[3].rotateX.rotationLower -= 1;
            }

    
            fingers_rotation[4].rotateY.rotationLower += 1;
        }
    } else if(handPositions === "rock"){
        if(fingers_rotation[2].rotateX.rotationUpper > 90){
             
        } else {
            for(var i = 1; i < 3; i++){
                fingers_rotation[i].rotateX.rotationLower += 1;
                fingers_rotation[i].rotateX.rotationUpper += 1;
                fingers_rotation[i].rotateX.rotationUppest += 1;
            }
    
            
        }
    }


    for (var i = 0; i < 4; i++) {

        mvstack.push(modelViewMatrix);
        modelViewMatrix = mult(mv, rotate(theta[Base], 0, 1, 0));
        base(i);

        modelViewMatrix = mult(modelViewMatrix, translate(0.0, BASE_HEIGHT, 0.0));
        modelViewMatrix = mult(modelViewMatrix, rotate(fingers_rotation[i].rotateX.rotationLower, fingers_rotation[i].rotateY.rotationLower, fingers_rotation[i].rotateZ.rotationLower, 1));
        lowerArm(i);

        modelViewMatrix = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT[i], 0.0));
        modelViewMatrix = mult(modelViewMatrix, rotate(fingers_rotation[i].rotateX.rotationUpper, fingers_rotation[i].rotateY.rotationUpper, fingers_rotation[i].rotateZ.rotationUpper, 1));
        upperArm(i);

        modelViewMatrix = mult(modelViewMatrix, translate(0.0, UPPER_ARM_HEIGHT[i], 0.0));
        modelViewMatrix = mult(modelViewMatrix, rotate(fingers_rotation[i].rotateX.rotationUppest, fingers_rotation[i].rotateY.rotationUpper, fingers_rotation[i].rotateY.rotationUppest, 1));
        upperArm(i);

        mvstack.pop();
    }

    mvstack.push(modelViewMatrix);
    modelViewMatrix = mult(mv, rotate(theta[Base], 0, 1, 0));
    base(0);

    
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, BASE_HEIGHT * 1.1, 0));
    modelViewMatrix = mult(modelViewMatrix, rotate(fingers_rotation[4].rotateX.rotationLower,fingers_rotation[4].rotateY.rotationLower, fingers_rotation[4].rotateZ.rotationLower, 1));
    lowerArm(4);

    modelViewMatrix = mult(modelViewMatrix, translate(0.0, UPPER_ARM_HEIGHT[i], 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(fingers_rotation[4].rotateX.rotationUpper, fingers_rotation[4].rotateY.rotationUpper, fingers_rotation[4].rotateZ.rotationUpper, 1));
    upperArm(4);


    mvstack.pop();

    requestAnimFrame(render);
}