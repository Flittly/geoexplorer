import * as THREE from 'three';
import SimplexNoise from 'simplex-noise';

export interface TerrainConfig {
  seed: number;
  width: number;
  depth: number;
  segments: number;
  scale: number;
  amplitude: number;
  octaves: number;
  persistence: number;
}

export const DEFAULT_TERRAIN_CONFIG: TerrainConfig = {
  seed: 42,
  width: 20,
  depth: 20,
  segments: 64,
  scale: 3,
  amplitude: 2,
  octaves: 4,
  persistence: 0.5,
};

export function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fbm(noise: SimplexNoise, x: number, z: number, octaves: number, persistence: number): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise.noise2D(x * frequency, z * frequency);
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }
  return value / maxValue;
}

const _heightColor = new THREE.Color();

function heightToColor(t: number): THREE.Color {
  const lowColor = new THREE.Color(0.3, 0.5, 0.15);
  const midColor = new THREE.Color(0.55, 0.35, 0.15);
  const highColor = new THREE.Color(0.75, 0.75, 0.75);
  if (t < 0.5) {
    return _heightColor.lerpColors(lowColor, midColor, t * 2);
  }
  return _heightColor.lerpColors(midColor, highColor, (t - 0.5) * 2);
}

export function generateTerrain(config: TerrainConfig): THREE.Mesh {
  const { width, depth, segments, scale, amplitude, octaves, persistence } = config;

  const geometry = new THREE.PlaneGeometry(width, depth, segments, segments);
  const pos = geometry.attributes.position;
  const vertexCount = pos.count;

  const noise = new SimplexNoise(mulberry32(config.seed));

  const heights = new Float32Array(vertexCount);
  let minHeight = Infinity;
  let maxHeight = -Infinity;

  for (let i = 0; i < vertexCount; i++) {
    const x = pos.getX(i);
    const z = pos.getY(i);
    const h = fbm(noise, x / width * scale, z / depth * scale, octaves, persistence) * amplitude;
    heights[i] = h;
    if (h < minHeight) minHeight = h;
    if (h > maxHeight) maxHeight = h;
  }

  const range = maxHeight - minHeight || 1;
  const colors = new Float32Array(vertexCount * 3);

  for (let i = 0; i < vertexCount; i++) {
    pos.setZ(i, heights[i]);
    const t = (heights[i] - minHeight) / range;
    const color = heightToColor(t);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.rotateX(-Math.PI / 2);
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    flatShading: false,
    roughness: 0.8,
    metalness: 0.1,
  });

  return new THREE.Mesh(geometry, material);
}

export function getHeightAt(config: TerrainConfig, x: number, z: number): number {
  const noise = new SimplexNoise(mulberry32(config.seed));
  const { width, depth, scale, amplitude, octaves, persistence } = config;
  return fbm(noise, x / width * scale, z / depth * scale, octaves, persistence) * amplitude;
}
