const MAP_WIDTH = 800;
const MAP_HEIGHT = 800;

let world;

function setup() {
  createCanvas(800, 800);
  pixelDensity(1);

  world = new Map(0, 0, MAP_WIDTH, MAP_HEIGHT, 0.01, 4, 0.5, 2);
  world.init();
  world.createTexture();
}

function draw() {
  background(205);
  image(world.texture, world.x, world.y);
}
