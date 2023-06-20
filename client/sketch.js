const MAP_WIDTH = 800;
const MAP_HEIGHT = 800;

const PLAYER_SIZE = 16;
const PLAYER_COLOR = "#757575";

const NOMINAL_SPEED = 1;

let world, player;

function setup() {
  createCanvas(MAP_WIDTH, MAP_HEIGHT);
  pixelDensity(1);

  world = new Map(0, 0, MAP_WIDTH, MAP_HEIGHT, 0.00125, 4, 0.5, 2);
  world.init();
  world.createTexture();

  player = new Player(
    createVector(MAP_WIDTH / 2, MAP_HEIGHT / 2),
    PLAYER_SIZE,
    PLAYER_COLOR
  );
}

function draw() {
  update();
  render();
}

function update() {
  player.update();
}

function render() {
  image(world.texture, world.x, world.y);
  player.display();
}

class Player {
  constructor(pos, size, color = "red") {
    this.pos = pos;
    this.size = size;
    this.color = color;
    this.vel = createVector(0, 0);
  }

  display() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }

  handleInput() {
    const dir = getKeyPressDir();
    if (dir == undefined) {
      this.vel.set(0, 0);
      return;
    }

    this.vel.set(p5.Vector.mult(dir, NOMINAL_SPEED));
  }

  physicsUpdate() {
    this.pos.add(this.vel);
  }

  constrainWithinBounds() {
    this.pos.x = constrain(this.pos.x, 0, MAP_WIDTH);
    this.pos.y = constrain(this.pos.y, 0, MAP_HEIGHT);
  }

  update() {
    this.handleInput();
    this.physicsUpdate();
    this.constrainWithinBounds();
  }
}

function getKeyPressDir() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    return createVector(-1, 0);
  } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    return createVector(1, 0);
  } else if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    return createVector(0, -1);
  } else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    return createVector(0, 1);
  }
  return undefined;
}
