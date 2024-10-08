const sketchManager = new SketchManager();

const gridDefineInstance = new p5((p) => gridDefine(p, sketchManager), 'gridDefine');
const perlinCalcsInstance = new p5((p) => perlinCalcs(p, sketchManager), 'perlinCalcs');
const perlin1dInstance = new p5((p) => perlin1d(p, sketchManager), 'perlin1d');
const perlin2dInstance = new p5((p) => perlin2d(p, sketchManager), 'perlin2d');
const perlinWorldInstance = new p5((p) => perlinWorld(p, sketchManager), 'perlinWorld');
const recursiveTreeInstance = new p5((p) => recursiveTree(p, sketchManager), 'recursiveTree');
const recursiveTreeGrowInstance = new p5((p) => recursiveTreeGrow(p, sketchManager), 'recursiveTreeGrow');
// const marchingSquaresInstance = new p5((p) => marchingSquares(p, sketchManager), 'marchingSquares');