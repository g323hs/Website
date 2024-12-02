function perlin3d_2d(p, sketchManager) {
    p.sketchManager = sketchManager;
    p.seed = p.random(100);
    p.noiseSeed(p.seed);
    const nPixels = 20;
    p.a_2d = 0;

    let resizing = false;

    //// at the top of every sketch
    p.setup = function() {
      let sizes = getWidthAndHeight();
      let canvas = p.createCanvas(sizes[0], sizes[1]);
      let container = document.getElementById("perlin3d_2d");
      canvas.parent(container);
      canvas.mousePressed(function() {
        p.sketchManager.toggleLoop(p);
      });
      resetSketch();
    };
  
    function getWidthAndHeight() {
        let container = document.getElementById("perlin3d_2d");
        let style = getComputedStyle(container);
        let contentWidth = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        pixelWidth = contentWidth / nPixels;
        let contentHeight = nPixels * pixelWidth;
        return [contentWidth, contentHeight];
    }
  
    p.windowResized = function() {
      let sizes = getWidthAndHeight();
      p.resizeCanvas(sizes[0], sizes[1]);
      resizing = true;
    }

    function resetSketch() {
        /// Unique to this sketch 
        p.pixelDensity(1);
        p.frameRate(10);
        p.a_2d = 0;
        resizing = false;
        p.loop();
        p.noLoop();
    }
    ////
    
    p.draw = function() {
        p.background(0);
        let xoff = 0;
        for (let x = 0; x < p.width; x += pixelWidth) {
          let yoff = 0;
          for (let y = 0; y < p.height; y += pixelWidth) {
            let scale = 0.01;
            let num = p.map(p.noise(x * scale, y * scale, p.a_2d * scale), 0, 1, 0, 255);
            p.fill(num); // Set fill color based on Perlin noise value
            p.stroke(num); // No outline for the rectangle
            p.rect(x, y, pixelWidth, pixelWidth); // Draw a rectangle representing the pixel block
            yoff += 0.01 * pixelWidth;
          }
          xoff += 0.01 * pixelWidth;
        }

        if (!resizing){
        //update anything each draw loop for the program.
        p.a_2d += pixelWidth;
        if (p.a_2d >= pixelWidth * nPixels) {
          p.a_2d = 0;
        }
        perlin3d_3dInstance.redraw();
        } else {
        resizing = false;
        }
    };
}