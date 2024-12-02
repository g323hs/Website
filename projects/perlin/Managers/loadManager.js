const sketchManager = new SketchManager();

const gridDefineInstance = new p5((p) => gridDefine(p, sketchManager), 'gridDefine');
const randomNoiseInstance = new p5((p) => randomNoise(p, sketchManager), 'randomNoise');
const perlinCalcsInstance = new p5((p) => perlinCalcs(p, sketchManager), 'perlinCalcs');
const perlin2dInstance = new p5((p) => perlin2d(p, sketchManager), 'perlin2d');
const perlin1dInstance = new p5((p) => perlin1d(p, sketchManager), 'perlin1d');
const perlin3d_2dInstance = new p5((p) => perlin3d_2d(p, sketchManager), 'perlin3d_2d');
const perlin3d_3dInstance = new p5((p) => perlin3d_3d(p, sketchManager), 'perlin3d_3d');
const graphFadeInstance = new p5((p) => graphFade(p, sketchManager), 'graphFade');
const perlinWorldInstance = new p5((p) => perlinWorld(p, sketchManager), 'perlinWorld');
const recursiveTreeInstance = new p5((p) => recursiveTree(p, sketchManager), 'recursiveTree');
const recursiveTreeGrowInstance = new p5((p) => recursiveTreeGrow(p, sketchManager), 'recursiveTreeGrow');
// const marchingSquaresInstance = new p5((p) => marchingSquares(p, sketchManager), 'marchingSquares');