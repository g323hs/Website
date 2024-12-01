let run;
let spin;
let bodiesAdded;
let theta;
let tempX;
let oldTheta;
let zoom;
let viewHeight;
let Bodies;

function changeBorder(colour) {
    const elt = document.getElementById("logo");
    elt.style.color = colour;
}

function reset() {
    // stop the calculations for new pos
    run = false;
    theta = 0;
    oldTheta = 0;
    zoom = 1;
    viewHeight = 0;

    let Names = document.getElementsByClassName("Name");
    let Masses = document.getElementsByClassName("Mass");
    let PosXs = document.getElementsByClassName("PosX");
    let PosYs = document.getElementsByClassName("PosY");
    let PosZs = document.getElementsByClassName("PosZ");
    let MomentumXs = document.getElementsByClassName("MomentumX");
    let MomentumYs = document.getElementsByClassName("MomentumY");
    let MomentumZs = document.getElementsByClassName("MomentumZ");
    let Rs = document.getElementsByClassName("R");
    let Gs = document.getElementsByClassName("G");
    let Bs = document.getElementsByClassName("B");
    let buttons = document.getElementsByClassName("collapsible");
    Bodies = [];

    // clear graphs
    PositionChart.destroy();
    MomentumChart.destroy();
    createCharts();

    let errorText = "";

    for (let i = 0; i < Names.length; i++) {
        
        let bodyName = Names[i].value;
        let Mass = parseFloat(Masses[i].value);

        let PosX = parseFloat(PosXs[i].value);
        let PosY = parseFloat(PosYs[i].value);
        let PosZ = parseFloat(PosZs[i].value);
        let MomentumX = parseFloat(MomentumXs[i].value);
        let MomentumY = parseFloat(MomentumYs[i].value);
        let MomentumZ = parseFloat(MomentumZs[i].value);
        let r = parseFloat(Rs[i].value);
        let g = parseFloat(Gs[i].value);
        let b = parseFloat(Bs[i].value);

        // validate data and update and inform the user

        // Name
        for (let j = 0; j < Names.length; j++) {
            if (j != i) {
                if (bodyName == Names[j].value) {
                    errorText += "\n" + Names[j].value + " is a duplicate name.";
                    errorText += "\nNames must be unique.";
                    bodiesAdded++;
                    Names[j].value = "Body " + bodiesAdded;
                }
            }
        }

        // Mass
        if (Mass > 2 || Mass < 0.01) {
            errorText += "\nMass for " + bodyName + " is invalid.";
            errorText += "\nMust be between 0.01 and 2.";
            Mass = 1;
            Masses[i].value = 1;
        }

        // Pos
        if (PosX > 500 || PosX < -500) {
            errorText += "\nPosition X for " + bodyName + " is invalid.";
            errorText += "\nMust be between -500 and 500.";
            PosX = 0;
            PosXs[i].value = 0;
        }
        if (PosY > 500 || PosY < -500) {
            errorText += "\nPosition Y for " + bodyName + " is invalid.";
            errorText += "\nMust be between -500 and 500.";
            PosY = 0;
            PosYs[i].value = 0;
        }
        if (PosZ > 0 || PosZ < -1000) {
            errorText += "\nPosition Z for " + bodyName + " is invalid.";
            errorText += "\nMust be between 0 and -1000.";
            PosZ = 0;
            PosZs[i].value = 0;
        }

        // Momentum
        if (MomentumX > 10 || MomentumX < -10) {
            errorText += "\nMomentum X for " + bodyName + " is invalid.";
            errorText += "\nMust be between -10 and 10.";
            MomentumX = 0;
            MomentumXs[i].value = 0;
        }
        if (MomentumY > 10 || MomentumY < -10) {
            errorText += "\nMomentum Y for " + bodyName + " is invalid.";
            errorText += "\nMust be between -10 and 10.";
            MomentumY = 0;
            MomentumYs[i].value = 0;
        }
        if (MomentumZ > 10 || MomentumZ < -10) {
            errorText += "\nMomentum Z for " + bodyName + " is invalid.";
            errorText += "\nMust be between -10 and 10.";
            MomentumZ = 0;
            MomentumZs[i].value = 0;
        }

        // Colour
        if (r > 255 || r < 0) {
            errorText += "\nRed colour for " + bodyName + " is invalid.";
            errorText += "\nMust be between 0 and 255.";
            r = 128;
            Rs[i].value = 128;
        }
        if (g > 255 || g < 0) {
            errorText += "\nGreen colour for " + bodyName + " is invalid.";
            errorText += "\nMust be between 0 and 255.";
            g = 128;
            Gs[i].value = 128;
        }
        if (b > 255 || b < 0) {
            errorText += "\nBlue colour for " + bodyName + " is invalid.";
            errorText += "\nMust be between 0 and 255.";
            b = 128;
            Bs[i].value = 128;
        }

        // Adjust momentum for the simulation
        MomentumX *= 7e-8;
        MomentumY *= 7e-8;
        MomentumZ *= 7e-8;

        // Update colour on buttons
        buttons[i].style.backgroundColor = rgbToHex(r, g, b);
        buttons[i].textContent = Names[i].value;
        let colour = [r, g, b];

        let pos = new Vector(PosX, PosY, PosZ);
        let momentum = new Vector(MomentumX, MomentumY, MomentumZ);

        let body = new Body(colour, Mass, pos, momentum, bodyName);
        Bodies[i] = body;

        // Add new data set to graphs
        let textColour = 'rgb(' + r + ', ' + g + ', ' + b + ')';

        let newPosDataset = {
            label: bodyName,
            data: [],
            backgroundColor: textColour,
            borderColor: textColour,
            pointRadius: 0,
        };

        let PosDatasets = PositionChart.data.datasets;
        PosDatasets[PosDatasets.length] = newPosDataset;

        let newMomDataset = {
            label: bodyName,
            data: [],
            backgroundColor: textColour,
            borderColor: textColour,
            pointRadius: 0,
        };

        let MomDatasets = MomentumChart.data.datasets;
        MomDatasets[MomDatasets.length] = newMomDataset;
    }

    if (errorText != "") {
        alert(errorText);
    }

    // Change the colour of the logo to indicate what button was last pressed
    changeBorder("#a1231e");
    spin = false;
    
}

function start() {
    run = true;
    changeBorder("#00b017");
    spin = false;
}

function pause() {
    run = false;
    changeBorder("#E3FF7D");
    spin = !spin; // Toggle the spin letiable
}

function step() {
    run = false;
    runSim();
    changeBorder("#002ebf");
    spin = false;
}

function createSketch() {
    let element = document.getElementById('sketch_holder');
    let positionInfo = element.getBoundingClientRect();
    let height = positionInfo.height;
    let width = positionInfo.width;

    createCanvas(width, height, WEBGL);
    background(200, 200, 200);
}

function windowResized() {
    createSketch();
}

function generateForces() {
    let Forces = [];
    // Generate the forces from all bodies on all bodies
    for (let currentIndex = 0; currentIndex < Bodies.length; currentIndex++) {
        let Force = new Vector(0, 0, 0);
        for (let otherIndex = 0; otherIndex < Bodies.length; otherIndex++) {
            if (currentIndex !== otherIndex) {
                let currentBody = Bodies[currentIndex];
                let otherBody = Bodies[otherIndex];
                const G = 6.67e-11;
                let distance = otherBody.getPos().sub(currentBody.getPos());
                let forceMag = G * currentBody.getMass() * otherBody.getMass() / Math.pow(distance.getMag(), 2);
                let tempForce = distance.normalise().multiply(forceMag);
                Force = Force.add(tempForce);
            }
        }
        Forces.push(Force);
    }
    return Forces;
}

function updatePositions() {
    let slider = document.getElementById("slider");
    let rate = map(int(slider.value), int(slider.min), int(slider.max), 0, 200);
    let dt = rate / 24 ;
    let Forces = generateForces();
    // Now we need to update their positions

    for (let currentIndex = 0; currentIndex < Bodies.length; currentIndex++) {
        let currentBody = Bodies[currentIndex];
        let force = Forces[currentIndex];
        let mass = currentBody.getMass();

        // Update momentum
        let dp = force.multiply(dt);
        currentBody.setMomentum(currentBody.getMomentum().add(dp));
        // Update position

        let ds = currentBody.getMomentum().multiply(dt / mass);
        currentBody.setPos(currentBody.getPos().add(ds));
    }
    
}

function drawCameraAndGrid(theta, viewHeight) {
    // We now need to position the camera so it views the environment nicely
    let max_X = 1;
    let max_Y = 1;

    // Loop through all bodies to get max X and Y positions
    for (const element of Bodies) {
        let body = element;

        // Maximum x and y positions include the position plus/minus the radius
        max_X = Math.max(max_X, Math.abs(body.getPos().x() + body.getRadius()), Math.abs(body.getPos().x() - body.getRadius()));
        max_Y = Math.max(max_Y, Math.abs(body.getPos().y() + body.getRadius()), Math.abs(body.getPos().y() - body.getRadius()));
    }

    // Decide which is larger, width or height
    let largestDimension = Math.max(max_X, max_Y);

    // Calculate the scaling factor to fit the largest dimension into the view
    let scalar = largestDimension * zoom;

    // Position the camera at a distance to fit the largest dimension into view
    let cameraDistance = (scalar / Math.tan(PI / 6)) * 2;

    // Set the camera position and perspective
    camera(
        cameraDistance * Math.sin(theta), // x position
        viewHeight,                      // y position (elevated)
        cameraDistance * Math.cos(theta), // z position
        0,                                // look at x
        viewHeight,                       // look at y
        0,                                // look at z
        0,                                // up vector x
        1,                                // up vector y
        0                                 // up vector z
    );

    // Ensure the far plane is always greater than the near plane
    let nearPlane = 0.1; // A small positive value
    let farPlane = Math.max(cameraDistance * 10); // Scaled based on scene size

    // Correct perspective settings
    perspective(
        PI / 3,                       // Field of view
        width / height,               // Aspect ratio
        nearPlane,                    // Near clipping plane
        farPlane                      // Far clipping plane
    );

    // Drawing the planes
    fill("yellow");

    // Grid scaling
    let grid_scale = 500; // Set a fixed grid scale

    // Helper function to draw a gridline as a cylinder
    function drawCylinder(x, y, z, rotateAxis, rotateAngle) {
        push(); // Save the current transformation state
        translate(x, y, z); // Move to the position
        if (rotateAxis) {
            rotate(rotateAngle, rotateAxis); // Apply rotation if specified
        }
        cylinder(1, 10 * grid_scale); // Draw the cylinder
        pop(); // Restore the previous transformation state
    }

    // Draw horizontal z gridlines
    for (let x = -grid_scale * 2; x <= grid_scale * 2; x += grid_scale) {
        for (let y = -grid_scale * 2; y <= grid_scale * 2; y += grid_scale) {
            if (x !== 0 || y !== 0) { // Exclude the central axis
                drawCylinder(x, y, 0, createVector(1, 0, 0), PI / 2); // Horizontal z-plane
            }
        }
    }

    // Draw vertical y gridlines
    for (let x = -grid_scale * 2; x <= grid_scale * 2; x += grid_scale) {
        for (let z = -grid_scale * 2; z <= grid_scale * 2; z += grid_scale) {
            drawCylinder(x, 0, z, null, 0); // Vertical y-plane
        }
    }

    // Draw vertical x gridlines
    for (let z = -grid_scale * 2; z <= grid_scale * 2; z += grid_scale) {
        for (let y = -grid_scale * 2; y <= grid_scale * 2; y += grid_scale) {
            drawCylinder(0, y, z, createVector(0, 0, 1), PI / 2); // Vertical x-plane
        }
    }
}

function bodiesIntersect() {
    let counter = 0;

    for (let index1 = 0; index1 < Bodies.length; index1++) {
        for (let index2 = counter; index2 < Bodies.length; index2++) {
            if (index1 !== index2) {
                let body1 = Bodies[index1];
                let body2 = Bodies[index2];

                // Calculate the two distances
                let distanceVector = body1.getPos().sub(body2.getPos());
                let distance = distanceVector.getMag();
                let radii = body1.getRadius() + body2.getRadius();

                // Check if bodies intersect
                if (distance < radii) {
                    return [body1, body2];
                }
            }
        }
        counter += 1;
    }

    // Return false if no intersections were found
    return false;
}

function collision() {
    // for each body compare with all other bodies
    intersectingBodies = bodiesIntersect();
    
    while (intersectingBodies != false) {
        combine(intersectingBodies[0], intersectingBodies[1]);
        intersectingBodies = bodiesIntersect();
    }
}

function combine(body1, body2) {
    // Use the details from the larger body as the colours and name
    let body_name = body2.getName();
    let colour = body2.getColour();
    if (body1.getMass() > body2.getMass()) {
        body_name = body1.getName();
        colour = body1.getColour();
    }
    // create new body
    let newBody = new Body(
        colour,
        body1.getMass() + body2.getMass(),
        body1.getPos(),
        body1.getMomentum().add(body2.getMomentum()),
        body_name
    );

    // remove body 1 and 2 which have just collided then add newBody
    let newBodies = [];
    
    for (const element of Bodies) {
        if ((body1 != element) && (body2 != element)) {
            newBodies.push(element);
        }
    }

    Bodies = newBodies;

    // add the new body to the array of bodies
    Bodies.push(newBody);
}

function mousePressed() {
    tempX = mouseX;
}

function mouseReleased() {
    oldTheta = theta;
}

function mouseDragged() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        theta = map(mouseX - tempX, 0, width, 0 + oldTheta, TWO_PI + oldTheta);
    }
}

function mouseWheel(event) {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        zoom += event.deltaY / 100;
        if (zoom < 0.1) {
            zoom = 0.1;
        }
        // Prevent default scrolling behaviour
        event.preventDefault();
    }
}

function runSim() {
    updatePositions();
    
    // now we need to draw all the bodies on the screen
    collision();

    // update pos graph
    for (const element of Bodies) {
        if (frameCount % 20 == 0) {
            addDataToPos(element.getName(), element.getPos().getMag());
            addDataToMom(element.getName(), element.getMomentum().getMag() * 1e7 / element.getMass());
        }
    }
}


function setup() {
    run = false;
    spin = false;
    bodiesAdded =
    theta = 0;
    tempX = 0;
    oldTheta = 0;
    zoom = 1;
    viewHeight = 0;
    Bodies = [];
    createSketch();
    addBody();
}

function draw() {
    background(40);
    noStroke();
    lights();

    if (keyIsDown(SHIFT)) {
        viewHeight += 50;
    } else if (keyIsDown(CONTROL)) {
        viewHeight -= 50;
    }

    drawCameraAndGrid(theta, viewHeight);

    if (spin) {
        oldTheta += 0.01;
        theta += 0.01;
    }
    
    if (run) {
        runSim();
    }

    for (currentIndex = 0; currentIndex < Bodies.length; currentIndex++) {
        Bodies[currentIndex].draw();
    }
}

class Body {
    constructor(inputColour, inputMass, inputPos, inputMomentum, inputName) {
        this._colour = inputColour;
        this._mass = inputMass;
        this._pos = inputPos;
        this._momentum = inputMomentum;
        this._radius = this.calculateRadius();
        this._trail = [inputPos];
        this._name = inputName;
    }

    getName() {
        return this._name;
    }

    setName(inputName) {
        this._name = inputName;
    }

    getColour() {
        return this._colour;
    }

    setColour(inputColour) {
        this._colour = inputColour;
    }

    getMass() {
        return this._mass;
    }

    setMass(inputMass) {
        this._mass = inputMass;
    }

    getPos() {
        return this._pos;
    }

    setPos(inputPos) {
        this._pos = inputPos;
    }

    getMomentum() {
        return this._momentum;
    }

    setMomentum(inputMomentum) {
        this._momentum = inputMomentum;
    }

    getRadius() {
        return this._radius;
    }

    calculateRadius() {
        return ((3 * Math.abs(this._mass) / (4 * Math.PI)) ** (1 / 3) * 100);
    }

    getTrail() {
        return this._trail;
    }

    addToTrail(inputPosition) {
        if (this.getTrail().length > 200) {
            this._trail.shift();
        }
        this._trail.push(inputPosition);
    }

    updatePath() {
        // calculate distance from last recorded position to current position
        let distance = this.getPos().sub(this.getTrail()[this.getTrail().length - 1]).getMag();
        
        if (distance > this.getRadius()) {
            this.addToTrail(this.getPos());
        }
    }

    drawPath() {
        // add all the points in the trail array to the curve and draw it
        let trailArray = this.getTrail();

        for (let pointIndex = 0; pointIndex < trailArray.length - 1; pointIndex++) {
            translate(
                trailArray[pointIndex].x(),
                trailArray[pointIndex].y(),
                trailArray[pointIndex].z()
            );

            sphere(10);

            translate(
                -trailArray[pointIndex].x(),
                -trailArray[pointIndex].y(),
                -trailArray[pointIndex].z()
            );
        }
    }

    draw() {
        translate(this._pos.x(), this._pos.y(), this._pos.z());
        fill(this._colour);
        sphere(this._radius);
        translate(-this._pos.x(), -this._pos.y(), -this._pos.z());
        this.updatePath();
        this.drawPath();
    }
}

class Vector {
    constructor(inputX, inputY, inputZ) {
        this._x = inputX;
        this._y = inputY;
        this._z = inputZ;
    }

    x() {
        return this._x;
    }

    y() {
        return this._y;
    }

    z() {
        return this._z;
    }

    xSet(inputX) {
        this._x = inputX;
    }

    ySet(inputY) {
        this._y = inputY;
    }

    zSet(inputZ) {
        this._z = inputZ;
    }

    getVector() {
        return new Vector(this._x, this._y, this._z);
    }

    setVector(vector) {
        this._x = vector.x();
        this._y = vector.y();
        this._z = vector.z();
    }

    getMag() {
        return (this._x ** 2 + this._y ** 2 + this._z ** 2) ** 0.5;
    }

    add(vector) {
        return new Vector(this._x + vector.x(), this._y + vector.y(), this._z + vector.z());
    }

    sub(vector) {
        return new Vector(this._x - vector.x(), this._y - vector.y(), this._z - vector.z());
    }

    normalise() {
        let magnitude = this.getMag();
        let x = this._x / magnitude;
        let y = this._y / magnitude;
        let z = this._z / magnitude;
        return new Vector(x, y, z);
    }

    multiply(scalar) {
        let x = this._x * scalar;
        let y = this._y * scalar;
        let z = this._z * scalar;
        return new Vector(x, y, z);
    }
}

function lookToAddBody() {
    if (Bodies.length < 10) {
        bodiesAdded++;
        addBody();
    } else {
        alert("Max of 10 bodies.");
    }
}

function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function addBody() {
    // creating button
    btn = document.createElement("BUTTON");
    bodyNumber = Bodies.length + 1;
    btn.classList.add("collapsible");
    btnText = document.createTextNode("Body " + str(bodyNumber));

    btn.appendChild(btnText);
    btn.onclick = function() {
        let content = this.nextElementSibling;
        // if open close
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            // close all tables
            let tables = document.getElementsByClassName("content");
            for (i = 0; i < tables.length; i++) {
                tables[i].style.display = "none";
            }

            // open buttons table
            content.style.display = "block";
        }
    };

    Red = int(random(100, 255));
    Green = int(random(100, 255));
    Blue = int(random(100, 255));
    btn.style.backgroundColor = rgbToHex(Red, Green, Blue);
    btn.title = "Click me to edit my attributes.";
    document.getElementsByClassName("bodyButtons")[0].appendChild(btn);

    // creating table
    div = document.createElement("DIV");
    div.classList.add("content");
    table = document.createElement("TABLE");

    // Name
    tr1 = document.createElement("TR");
    td1_Title = document.createElement("TD");
    td1_NameText = document.createTextNode("Name");
    td1_Title.appendChild(td1_NameText);
    td1_Inp = document.createElement("TD");
    td1_Inp.colSpan = 6;
    Name = document.createElement("INPUT");
    Name.type = "text";
    Name.value = "Body " + str(bodiesAdded);
    Name.classList.add("Name");
    td1_Inp.appendChild(Name);
    tr1.appendChild(td1_Title);
    tr1.appendChild(td1_Inp);
    table.appendChild(tr1);

    // Mass
    tr2 = document.createElement("TR");
    td2_Title = document.createElement("TD");
    td2_NameText = document.createTextNode("Mass");
    td2_Title.appendChild(td2_NameText);
    td2_Inp = document.createElement("TD");
    td2_Inp.colSpan = 6;
    Mass = document.createElement("INPUT");
    Mass.type = "number";
    Mass.min = 0.01;
    Mass.max = 2;
    Mass.step = 0.01;
    Mass.value = Math.round(random(0.5, 2) * 100) / 100;
    Mass.classList.add("Mass");
    td2_Inp.appendChild(Mass);
    tr2.appendChild(td2_Title);
    tr2.appendChild(td2_Inp);
    table.appendChild(tr2);

    // Position
    tr3 = document.createElement("TR");
    td3_Title = document.createElement("TD");
    td3_NameText = document.createTextNode("Position");
    td3_Title.appendChild(td3_NameText);
    tr3.appendChild(td3_Title);

    // X
    td3_X = document.createElement("TD");
    td3_X_Name = document.createTextNode("X");
    td3_X.appendChild(td3_X_Name);
    td3_X_Inp = document.createElement("TD");
    PosX = document.createElement("INPUT");
    PosX.type = "number";
    PosX.min = -500;
    PosX.max = 500;
    PosX.step = 1;
    PosX.value = int(random(-500, 500));
    PosX.classList.add("PosX");
    td3_X_Inp.appendChild(PosX);

    // Y
    td3_Y = document.createElement("TD");
    td3_Y_Name = document.createTextNode("Y");
    td3_Y.appendChild(td3_Y_Name);
    td3_Y_Inp = document.createElement("TD");
    PosY = document.createElement("INPUT");
    PosY.type = "number";
    PosY.min = -500;
    PosY.max = 500;
    PosY.step = 1;
    PosY.value = int(random(-500, 500));
    PosY.classList.add("PosY");
    td3_Y_Inp.appendChild(PosY);

    // Z
    td3_Z = document.createElement("TD");
    td3_Z_Name = document.createTextNode("Z");
    td3_Z.appendChild(td3_Z_Name);
    td3_Z_Inp = document.createElement("TD");
    PosZ = document.createElement("INPUT");
    PosZ.type = "number";
    PosZ.min = -500;
    PosZ.max = 500;
    PosZ.step = 1;
    PosZ.value = int(random(-1000, 0));
    PosZ.classList.add("PosZ");
    td3_Z_Inp.appendChild(PosZ);

    tr3.appendChild(td3_X);
    tr3.appendChild(td3_X_Inp);
    tr3.appendChild(td3_Y);
    tr3.appendChild(td3_Y_Inp);
    tr3.appendChild(td3_Z);
    tr3.appendChild(td3_Z_Inp);
    table.appendChild(tr3);

    // Momentum
    tr4 = document.createElement("TR");
    td4_Title = document.createElement("TD");
    td4_NameText = document.createTextNode("Momentum");
    td4_Title.appendChild(td4_NameText);
    tr4.appendChild(td4_Title);

    // X
    td4_X = document.createElement("TD");
    td4_X_Name = document.createTextNode("X");
    td4_X.appendChild(td4_X_Name);
    td4_X_Inp = document.createElement("TD");
    MomentumX = document.createElement("INPUT");
    MomentumX.type = "number";
    MomentumX.min = -10;
    MomentumX.max = 10;
    MomentumX.step = 0.1;
    MomentumX.value = int(random(1, 10) * 10) / 10 * random([-1, 1]);
    MomentumX.classList.add("MomentumX");
    td4_X_Inp.appendChild(MomentumX);

    // Y
    td4_Y = document.createElement("TD");
    td4_Y_Name = document.createTextNode("Y");
    td4_Y.appendChild(td4_Y_Name);
    td4_Y_Inp = document.createElement("TD");
    MomentumY = document.createElement("INPUT");
    MomentumY.type = "number";
    MomentumY.min = -10;
    MomentumY.max = 10;
    MomentumY.step = 0.1;
    MomentumY.value = int(random(1, 10) * 10) / 10 * random([-1, 1]);
    MomentumY.classList.add("MomentumY");
    td4_Y_Inp.appendChild(MomentumY);

    // Z
    td4_Z = document.createElement("TD");
    td4_Z_Name = document.createTextNode("Z");
    td4_Z.appendChild(td4_Z_Name);
    td4_Z_Inp = document.createElement("TD");
    MomentumZ = document.createElement("INPUT");
    MomentumZ.type = "number";
    MomentumZ.min = -10;
    MomentumZ.max = 10;
    MomentumZ.step = 0.1;
    MomentumZ.value = int(random(1,10) * 10) / 10 * random([-1,1]);
    MomentumZ.classList.add("MomentumZ");
    td4_Z_Inp.appendChild(MomentumZ);

    // Append inputs for position
    tr4.appendChild(td4_X);
    tr4.appendChild(td4_X_Inp);
    tr4.appendChild(td4_Y);
    tr4.appendChild(td4_Y_Inp);
    tr4.appendChild(td4_Z);
    tr4.appendChild(td4_Z_Inp);

    // Add the row to the table
    table.appendChild(tr4);

    // Colour
    tr5 = document.createElement("TR");

    td5_Title = document.createElement("TD");
    td5_NameText = document.createTextNode("Colour");
    td5_Title.appendChild(td5_NameText);
    tr5.appendChild(td5_Title);

    // R
    td5_R = document.createElement("TD");
    td5_R_Name = document.createTextNode("R");
    td5_R.appendChild(td5_R_Name);

    td5_R_Inp = document.createElement("TD");
    R = document.createElement("INPUT");
    R.type = "number";
    R.value = Red;
    R.min = 0;
    R.max = 255;
    R.step = 1;
    R.classList.add("R");
    td5_R_Inp.appendChild(R);

    // G
    td5_G = document.createElement("TD");
    td5_G_Name = document.createTextNode("G");
    td5_G.appendChild(td5_G_Name);

    td5_G_Inp = document.createElement("TD");
    G = document.createElement("INPUT");
    G.type = "number";
    G.value = Green;
    G.min = 0;
    G.max = 255;
    G.step = 1;
    G.classList.add("G"); // Fixed typo from "adda" to "add"
    td5_G_Inp.appendChild(G);

    // B
    td5_B = document.createElement("TD");
    td5_B_Name = document.createTextNode("B");
    td5_B.appendChild(td5_B_Name);

    td5_B_Inp = document.createElement("TD");
    B = document.createElement("INPUT");
    B.type = "number";
    B.value = Blue;
    B.min = 0;
    B.max = 255;
    B.step = 1;
    B.classList.add("B");
    td5_B_Inp.appendChild(B);

    // Append RGB to the table row
    tr5.appendChild(td5_R);
    tr5.appendChild(td5_R_Inp);
    tr5.appendChild(td5_G);
    tr5.appendChild(td5_G_Inp);
    tr5.appendChild(td5_B);
    tr5.appendChild(td5_B_Inp);

    // Add the row to the table
    table.appendChild(tr5);

    // Add the delete button
    tr6 = document.createElement("TR");
    td6 = document.createElement("TD");
    td6.colSpan = 7;

    deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteButton");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
        this.parentNode.parentNode.parentNode.parentNode.previousElementSibling.remove();
        this.parentNode.parentNode.parentNode.parentNode.remove();
        reset();
    };

    td6.appendChild(deleteButton);
    tr6.appendChild(td6);

    // Add the row to the table
    table.appendChild(tr6);

    // Adding final table to div
    div.appendChild(table);
    document.getElementsByClassName("bodyButtons")[0].appendChild(div);

    // Add new data set to graphs
    textColour = [Red, Green, Blue];

    newPosDataset = {
        label: str("Body " + str(bodyNumber)),
        data: [],
        backgroundColor: textColour,
        borderColor: textColour,
        pointRadius: 0,
    };

    // Add new position dataset to chart
    let PosDatasets = PositionChart.data.datasets;
    PosDatasets[PosDatasets.length] = newPosDataset;

    newMomDataset = {
        label: str("Body " + str(bodyNumber)),
        data: [],
        backgroundColor: textColour,
        borderColor: textColour,
        pointRadius: 0,
    };

    // Add new momentum dataset to chart
    let MomDatasets = MomentumChart.data.datasets;
    MomDatasets[MomDatasets.length] = newMomDataset;

    // Add data to bodies
    let newBody = new Body(
        textColour,
        parseFloat(Mass.value),
        new Vector(parseFloat(PosX.value), parseFloat(PosY.value), parseFloat(PosZ.value)),
        new Vector(parseFloat(MomentumX.value), parseFloat(MomentumY.value), parseFloat(MomentumZ.value)),
        Name
    );
    Bodies.push(newBody);

    // Run reset to get all the new data and add it to the sim
    reset();
}

// Function to add data to position chart
function addDataToPos(bodyName, bodydata) {
    PositionChart.data.datasets.forEach((dataset) => {
        if (str(bodyName) == str(dataset.label)) {
            PositionChart.data.labels.push("");
            if (dataset.data.length < 100) {
                dataset.data.push(bodydata);
            } else {
                dataset.data.shift();
                dataset.data.push(bodydata);
            }
        }
    });
    PositionChart.update();
}

// Function to add data to momentum chart
function addDataToMom(bodyName, bodydata) {
    MomentumChart.data.datasets.forEach((dataset) => {
        if (str(bodyName) == str(dataset.label)) {
            MomentumChart.data.labels.push();
            if (dataset.data.length < 100) {
                dataset.data.push(bodydata);
            } else {
                dataset.data.shift();
                dataset.data.push(bodydata);
            }
        }
    });
    MomentumChart.update();
}