/**
 * Taken from https://editor.p5js.org/Kubi/sketches/CHPTDZOu2
 */

class Noise {
  static generateNoiseMap(
    mapWidth,
    mapHeight,
    scale,
    octaves,
    octaveOffsets,
    persistance,
    lacunarity
  ) {
    let noiseMap = [];

    if (scale <= 0) scale = 0.0001;

    let amplitude, frequency, noiseHeight, sampleX, sampleY, perlinValue;

    let maxNoiseHeight = -Infinity;
    let minNoiseHeight = Infinity;

    let halfWidth = mapWidth / 2;
    let halfHeight = mapHeight / 2;

    for (let y = 0; y < mapHeight; y++) {
      noiseMap[y] = [];

      for (let x = 0; x < mapWidth; x++) {
        amplitude = 1;
        frequency = 1;
        noiseHeight = 0;

        for (let i = 0; i < octaves; i++) {
          sampleX = (x - halfWidth) * scale * frequency + octaveOffsets[i].x;
          sampleY = (y - halfHeight) * scale * frequency + octaveOffsets[i].y;

          perlinValue = noise(sampleX, sampleY) * 2 - 1;

          noiseHeight += perlinValue * amplitude;

          amplitude *= persistance;
          frequency *= lacunarity;
        }

        if (noiseHeight < minNoiseHeight) minNoiseHeight = noiseHeight;
        if (noiseHeight > maxNoiseHeight) maxNoiseHeight = noiseHeight;

        noiseMap[y].push(noiseHeight);
      }
    }

    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        noiseMap[y][x] = map(
          noiseMap[y][x],
          minNoiseHeight,
          maxNoiseHeight,
          0,
          1
        );
      }
    }
    return noiseMap;
  }
}
