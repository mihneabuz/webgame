const MAP_WIDTH = 800;
const MAP_HEIGHT = 800;
const MAP_SCALE = 0.00125;

const PLAYER_SIZE = 16;
const PLAYER_COLOR = "#757575";
const NOMINAL_SPEED = 1;
const WATER_DRAG = 0.4;
const SKIN_SLOPE = Math.sqrt(3);

const BULLET_SIZE = 8;
const BULLET_COLOR = "#FF0000";
const BULLET_SPEED = 2;

let world, player;

function setup() {
  createCanvas(MAP_WIDTH, MAP_HEIGHT);
  pixelDensity(1);

  world = new Map(0, 0, MAP_WIDTH, MAP_HEIGHT, MAP_SCALE, 4, 0.5, 2);
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
  background(0);
  image(world.texture, world.x, world.y);
  player.display();
}

class Player {
  constructor(pos, size, color = "gray") {
    this.pos = pos;
    this.size = size;
    this.color = color;
    this.vel = createVector(0, 0);
    this.activeBullets = []
    this.bulletsToSpawn = [];
  }

  display() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }

  shoot() {
    this.bulletsToSpawn.push(new Bullet(this.pos, createVector(mouseX, mouseY), BULLET_SIZE, BULLET_COLOR));
  }

  handleInput() {
    const dir = getKeyPressDir();
    if (dir == undefined) {
      this.vel.set(0, 0);
      return;
    }

    const px = Math.floor(this.pos.x),
      py = Math.floor(this.pos.y);
    const npx = constrain(px + dir.x, 0, MAP_WIDTH - 1),
      npy = constrain(py + dir.y, 0, MAP_HEIGHT - 1);

    const tile = world.data[py * MAP_WIDTH + px];
    let speed = NOMINAL_SPEED;
    switch (tile.terrainType.name) {
      case "deep water":
      case "medium water":
      case "shallow water": {
        speed *= WATER_DRAG;
        break;
      }
      default: {
        const nextTile = world.data[npy * MAP_WIDTH + npx];
        const slope = (nextTile.height - tile.height) / MAP_SCALE;
        speed *= Math.exp(-slope / SKIN_SLOPE);
        break;
      }
    }

    this.vel.set(p5.Vector.mult(dir, speed));
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

class Bullet {
  constructor(posFrom, posTo, size, color = "red") {
    this.pos3d = posFrom;

    this.vel3d = p5.Vector.sub(posTo, posFrom).normalize();
    vel3d.setMag(BULLET_SPEED);

    this.size = size;
    this.color = color;

    this.active = true;
  }

  display() {
    fill(this.color);
    ellipse(this.pos3d.x, this.pos3d.y, this.size, this.size);
  }

  physicsUpdate() {
    this.pos3d.add(this.vel3d);
  }

  collideWithTerrain() {
    const px = Math.floor(this.pos3d.x),
      py = Math.floor(this.pos3d.y);
    const tile = world.data[py * MAP_WIDTH + px];

    if (tile.terrainType.name.contains("water")) {
      this.active = false;
      return;
    }

    if (tile.height > this.pos3d.z) {
      this.active = false;
      return;
    }
  }

  update() {
    this.physicsUpdate();
    this.collideWithTerrain();
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

function mousePressed() {
  if (mouseButton == LEFT) {
    player.shoot();
  }
}
