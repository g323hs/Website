function randomNoise(p, sketchManager) {
    p.sketchManager = sketchManager;
    
    let inpCols = 1;
    let inpRows = 1;
    let cols = inpCols + 2;
    let rows = inpRows + 2;
    let rez = 5;

    let pixelWidth;
    let resizing = false;
  
    //// at the top of every sketch
    p.setup = function() {
      let sizes = getWidthAndHeight();
      let canvas = p.createCanvas(sizes[0], sizes[1]);
      let container = document.getElementById("randomNoise");
      canvas.parent(container);
      canvas.mousePressed(function() {
        if (p.sketchManager) {
          p.sketchManager.toggleLoop(p);
        }
      });
      
      resetSketch();
    };
  
    // Draw pixels
    function getWidthAndHeight() {
      let container = document.getElementById("randomNoise");
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

    function resetSketch() {
      /// Unique to this sketch
      resizing = false;
      p.noLoop();
    }
    ////
  
    p.draw = function() {
        p.background(255);

        // Draw random cells
        p.noStroke();
        for (let i = rez; i + rez < cols * rez; i += 1) {
            for (let j = rez; j + rez < rows * rez; j += 1) {
                p.fill(p.random(0,255));
                p.rect(i * pixelWidth, j * pixelWidth, pixelWidth, pixelWidth);
            }
        }
  
        // Draw grid lines
        p.strokeWeight(3);
        p.stroke(200);
        for (let i = rez; i + rez < cols * rez + 1; i += 1) {
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