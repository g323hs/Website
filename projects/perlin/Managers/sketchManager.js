class SketchManager {
  constructor() {
    this.activeSketch = null;
    this.loopSketches = ["perlinCalcs","randomNoise","perlin1d","perlin3d_2d","perlinWorld","recursiveTree","recursiveTreeGrow","marchingSquares"];
  }

  setActiveSketch(sketchInstance) {
    if (sketchInstance != null){
      if (this.loopSketches.includes(sketchInstance._userNode.id)){
        if (this.activeSketch && this.activeSketch !== sketchInstance) {
          this.activeSketch.noLoop();
        }
        this.activeSketch = sketchInstance;
      }
    }
  }

  toggleLoop(sketchInstance) {
    if (sketchInstance != null){
      if (this.loopSketches.includes(sketchInstance._userNode.id)){
        if (sketchInstance.isLooping()) {
          sketchInstance.noLoop();
          this.setActiveSketch(null);
        } else {
          this.setActiveSketch(sketchInstance);
          sketchInstance.loop();
        }
      }
    }
  }
}
