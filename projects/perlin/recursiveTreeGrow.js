function recursiveTreeGrow(p, sketchManager) {
    p.sketchManager = sketchManager;
  
    let theta;
    let x_centre;
    let y_centre;
    let angleSlider;
    let a;
  
    //// at the top of every sketch
    p.setup = function() {
      let container = document.getElementById("recursiveTreeGrow");
      let style = getComputedStyle(container);
      let contentWidth = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      let contentHeight = p.min(contentWidth, 600);
      let canvas = p.createCanvas(contentWidth, contentHeight);
      canvas.parent(container);
      

  
      const resetButton = p.createButton("Reset");
      resetButton.class("fit");
      resetButton.parent(container);
      resetButton.mousePressed(resetSketch);
      
      canvas.mousePressed(function() {
        if (p.sketchManager) {
          p.sketchManager.toggleLoop(p);
        }
      });

      resetSketch();
    };
  
    function resetSketch() {
      /// Unique to this sketch
      max = 5;
      p.frameRate(5);
      x_centre = p.width;
      y_centre = p.height;
      a = 25;//angleSlider.value();
      p.loop();
      ///
      p.noLoop();
      p.background(255);
    }
    ////
  
    p.draw = function() {
      
      p.background(255);
      p.stroke(0);
      
      theta = p.radians(a);
      p.translate(x_centre/2,y_centre/1.1);
      p.line(0,0,0,-(y_centre/4));
      p.translate(0,-(y_centre/4));
      branch(y_centre/10, 1, max);
      max += 1;
      max %= 15;
    }
    
    function branch(h, count, max) {
      h *= 0.75;
    
      if (count < max) {
        p.push();    
        p.rotate(theta);
        p.line(0, 0, 0, -h);
        p.translate(0, -h);
        branch(h, count+1, max);      
        p.pop();     
    
        p.push();
        p.rotate(-theta);
        p.line(0, 0, 0, -h);
        p.translate(0, -h);
        branch(h, count+1, max);
        p.pop();
      }
    }
  }