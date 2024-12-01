function perlinCalcs(p, sketchManager) {
    p.sketchManager = sketchManager;

    reset_inp_button(true);
    let cols = parseInt(document.getElementById("perlinCalcs_cols").value);
    let rows = parseInt(document.getElementById("perlinCalcs_rows").value);
    let structureCols = cols + 2;
    let structureRows = rows + 2;
    let rez = parseInt(document.getElementById("perlinCalcs_rez").value);
    let show_grid = document.getElementById("perlinCalcs_show_grid").checked;
    let coefficients = [0, 0, 10, -15, 6];
    let do_fade = true;

    let displayVectors = true;
    let displayInterp = true;
    let displayCells = false;

    let angles;
    
    let hCol;
    let hRow;
    let hI;
    let hJ;

    let pixelWidth;
    let resizing = false;
    let grid;
  
    //// at the top of every sketch
    p.setup = function() {
      let sizes = getWidthAndHeight();
      let canvas = p.createCanvas(sizes[0], sizes[1]);
      let container = document.getElementById("perlinCalcs");
      canvas.parent(container);
      canvas.mousePressed(function() {
        if (p.sketchManager) {
          p.sketchManager.toggleLoop(p);
        }
      });
      check_step_input();
      resetSketch();
  
      document.getElementById("perlinCalcs_reset").onclick = function() {resetSketch();};
      document.getElementById("perlinCalcs_input_reset").onclick = function() {reset_inp_button(false);};
      document.getElementById("perlinCalcs_cols").addEventListener("change", function() {checkInputs();});
      document.getElementById("perlinCalcs_rows").addEventListener("change", function() {checkInputs();});
      document.getElementById("perlinCalcs_rez").addEventListener("change", function() {checkInputs();});
      document.getElementById("perlinCalcs_show_grid").addEventListener("change", function() {checkInputs();});


      document.getElementById("perlinCalcs_step_1").addEventListener("change", function() {check_step_input();});

      document.getElementById("perlinCalcs_step_2").addEventListener("change", function() {check_step_input();});

      document.getElementById("perlinCalcs_step_3").addEventListener("change", function() {check_step_input();});
    };
  
    function getWidthAndHeight() {
      let container = document.getElementById("perlinCalcs");
      let style = getComputedStyle(container);
      let contentWidth = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      
      pixelWidth = contentWidth / (structureCols * rez);
      let contentHeight = structureRows * rez * pixelWidth;
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

    function reset_inp_button(first) {
        let initial_cols = 3;
        let initial_rows = 2;
        let initial_rez = 5;
        let initial_show_grid = true;
        document.getElementById("perlinCalcs_cols").value = initial_cols;
        document.getElementById("perlinCalcs_rows").value = initial_rows;
        document.getElementById("perlinCalcs_rez").value = initial_rez;
        document.getElementById("perlinCalcs_show_grid").checked = initial_show_grid;
        if (!first) {
            checkInputs();
        }   
    }

    function resetSketch() {
        /// Unique to this sketch 
        cols = validInput("perlinCalcs_cols");
        rows = validInput("perlinCalcs_rows");
        structureCols = cols + 2;
        structureRows = rows + 2;
        rez = validInput("perlinCalcs_rez");

        p.frameRate(rows * cols * rez * rez / 5);
        
        hCol = 0;
        hRow = 0;
        hI = 0;
        hJ = 0;

        angles = []; 
        for (let i = 0; i < rows + 1; i++) {
            let temp = [];
            for (let j = 0; j < cols + 1; j++) {
                temp.push(p.random(p.TWO_PI));
                //temp.push(p.PI / 4);
            }
            angles.push(temp)
        }

        grid = [];
        for (let i = 0; i < cols + 1; i += 1) {  
            let temp = [];
            for (let j = 0; j < rows + 1; j += 1) {
                temp.push([p.cos(-angles[j][i]), p.sin(-angles[j][i])]);
            }
            grid.push(temp);
        }
        p.loop();
        p.noLoop();
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

        // need to redraw sketch
        if (cols != parseInt(document.getElementById("perlinCalcs_cols").value) ||
            rows != parseInt(document.getElementById("perlinCalcs_rows").value) ||
            rez  != parseInt(document.getElementById("perlinCalcs_rez").value)) {
            resetSketch();
            p.windowResized();
        }

        // don't need to redraw sketch
        if (show_grid != document.getElementById("perlinCalcs_show_grid").checked) {
            show_grid = document.getElementById("perlinCalcs_show_grid").checked;
            p.redraw();
        }
    }
  
    function drawVector(Ax, Ay, Bx, By) {
        // Draw the main line (vector body)
        p.line(Ax, Ay, Bx, By);
        
        // Calculate the angle of the line
        let angle = p.atan2(By - Ay, Bx - Ax);
        
        // Define the size of the arrowhead
        let arrowSize = 10;/////////////////////Scale 
        
        // Draw the arrowhead using lines
        p.push();
        p.translate((Ax+Bx)/2, (Ay+By)/2);  // Move to the end of the vector
        p.rotate(angle);        // Rotate the arrow to align with the vector
        
        // Draw two lines to form the arrowhead
        p.line(0, 0, -arrowSize, arrowSize / 2);
        p.line(0, 0, -arrowSize, -arrowSize / 2);
        
        p.pop();
    }

    function fade(t) {
        let tot = 0;
        for (let i = 0; i < coefficients.length; i ++) {
            tot += coefficients[i] * t ** (i+1);
        }
        return tot;
    }

    function drawCells() {
        p.background(255);
        // Fill cells with colour
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
                        
                        p.strokeWeight(1);
                        p.stroke(p.map(val, -1, 1, 0, 255));
                        p.fill(p.map(val, -1, 1, 0, 255));
                        if (displayCells) {
                            p.rect(
                                ((col + 1) * rez + j) * pixelWidth, 
                                ((row + 1) * rez + i) * pixelWidth, 
                                pixelWidth, 
                                pixelWidth);
                        }
                            
                        //p.line((col + 1) * rez * pixelWidth, rez / 4 * pixelWidth ,);
                            
                        if (col == hCol && row == hRow && i == hI && j == hJ && displayInterp) {
                                // top line coords
                                let line1x = (col + 1) * rez * pixelWidth;
                                let line1y = rez * 3 / 4 * pixelWidth;
                                let line2x = (col + 2) * rez * pixelWidth;
                                let line2y = rez / 4 * pixelWidth;
                                
                                // bottom line coords
                                let line3y = p.height - line2y;
                                let line4y = p.height - line1y;
                                // right line coords
                                let line5x = p.width - line1y;
                                let line5y = (row + 1) * rez * pixelWidth;
                                let line6x = p.width - line2y;
                                let line6y = (row + 2) * rez * pixelWidth;

                                if (D1 > D2) {
                                    let temp = line1y;
                                    line1y = line2y;
                                    line2y = temp;
                                }
                                if (D3 > D4) {
                                    let temp = line3y;
                                    line3y = line4y;
                                    line4y = temp;
                                }
                                if (temp1 > temp2) {
                                    let temp = line5x;
                                    line5x = line6x;
                                    line6x = temp;
                                }
                                
                                new_line1y = p.map(D1, -Math.sqrt(2), Math.sqrt(2), line1y, line2y);
                                new_line2y = p.map(D2, -Math.sqrt(2), Math.sqrt(2), line1y, line2y);
                                
                                new_line3y = p.map(D3, -Math.sqrt(2), Math.sqrt(2), line3y, line4y);
                                new_line4y = p.map(D4, -Math.sqrt(2), Math.sqrt(2), line3y, line4y);
                                
                                new_line5x = p.map(temp1, -Math.sqrt(2), Math.sqrt(2), line5x, line6x);
                                new_line6x = p.map(temp2, -Math.sqrt(2), Math.sqrt(2), line5x, line6x);

                                // top and bottom circle coords
                                let x1 = ((col + 1) * rez + i + 0.5) * pixelWidth;
                                let y1 = p.map(2*(i + 1), 1, rez * 2 + 1, new_line1y, new_line2y);
                                let y2 = p.map(2*(i + 1), 1, rez * 2 + 1, new_line3y, new_line4y);
                                // right circle coords
                                let x2 = p.map(2*(j + 1), 1, rez * 2 + 1, new_line5x, new_line6x);
                                let y3 = ((row + 1) * rez + j + 0.5) * pixelWidth;

                                // draw orange lines
                                p.strokeWeight(3)
                                p.stroke(255, 165, 0);
                                // top
                                p.line(line1x, new_line1y, line2x, new_line2y);
                                // bottom
                                p.line(line1x, new_line3y, line2x, new_line4y);
                                // right
                                p.line(new_line5x, line5y, new_line6x, line6y);

                                // draw pink circle
                                p.fill(255, 165, 255);
                                p.noStroke();
                                // top
                                p.circle(x1, y1, pixelWidth / 3);
                                // bottom
                                p.circle(x1, y2, pixelWidth / 3);
                                // right
                                p.circle(x2, y3, pixelWidth / 3);
                        }
                    }
                }
            }
        }
    }

    function drawGrid() {
        // Draw grid lines
        p.strokeWeight(2);
        p.stroke(200);

        for (let i = rez; i + rez < structureCols * rez + 1; i += 1) {
            p.line(i * pixelWidth, rez * pixelWidth, i * pixelWidth, p.height - rez * pixelWidth);
        }
        for (let j = rez; j + rez < structureRows * rez + 1; j += 1) {
            p.line(rez * pixelWidth, j * pixelWidth, p.width - rez * pixelWidth, j * pixelWidth);
        }

        p.strokeWeight(4);
        p.stroke(0);
        for (let i = 1; i < structureCols; i += 1) {  
            p.line(i * rez *pixelWidth, rez * pixelWidth, i * rez * pixelWidth, p.height - rez * pixelWidth);
        }

        for (let j = 1; j < structureRows; j += 1) {
            p.line(rez * pixelWidth, j * rez * pixelWidth, p.width - rez * pixelWidth, j * rez * pixelWidth);
        }
    }

    function drawVectors() {
        // Draw random vectors
        if (displayVectors) {
            p.strokeWeight(5);
            p.stroke(255, 0, 0, 50);
            for (let i = 0; i < cols + 1; i += 1) {
                for (let j = 0; j < rows + 1; j += 1) {
                    drawVector((i + 1) * rez * pixelWidth, 
                    (j + 1) * rez * pixelWidth, 
                    ((i + 1) + grid[i][j][0]) * rez * pixelWidth, 
                    ((j + 1) + grid[i][j][1]) * rez * pixelWidth);
                }
            }
        }
    }

    function drawCalculations(row, col, i, j) {
        if (displayInterp) {
            p.noFill();
            p.strokeWeight(5);
            p.stroke(255, 165, 0);
            p.rect((col + 1) * rez * pixelWidth, rez / 4 * pixelWidth , rez * pixelWidth, pixelWidth * rez / 2);

            p.rect((col + 1) * rez * pixelWidth, p.height - 3 * rez / 4 * pixelWidth , rez * pixelWidth, pixelWidth * rez / 2);

            p.rect(p.width - 3 / 4 * rez * pixelWidth, (row + 1) * rez * pixelWidth, rez * pixelWidth / 2, pixelWidth * rez);
        }
    }

    function hilightCell(row, col, i, j) {
        if (displayVectors) {
            // Draw green box around cell
            p.noFill();
            p.strokeWeight(3);
            p.stroke(0,255,0);
            p.rect(((col + 1) * rez + i) * pixelWidth, ((row + 1) * rez + j) * pixelWidth, pixelWidth, pixelWidth);

            // Draw vectors from corners to cell center
            let x0 = (col + 1) * rez * pixelWidth + (i + 0.5) * pixelWidth;
            let y0 = (row + 1) * rez * pixelWidth + (j + 0.5) * pixelWidth;

            p.strokeWeight(5);
            p.stroke(0,0,255, 50);
            drawVector((col + 1) * rez * pixelWidth, (row + 1) * rez * pixelWidth, x0, y0);
            drawVector((col + 1) * rez * pixelWidth, (row + 2) * rez * pixelWidth, x0, y0);
            drawVector((col + 2) * rez * pixelWidth, (row + 1) * rez * pixelWidth, x0, y0);
            drawVector((col + 2) * rez * pixelWidth, (row + 2) * rez * pixelWidth, x0, y0);
            
            p.noStroke();
            p.fill(0);
            p.circle(x0, y0, pixelWidth / 3);
        }
    }

    function check_step_input() {
        let step_selected = document.querySelector('input[name="perlinCalcs_step_input"]:checked').id;
        
        let t1 = document.getElementById("step1_text");
        let t2 = document.getElementById("step2_text");
        let t3 = document.getElementById("step3_text");

        t1.style.display = "none";
        t2.style.display = "none";
        t3.style.display = "none";
        
        switch(step_selected) {
            case "perlinCalcs_step_1":
                t1.style.display = "block";
                displayVectors = true;
                displayInterp = false;
                displayCells = false;
                show_grid = true;
                break;
            case "perlinCalcs_step_2":
                t2.style.display = "block";
                displayVectors = true;
                displayInterp = true;
                displayCells = false;
                show_grid = true;
                break;
            case "perlinCalcs_step_3":
                t3.style.display = "block";
                displayVectors = false;
                displayInterp = false;
                displayCells = true;
                checkInputs();
                break;
        }
        p.redraw();
    }
    
    p.draw = function() {
        p.background(255);
        
        drawCells();
        if (show_grid) {
            drawGrid();
        }

        hilightCell(hRow, hCol, hI, hJ);
        drawCalculations(hRow, hCol, hI, hJ);
        drawVectors();

        
        if (!resizing){
            hI += 1;
            if (hI > rez - 1) {
                hI = 0;
                hJ += 1;
                if (hJ > rez - 1) {
                    hJ = 0;
                    hCol += 1
                    if (hCol > cols - 1) {
                        hCol = 0;
                        hRow += 1;
                        if (hRow > rows - 1) {
                            hRow = 0;
                        }
                    }
                }
            }

        } else {
            resizing = false;
        }
    };
}
    
  // notes: weighting for components, using fade or not
  
  // big idea see how other programs run using that 'custom perlin noise' v v interesting 
  
  // add animation for panning through 3d box version next to 2d version
