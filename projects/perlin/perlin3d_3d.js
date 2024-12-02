function perlin3d_3d(p, sketchManager) {
    p.sketchManager = sketchManager;
    p.seed = perlin3d_2dInstance.seed;
    p.noiseSeed(p.seed);
    const nPixels = 20;
    let a = 0;
    let angle = p.PI / 4;

    let resizing = false;

    //// at the top of every sketch
    p.setup = function() {
      let sizes = getWidthAndHeight();
      let canvas = p.createCanvas(sizes[0], sizes[1], p.WEBGL);
      let container = document.getElementById("perlin3d_3d");
      canvas.parent(container);
      canvas.mousePressed(function() {p.sketchManager.toggleLoop(perlin3d_2dInstance);});
      resetSketch();
    };
  
    function getWidthAndHeight() {
        let container = document.getElementById("perlin3d_3d");
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
        a = 0;
        resizing = false;
        p.loop();
        p.noLoop();
    }
    ////
    
    p.draw = function() {
        p.background(0);

        // Move the camera back along the z-axis
        let camX = 0; // Camera position on x-axis
        let camY = 0; // Camera position on y-axis
        let camZ = 2000; // Camera position on z-axis (increase to move further back)
        let centerX = 0; // Point camera looks at (x-axis)
        let centerY = 0; // Point camera looks at (y-axis)
        let centerZ = 0; // Point camera looks at (z-axis)
        let upX = 0; // Camera up direction (x-axis)
        let upY = 1; // Camera up direction (y-axis)
        let upZ = 0; // Camera up direction (z-axis)

        p.camera(camX, camY, camZ, centerX, centerY, centerZ, upX, upY, upZ);


        p.rotateX(-p.PI / 6); // Rotate the view
        p.rotateY(angle + p.PI);

        let step = pixelWidth * nPixels / 2;
        p.translate(-step, -step, -step); 

        let xoff = 0;
        a = pixelWidth;
        for(let n = 0; n < nPixels; n+= 1) {
            for (let x = 0; x < p.width; x += pixelWidth) {
                let yoff = 0;
                for (let y = 0; y < p.height; y += pixelWidth) {
                    let scale = 0.01;
                    let num = p.map(p.noise((p.width - x) * scale, y * scale, a * scale), 0, 1, 0, 255);

                    // Set fill and draw the cube
                    p.push();
                    let z = p.map(n, 0, nPixels, 0, p.width);
                    p.translate(x, y, z); // Position the cube in 3D space
                    p.fill(num); // Set fill colour based on Perlin noise value
                    if (a == perlin3d_2dInstance.a_2d) {
                        p.fill(num, num * 1.5, num);
                    }
                    p.noStroke();
                    p.box(pixelWidth); // Create a cube
                    p.pop();

                    yoff += 0.01 * pixelWidth;
                }
                xoff += 0.01 * pixelWidth;
            }
            a += pixelWidth;
        }

        if (!resizing){
        //update anything each draw loop for the program.
        //angle += 0.1;
        angle = angle % p.TWO_PI;
        } else {
        resizing = false;
        }
    };
}