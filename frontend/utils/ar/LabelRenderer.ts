import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export interface LandformLabel {
  id: string | number;
  name: string;
  position: THREE.Vector3;
}

export function createLabelRenderer(): CSS2DRenderer {
  const renderer = new CSS2DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.pointerEvents = 'none';
  return renderer;
}

export function createLabel(label: LandformLabel, onClick?: () => void): CSS2DObject {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.gap = '2px';

  const dot = document.createElement('div');
  dot.style.width = '16px';
  dot.style.height = '16px';
  dot.style.borderRadius = '50%';
  dot.style.backgroundColor = '#3b82f6';
  dot.style.boxShadow = '0 0 6px rgba(59, 130, 246, 0.6)';

  const textDiv = document.createElement('div');
  textDiv.textContent = label.name;
  textDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
  textDiv.style.color = '#ffffff';
  textDiv.style.borderRadius = '6px';
  textDiv.style.padding = '4px 8px';
  textDiv.style.fontSize = '12px';
  textDiv.style.fontFamily = 'sans-serif';
  textDiv.style.backdropFilter = 'blur(4px)';
  textDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
  textDiv.style.whiteSpace = 'nowrap';

  container.appendChild(dot);
  container.appendChild(textDiv);

  const object = new CSS2DObject(container);
  object.position.copy(label.position);

  if (onClick) {
    container.style.pointerEvents = 'auto';
    container.style.cursor = 'pointer';
    container.addEventListener('click', onClick);
  }

  return object;
}

export function updateLabelPosition(label: CSS2DObject, position: THREE.Vector3): void {
  label.position.copy(position);
}
