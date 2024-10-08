function perlin2d(p, sketchManager) {
  p.sketchManager = sketchManager;

  const cols = 8;
  const rows = 8;
  const rez = 16;
  const show_grid = false;
  const show_vectors = false;
  const do_fade = true;
  const coefficients = [0, 0, 10, -15, 6];
  const use_list_vecs = false;

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

    document.getElementById("perlin2d_reset").onclick = function() {resetSketch()};
  };

  // Draw pixels
  function getWidthAndHeight() {
    let container = document.getElementById("perlin2d");
    let style = getComputedStyle(container);
    let contentWidth = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    
    pixelWidth = contentWidth / (cols * rez);
    let contentHeight = rows * rez * pixelWidth;
    //if (contentHeight > 400) {
    //  contentHeight /= 2;
    //  contentWidth /= 2;
    //  pixelWidth /= 2;  
    //}
    return [contentWidth, contentHeight];
  }

  p.windowResized = function() {
    let sizes = getWidthAndHeight();
    p.resizeCanvas(sizes[0], sizes[1]);
    resizing = true;
  } 

  function resetSketch() {
    /// Unique to this sketch   
    grid = [];
    const vecs = [
      [1,1],[-1,1],[1,-1],[-1,-1],
      [1.414,0],[0,1.414],[0,-1.414],[-1.414,0]]
    for (let col = 0; col < cols + 1; col += 1) {
      let temp = [];
      for (let row = 0; row < rows + 1; row += 1) {
        if (use_list_vecs) {
          temp.push(p.random(vecs));          
        } else {
          const a = p.random(p.TWO_PI);
          temp.push([weightX*p.cos(a), weightY*p.sin(a)]);
        }
      }
      grid.push(temp);
    }
    p.loop();
    ///
    p.noLoop();
  }
  ////

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
            
            //p.stroke(0,255,0);
            //p.line(0,0,x0*rez * pixelWidth,y0 * rez * pixelWidth);
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