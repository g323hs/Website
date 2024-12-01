function name(p, sketchManager) {
    p.sketchManager = sketchManager;

    resetInputs(true);
    let value = parseInt(document.getElementById("html_id_var").value);
    let radio = document.getElementById("html_id_radio").checked;
  
    //// at the top of every sketch
    p.setup = function() {
      let sizes = getWidthAndHeight();
      let canvas = p.createCanvas(sizes[0], sizes[1]);
      let container = document.getElementById("name");
      canvas.parent(container);
      canvas.mousePressed(function() {
        if (p.sketchManager) {
          p.sketchManager.toggleLoop(p);
        }
      });
      check_step_input();
      resetSketch();
  
      document.getElementById("reset_sketch").onclick = function() {resetSketch();};
      document.getElementById("reset_inputs").onclick = function() {resetInputs(false);};

      // for each value input 
      document.getElementById("html_id_val").addEventListener("change", function() {checkInputs();});
      // for each radio option
      document.getElementById("html_id_var_option1").addEventListener("change", function() {check_radio_input();});
    };
  
    function getWidthAndHeight() {
      let container = document.getElementById("name");
      let style = getComputedStyle(container);
      let contentWidth = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      
      let pixelWidth = contentWidth / (structureCols * rez);
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

    function resetInputs(first) {
        let initial_val = 1;
        
        document.getElementById("html_id_val").value = initial_val;
        
        if (!first) {
            checkInputs();
        }   
    }

    function resetSketch() {
        /// Unique to this sketch 
        value = validInput("html_id_val");

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
        if (value != parseInt(document.getElementById("html_id_val").value)) {
            resetSketch();
            p.windowResized();
        }

        // don't need to redraw sketch
        if (value != document.getElementById("html_id_val").checked) {
            value = document.getElementById("html_id_val").checked;
            p.redraw();
        }
    }
  
    function check_step_input() {
        let step_selected = document.querySelector('input[name="html_id_radio"]:checked').id;
        
        let t1 = document.getElementById("step1_text");
    
        t1.style.display = "none";
        
        switch(step_selected) {
            case "step1":
                t1.style.display = "block";

                break;
            case "perlinCalcs_step_2":
                t2.style.display = "block";
                break;
            case "perlinCalcs_step_3":
                t3.style.display = "block";
                break;
        }
        p.redraw();
    }
    
    p.draw = function() {
        p.background(255);
    };
}

