/**
 * Taken from https://editor.p5js.org/Kubi/sketches/CHPTDZOu2
 */

class Map {
  constructor(
    x,
    y,
    width,
    height,
    noiseScale,
    octaves,
    persistance,
    lacunarity,
    serverSeed
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.noiseScale = noiseScale;
    this.octaves = octaves;
    this.persistance = persistance;
    this.lacunarity = lacunarity;
    this.serverSeed = serverSeed;

    this.texture = createImage(this.width, this.height);
  }

  init() {
    this.octaveOffsets = Map.generateOctaveOffsets(this.octaves, this.serverSeed);
    this.regions = Map.createRegions();

    this.data = MapGenerator.generateMap(
      this.width,
      this.height,
      this.noiseScale,
      this.octaves,
      this.octaveOffsets,
      this.persistance,
      this.lacunarity,
      this.regions
    );
  }

  createTexture() {
    this.texture.loadPixels();
    let indPixels;
    let indData = 0;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        indPixels = (y * this.width + x) * 4;
        const tile = this.data[indData];
        const {minHeight, maxHeight, clr} = tile.terrainType;
        this.texture.pixels[indPixels + 0] = red(clr);
        this.texture.pixels[indPixels + 1] = green(clr);
        this.texture.pixels[indPixels + 2] = blue(clr);
        this.texture.pixels[indPixels + 3] = map(tile.height, minHeight, maxHeight, 255, 0);
        indData++;
      }
    }
    this.texture.updatePixels();
  }

  static generateOctaveOffsets(octaves, serverSeed) {
    randomSeed(serverSeed);
    noiseSeed(serverSeed);

    let offsets = [];
    let offsetX, offsetY;
    for (let i = 0; i < octaves; i++) {
      offsetX = random(-100000, 100000);
      offsetY = random(-100000, 100000);
      offsets.push(createVector(offsetX, offsetY));
    }
    return offsets;
  }

  static createRegions() {
    let regions = [];

    const deepWater = new TerrainType(
      "deep water",
      0.0,
      0.1,
      color(50, 50, 150)
    );
    regions.push(deepWater);

    const mediumWater = new TerrainType(
      "medium water",
      0.1,
      0.3,
      color(62, 62, 194)
    );
    regions.push(mediumWater);

    const shallowWater = new TerrainType(
      "shallow water",
      0.3,
      0.5,
      color(71, 71, 255)
    );
    regions.push(shallowWater);

    const beach = new TerrainType("beach", 0.5, 0.55, color(217, 224, 139));
    regions.push(beach);

    const grass = new TerrainType("grass", 0.55, 0.67, color(67, 204, 67));
    regions.push(grass);

    const forest = new TerrainType("forest", 0.67, 0.75, color(17, 99, 33));
    regions.push(forest);

    const dirt = new TerrainType("dirt", 0.75, 0.82, color(50, 54, 45));
    regions.push(dirt);

    const rock = new TerrainType("rock", 0.82, 0.95, color(48, 41, 41));
    regions.push(rock);

    const snow = new TerrainType("snow", 0.95, 1, color(255));
    regions.push(snow);

    return regions;
  }
}
