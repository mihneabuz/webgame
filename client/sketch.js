const MAP_WIDTH = 900;
const MAP_HEIGHT = 900;
const MAP_SCALE = 0.00125;

const PLAYER_SIZE = 16;
const PLAYER_COLOR = "#757575";

const OTHER_SIZE = 20;
const OTHER_COLOR = "#b86464"

const NOMINAL_SPEED = 1;
const WATER_DRAG = 0.4;
const SKIN_SLOPE = Math.sqrt(3);

let world, player, others, socket;

function setup() {
  createCanvas(MAP_WIDTH, MAP_HEIGHT);
  pixelDensity(1);

  player = new Player(
    createVector(MAP_WIDTH / 2, MAP_HEIGHT / 2),
    PLAYER_SIZE,
    PLAYER_COLOR
  );

  others = [];

  let name = '' + Math.floor(Math.random() * 10000);

  socket = new WebSocket(`wss://${location.host}?name=${name}`);
  socket.addEventListener('message', (event) => {
    const msg = event.data.split(" ");

    if (msg[0].startsWith('seed')) {
      let seed = parseInt(msg[1]);

      world = new Map(0, 0, MAP_WIDTH, MAP_HEIGHT, MAP_SCALE, 4, 0.5, 2, seed);
      world.init();
      world.createTexture();
    }

    if (msg[0].startsWith('players')) {
      const players = JSON.parse(msg[1]);

      while (players.length - 1 > others.length) {
        others.push(new Player(createVector(0, 0), OTHER_SIZE, OTHER_COLOR));
      }

      while (players.length - 1 < others.length) {
        others.pop();
      }

      players.filter(p => p[0] !== name).forEach((player, i) => {
        const pos = player[2];
        others[i].pos = createVector(pos[0], pos[1]);
      });
    }
  });

  setInterval(() => {
    let pos = [player.pos.x, player.pos.y];
    socket.send('move ' + JSON.stringify(pos));
  }, 10);
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
  if (world) {
    image(world.texture, world.x, world.y);
  }
  player.display();
  for (const other of others) {
    other.display();
  }
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
