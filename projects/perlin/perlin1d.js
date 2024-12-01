function perlin1d(p, sketchManager) {
  p.sketchManager = sketchManager;

  let time, start;
  let resizing = false;

  //// at the top of every sketch
  p.setup = function() {
    sizes = getWidthAndHeight();
    let canvas = p.createCanvas(sizes[0], sizes[1]);
    let container = document.getElementById("perlin1d");
    canvas.parent(container);
    canvas.mousePressed(function() {
      if (p.sketchManager) {
        p.sketchManager.toggleLoop(p);
      }
    });
    
    resetSketch();

    document.getElementById("perlin1d_reset").onclick = function() {resetSketch()};
  };

  function getWidthAndHeight() {
    let container = document.getElementById("perlin1d");
    let style = getComputedStyle(container);
    let contentWidth = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    let contentHeight = contentWidth/3;
    return [contentWidth, contentHeight];
  }

  p.windowResized = function() {
    sizes = getWidthAndHeight();
    p.resizeCanvas(sizes[0], sizes[1]);
    resizing = true;
  } 

  function resetSketch() {
    /// Unique to this sketch
    start = p.random(0, 500);
    time = 0;
    p.loop();
    ///
    p.noLoop();
  }
  ////

  p.draw = function() {
    p.background(0); 
    let off = 0;
    for (let x = 0; x < p.width*0.9; x++) {
      let y = p.map(p.noise(start + off + time), 0, 1, 0, p.height);
      p.noStroke();
      p.ellipse(x, y, 10);
      off += 0.01;
    }
    if (!resizing){
    time += 0.01;} else {
      resizing = false;
    }
  };  
}
