function perlin2d(p, sketchManager) {
  p.sketchManager = sketchManager;

  resetInputs(true);
  let x4 = parseFloat(document.getElementById("x4").value);
  let x3 = parseFloat(document.getElementById("x3").value);
  let x2 = parseFloat(document.getElementById("x2").value);
  let x1 = parseFloat(document.getElementById("x1").value);
  let x0 = parseFloat(document.getElementById("x0").value);
  let coefficients = [x0,x1,x2,x3,x4];
  
  let do_fade = document.getElementById("do_fade").checked;

  const cols = 8;
  const rows = 8;
  const rez = 16;
  const show_grid = false;
  const show_vectors = false;
  

  const weightX = 1;
  const weightY = 1;

  let pixelWidth;
  let resizing = false;
  let grid;

  //// at the top of every sketch
  p.setup = function() {
    let sizes = getWidthAndHeight();
    let canvas = p.createCanvas(sizes[0], sizes[1]);
    let container = document.getElementById("perlin2d");
    canvas.parent(container);
    canvas.mousePressed(function() {
      if (p.sketchManager) {
        p.sketchManager.toggleLoop(p);
      }
    });

    resetSketch();

    document.getElementById("perlin2d_reset").onclick = function() {resetSketch(); resetInputs();

    };

    document.getElementById("x4").addEventListener("change", function() {checkInputs();});
    document.getElementById("x3").addEventListener("change", function() {checkInputs();});
    document.getElementById("x2").addEventListener("change", function() {checkInputs();});
    document.getElementById("x1").addEventListener("change", function() {checkInputs();});
    document.getElementById("x0").addEventListener("change", function() {checkInputs();});
    document.getElementById("do_fade").addEventListener("change", function() {checkInputs();});
  };

  function getWidthAndHeight() {
    let container = document.getElementById("perlin2d");
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

  function resetInputs(first) {
    let initial_x4 = 6;
    let initial_x3 = -15;
    let initial_x2 = 10;
    let initial_x1 = 0;
    let initial_x0 = 0;
    let initial_do_fade = true;

    document.getElementById("x4").value = initial_x4;
    document.getElementById("x3").value = initial_x3;
    document.getElementById("x2").value = initial_x2;
    document.getElementById("x1").value = initial_x1;
    document.getElementById("x0").value = initial_x0;
    document.getElementById("do_fade").checked = initial_do_fade;
    
    if (!first) {
        checkInputs();
    }   
}

  function resetSketch() {
    /// Unique to this sketch   
    x4 = validInput("x4");
    x3 = validInput("x3");
    x2 = validInput("x2");
    x1 = validInput("x1");
    x0 = validInput("x0");
    do_fade = document.getElementById("do_fade").checked;  

    coefficients = [x0,x1,x2,x3,x4];
    
    grid = [];
    for (let col = 0; col < cols + 1; col += 1) {
      let temp = [];
      for (let row = 0; row < rows + 1; row += 1) {
        const a = p.random(p.TWO_PI);
        temp.push([weightX*p.cos(a), weightY*p.sin(a)]);
      }
      grid.push(temp);
    }
    p.loop();
    ///
    p.noLoop();

    graphFadeInstance.resetSketch();
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
      resetSketch();
      p.windowResized();
    }
  }

  function fade(t) {
    let tot = 0;
    for (let i = 0; i < coefficients.length; i ++) {
      tot += coefficients[i] * t ** (i+1);
    }
    return tot;
  }

  p.draw = function() {
    p.background(255);
    
    for (let col = 0; col < cols; col += 1) {
      for (let row = 0; row < rows; row += 1) {
        for (let j = 0; j < rez; j += 1) {
          for (let i = 0; i < rez; i += 1) {
            let x0 = (i+0.5)/rez;
            let x1 = x0 - 1;
            let y0 = (j+0.5)/rez;
            let y1 = y0 - 1;            
            
            let D1 = grid[col  ][row  ][0] * x0 + 
                     grid[col  ][row  ][1] * y0;
            let D2 = grid[col  ][row+1][0] * x1 + 
                     grid[col  ][row+1][1] * y0;
            let D3 = grid[col+1][row  ][0] * x0 + 
                     grid[col+1][row  ][1] * y1;
            let D4 = grid[col+1][row+1][0] * x1 + 
                     grid[col+1][row+1][1] * y1;
            
            if (do_fade) {
              x0 = fade(x0);
              y0 = fade(y0);
            }
            let temp1 = p.lerp(D1, D2, x0);
            
            let temp2 = p.lerp(D3, D4, x0);

            let val = p.lerp(temp1, temp2, y0);

            p.stroke(p.map(val, -1, 1, 0, 255));
            p.fill(p.map(val, -1, 1, 0, 255));
            
            p.rect(
              (col * rez + j) * pixelWidth, 
              (row * rez + i) * pixelWidth, 
              pixelWidth, 
              pixelWidth);
          }
        }
      }
    }

    // Draw grid lines
    if (show_grid) {
      p.strokeWeight(3);
      p.stroke(200);
      for (let i = 0; i < cols * rez + 1; i += 1) {
        p.line(i * pixelWidth, 0, i * pixelWidth, p.height);
      }

      for (let j = 0; j < rows * rez + 1; j += 1) {
        p.line(0, j * pixelWidth, p.width, j * pixelWidth);
      }

      p.strokeWeight(4);
      p.stroke(0);
      for (let i = 0; i < cols + 1; i += 1) {  
        p.line(i * rez *pixelWidth, 0, i * rez * pixelWidth, p.height);
      }

      for (let j = 0; j < rows + 1; j += 1) {
        p.line(0, j * rez * pixelWidth, p.width, j * rez * pixelWidth);
      }
    }

    if (show_vectors) {
      p.stroke(255, 0, 0);
      p.strokeWeight(3);
      // Draw random vecs
      for (let col = 0; col < cols + 1; col += 1) {
        for (let row = 0; row < rows + 1; row += 1) {
          let vec = grid[col][row];
          let x0 = col * rez * pixelWidth;
          let y0 = row * rez * pixelWidth;
          let x1 = x0 + vec[0] * rez * pixelWidth/3;
          let y1 = y0 + vec[1] * rez * pixelWidth/3;
          p.line(x0, y0, x1, y1);
        }
      }
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