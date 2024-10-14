function gridDefine(p, sketchManager) {
    p.sketchManager = sketchManager;
    
    reset_button();
    let inpCols = parseInt(document.getElementById("gridDefine_cols").value);
    let inpRows = parseInt(document.getElementById("gridDefine_rows").value);
    let cols = inpCols + 2;
    let rows = inpRows + 2;
    let rez = parseInt(document.getElementById("gridDefine_rez").value);

    let pixelWidth;
    let resizing = false;
  
    //// at the top of every sketch
    p.setup = function() {
      let sizes = getWidthAndHeight();
      let canvas = p.createCanvas(sizes[0], sizes[1]);
      let container = document.getElementById("gridDefine");
      canvas.parent(container);
      canvas.mousePressed(function() {
        if (p.sketchManager) {
          p.sketchManager.toggleLoop(p);
        }
      });
      
      resetSketch();
  
      document.getElementById("gridDefine_reset").onclick = function() {reset_button()};
      document.getElementById("gridDefine_cols").addEventListener("change", function() {checkInputs();});
      document.getElementById("gridDefine_rows").addEventListener("change", function() {checkInputs();});
      document.getElementById("gridDefine_rez").addEventListener("change", function() {checkInputs();});

    };
  
    // Draw pixels
    function getWidthAndHeight() {
      let container = document.getElementById("gridDefine");
      let style = getComputedStyle(container);
      let contentWidth = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      
      pixelWidth = contentWidth / (cols * rez);
      let contentHeight = rows * rez * pixelWidth;
      let origialWidth = contentWidth;
      while (contentHeight > origialWidth) {
       contentHeight *= 0.99;
       contentWidth *= 0.99;
       pixelWidth *= 0.99;  
      }
      return [contentWidth, contentHeight];
    }
  
    p.windowResized = function() {
      let sizes = getWidthAndHeight();
      p.resizeCanvas(sizes[0], sizes[1]);
      resizing = true;
    } 

    function reset_button() {
      document.getElementById("gridDefine_cols").value = 3;
      document.getElementById("gridDefine_rows").value = 2;
      document.getElementById("gridDefine_rez").value = 3;
      p.redraw();
    }
  
    function resetSketch() {
      /// Unique to this sketch
      inpCols = validInput("gridDefine_cols");
      inpRows = validInput("gridDefine_rows");
      cols = inpCols + 2;
      rows = inpRows + 2;
      rez = validInput("gridDefine_rez");
      resizing = false;
      p.redraw();
  
    }
    ////

    function validInput(id) {
      let elt = document.getElementById(id);
      // max bound
      if (parseInt(elt.value) > parseInt(elt.max)) {
        elt.value = elt.max;
      }
      // min bound
      if (parseInt(elt.value) < parseInt(elt.min)) {
        elt.value = elt.max;
      }
      if (parseFloat(elt.value)%parseFloat(elt.step) != 0) {
        elt.value = parseFloat(elt.value) - parseFloat(elt.value)%parseFloat(elt.step);
      }
      return parseInt(elt.value)
    }

    function checkInputs() {
      if (inpCols != parseInt(document.getElementById("gridDefine_cols").value) ||
          inpRows != parseInt(document.getElementById("gridDefine_rows").value) ||
          rez != parseInt(document.getElementById("gridDefine_rez").value)) {
          resetSketch();
          p.windowResized();
      }
    }
  
    p.draw = function() {
        checkInputs();

        p.background(255);
  
        // Draw grid lines
        p.strokeWeight(3);
        p.stroke(200);
        for (let i = rez; i  + rez < cols * rez + 1; i += 1) {
            p.line(i * pixelWidth, rez * pixelWidth, i * pixelWidth, p.height - rez * pixelWidth);
        }

        for (let j = rez; j + rez < rows * rez + 1; j += 1) {
            p.line(rez * pixelWidth, j * pixelWidth, p.width - rez * pixelWidth, j * pixelWidth);
        }

        p.strokeWeight(4);
        p.stroke(0);
        for (let i = 1; i < cols; i += 1) {  
            p.line(i * rez *pixelWidth, rez * pixelWidth, i * rez * pixelWidth, p.height - rez * pixelWidth);
        }

        for (let j = 1; j < rows; j += 1) {
            p.line(rez * pixelWidth, j * rez * pixelWidth, p.width - rez * pixelWidth, j * rez * pixelWidth);
        }

        if (!resizing){
        ;
        } else {
        resizing = false;
        }
    };
  }
  
  
  // notes: add customisation controls width height cols toggles for arrows and grids and weighting for components, using fade or not
  
  // big idea see how other programs run using that 'custom perlin noise' v v interesting 
  
  // add animation for panning through 3d box version next to 2d version