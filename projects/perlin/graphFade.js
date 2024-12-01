function graphFade(p, sketchManager) {
    p.sketchManager = sketchManager;

    let x4 = parseFloat(document.getElementById("x4").value);
    let x3 = parseFloat(document.getElementById("x3").value);
    let x2 = parseFloat(document.getElementById("x2").value);
    let x1 = parseFloat(document.getElementById("x1").value);
    let x0 = parseFloat(document.getElementById("x0").value);
    let coefficients = [x0,x1,x2,x3,x4];
    let xMin = -.5, xMax = 2; // x-axis range
    let yMin = -.5, yMax = 2; // y-axis range


    //// at the top of every sketch
    p.setup = function() {
      let sizes = getWidthAndHeight();
      let canvas = p.createCanvas(sizes[0], sizes[1]);
      let container = document.getElementById("graphFade");
      canvas.parent(container);
      canvas.mousePressed(function() {
        if (p.sketchManager) {
          p.sketchManager.toggleLoop(p);
        }
      });

      p.resetSketch();

      //document.getElementById("perlin2d_reset").onclick = function() {p.resetSketch();};
  
      document.getElementById("x4").addEventListener("change", function() {checkInputs();});
      document.getElementById("x3").addEventListener("change", function() {checkInputs();});
      document.getElementById("x2").addEventListener("change", function() {checkInputs();});
      document.getElementById("x1").addEventListener("change", function() {checkInputs();});
      document.getElementById("x0").addEventListener("change", function() {checkInputs();});
    };
  
    function getWidthAndHeight() {
      let container = document.getElementById("graphFade");
      let style = getComputedStyle(container);
      let contentWidth = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);

      return [contentWidth, contentWidth/3];
    }
  
    p.windowResized = function() {
      let sizes = getWidthAndHeight();
      p.resizeCanvas(sizes[0], sizes[1]);
      resizing = true;
    }

    p.resetSketch = function() {
        /// Unique to this sketch 
        x4 = validInput("x4");
        x3 = validInput("x3");
        x2 = validInput("x2");
        x1 = validInput("x1");
        x0 = validInput("x0");
        coefficients = [x0,x1,x2,x3,x4];
        p.loop();
        p.noLoop();
    }
    ////

    function validInput(id) {
        let elt = document.getElementById(id);
        // max bound
        if (parseFloat(elt.value) > parseFloat(elt.max)) {
            elt.value = elt.max;
        }
        // min bound
        if (parseFloat(elt.value) < parseFloat(elt.min)) {
            elt.value = elt.max;
        }
        return parseFloat(elt.value)
    }
  
    function checkInputs() {
        // need to redraw sketch
        if (x4 != parseFloat(document.getElementById("x4").value)||
            x3 != parseFloat(document.getElementById("x3").value)||
            x2 != parseFloat(document.getElementById("x2").value)||
            x1 != parseFloat(document.getElementById("x1").value)||
            x0 != parseFloat(document.getElementById("x0").value)||
            do_fade != document.getElementById("do_fade").checked
            ) {
        p.resetSketch();
        p.windowResized();
        }
    }
    
    // Quartic function evaluation
    function evaluateQuartic(x) {
        let y = 0;
        for (let i = 0; i < coefficients.length; i++) {
            y += coefficients[i] * Math.pow(x, i);
        }
        return y;
    }

    p.draw = function() {
        p.background(255); // White background
        p.stroke(0); // Black lines
        p.strokeWeight(2);
        p.noFill();

        // Draw x-axis and y-axis
        p.stroke(150);
        let x0 = p.map(0, xMin, xMax, 0, p.width);
        let y0 = p.map(0, yMin, yMax, p.height, 0);
        p.line(0, y0, p.width, y0); // x-axis
        p.line(x0, 0, x0, p.height); // y-axis

        // Draw the quartic curve
        p.stroke(50, 100, 255); // Blue for the quartic line
        p.beginShape();
        for (let xPixel = 0; xPixel < p.width; xPixel++) {
            let x = p.map(xPixel, 0, p.width, xMin, xMax);
            let y = evaluateQuartic(x);
            let yPixel = p.map(y, yMin, yMax, p.height, 0);
            p.vertex(xPixel, yPixel);
        }
        p.endShape();
    };
}

