import * as THREE from 'three';

const SEGMENTS = 64;

export interface WaterConfig {
  width: number;
  depth: number;
  color: string;
  opacity: number;
  heightOffset: number;
}

export const DEFAULT_WATER_CONFIG: WaterConfig = {
  width: 100,
  depth: 100,
  color: '#0077be',
  opacity: 0.6,
  heightOffset: -0.5,
};

export function createWater(config: WaterConfig): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(config.width, config.depth, SEGMENTS, SEGMENTS);
  const material = new THREE.MeshPhysicalMaterial({
    color: config.color,
    transparent: true,
    opacity: config.opacity,
    side: THREE.DoubleSide,
    envMapIntensity: 0.4,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = config.heightOffset;

  return mesh;
}

export function animateWater(mesh: THREE.Mesh, time: number): void {
  const geometry = mesh.geometry;
  const positions = geometry.attributes.position;

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);

    const wave = Math.sin(x * 2 + time) * 0.05 + Math.cos(y * 3 + time * 0.8) * 0.03;
    positions.setZ(i, wave);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
}
