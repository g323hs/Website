function perlin2d(p, sketchManager) {
  p.sketchManager = sketchManager;

  const xPixels = 20;
  const yPixels = 20;

  let pixelWidth;
  let a;
  let resizing = false;

  //// at the top of every sketch
  p.setup = function() {
    sizes = getWidthAndHeight();
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

  function getWidthAndHeight() {
    let container = document.getElementById("perlin2d");
    let style = getComputedStyle(container);
    let contentWidth = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    pixelWidth = contentWidth / xPixels;
    let contentHeight = yPixels * pixelWidth;
    return [contentWidth, contentHeight];
  }

  p.windowResized = function() {
    sizes = getWidthAndHeight();
    p.resizeCanvas(sizes[0], sizes[1]);
    resizing = true;
  } 

  function resetSketch() {
    /// Unique to this sketch
    p.pixelDensity(1);
    p.frameRate(10);
    a = p.random()*100;
    p.loop();
    ///
    p.noLoop();
  }
  ////

  p.draw = function() {
    p.background(0);
    let xoff = 0;
    for (let x = 0; x < p.width; x += pixelWidth) {
      let yoff = 0;
      for (let y = 0; y < p.height; y += pixelWidth) {
        let num = p.map(p.noise(xoff, yoff, a), 0, 1, 0, 255);
        p.fill(num); // Set fill color based on Perlin noise value
        p.noStroke(); // No outline for the rectangle
        p.rect(x, y, pixelWidth, pixelWidth); // Draw a rectangle representing the pixel block
        yoff += 0.01 * pixelWidth;
      }
      xoff += 0.01 * pixelWidth;
    }
    if (!resizing){
      a += 0.1;} else {
        resizing = false;
      }
  };
}
