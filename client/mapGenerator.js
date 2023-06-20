/**
 * Taken from https://editor.p5js.org/Kubi/sketches/CHPTDZOu2
 */

class MapGenerator {
  static generateMap(
    width,
    height,
    noiseScale,
    octaves,
    octaveOffsets,
    persistance,
    lacunarity,
    regions
  ) {
    const noiseMap = Noise.generateNoiseMap(
      width,
      height,
      noiseScale,
      octaves,
      octaveOffsets,
      persistance,
      lacunarity,
    );

    return MapGenerator.convertNoiseToTerrainMap(noiseMap, regions);
  }

  static convertNoiseToTerrainMap(noiseMap, regions) {
    let terrainMap = [];

    let height = noiseMap.length;
    let width = noiseMap[0].length;

    let currentHeight;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        currentHeight = noiseMap[y][x];

        for (let i = 0; i < regions.length; i++) {
          if (currentHeight <= regions[i].maxHeight) {
            terrainMap.push(new TerrainTile(regions[i], currentHeight));
            break;
          }
        }
      }
    }
    return terrainMap;
  }
}

class TerrainType {
  constructor(name, minHeight, maxHeight, color) {
    this.name = name;
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
    this.clr = color;
  }
}

class TerrainTile {
  constructor(terrainType, height) {
    this.terrainType = terrainType;
    this.height = height;
  }
}
