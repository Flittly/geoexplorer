import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { generateTerrain, TerrainConfig } from '../utils/ar/TerrainGenerator';
import { createWater, animateWater, WaterConfig } from '../utils/ar/WaterSimulation';
import { createLabel, LandformLabel } from '../utils/ar/LabelRenderer';
import { ProfileView } from '../components/ProfileView';

interface LabelConfigItem {
  id: string;
  name: string;
  position: [number, number, number];
}

interface LandformConfigItem {
  id: string;
  name: string;
  description: string;
  seed: number;
  scale: number;
  amplitude: number;
  octaves: number;
  persistence: number;
  labels: LabelConfigItem[];
  landformInfo: {
    name: string;
    description: string;
    knowledgeContent: string;
    type: string;
    elevation: number | null;
    imageUrl: string | null;
  };
}

const LANDFORM_CONFIGS: LandformConfigItem[] = [
  { id: 'mountain', name: '山峰', description: '高海拔', seed: 42, scale: 3, amplitude: 2.5, octaves: 4, persistence: 0.5, labels: [{ id: 'peak', name: '峰顶', position: [0, 2.0, 0] }], landformInfo: { name: '山峰', description: '高海拔地形', knowledgeContent: '山峰是地球表面高出周围地区的隆起地形。世界最高峰是珠穆朗玛峰，海拔8848米。', type: 'MOUNTAIN', elevation: 8848, imageUrl: null } },
  { id: 'basin', name: '盆地', description: '洼地地形', seed: 123, scale: 3, amplitude: 1.5, octaves: 3, persistence: 0.4, labels: [{ id: 'bottom', name: '盆地底部', position: [0, -0.8, 0] }], landformInfo: { name: '盆地', description: '洼地地形', knowledgeContent: '盆地是四周高、中间低的地形，如四川盆地、塔里木盆地。', type: 'BASIN', elevation: 1240, imageUrl: null } },
  { id: 'valley', name: '山谷', description: '河流路径', seed: 456, scale: 3, amplitude: 1.2, octaves: 4, persistence: 0.5, labels: [{ id: 'floor', name: '谷底', position: [-3, -0.3, 0] }], landformInfo: { name: '山谷', description: '河流路径', knowledgeContent: '山谷是两山之间的低洼地带，常有河流经过。', type: 'VALLEY', elevation: 500, imageUrl: null } },
  { id: 'plateau', name: '高原', description: '平坦高地', seed: 789, scale: 4, amplitude: 1.0, octaves: 3, persistence: 0.3, labels: [{ id: 'surface', name: '高原面', position: [0, 0.5, 0] }], landformInfo: { name: '高原', description: '平坦高地', knowledgeContent: '高原是海拔较高、顶面平坦开阔的地形，如青藏高原。', type: 'PLATEAU', elevation: 3000, imageUrl: null } },
  { id: 'cliff', name: '悬崖', description: '垂直落差', seed: 101, scale: 3, amplitude: 2.0, octaves: 3, persistence: 0.4, labels: [{ id: 'wall', name: '崖壁', position: [0, 0.3, 0] }], landformInfo: { name: '悬崖', description: '垂直落差', knowledgeContent: '悬崖是坡度极陡的岩石地形，常见于海岸和山区。', type: 'CLIFF', elevation: 900, imageUrl: null } },
];

const ARView: React.FC = () => {
  const navigate = useNavigate();
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [waterLevel, setWaterLevel] = useState(45);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedLandformInfo, setSelectedLandformInfo] = useState<LandformConfigItem['landformInfo'] | null>(null);
  const [arMode, setArMode] = useState<'webxr' | 'camera' | 'pure3d'>('pure3d');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const labelRendererRef = useRef<CSS2DRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const terrainGroupRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const config = LANDFORM_CONFIGS[selectedIndex];

  useEffect(() => {
    let cancelled = false;
    async function detectAR() {
      if (navigator.xr) {
        try {
          if (await navigator.xr.isSessionSupported('immersive-ar')) {
            if (!cancelled) setArMode('webxr');
            return;
          }
        } catch {}
      }
      if (navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          if (!cancelled) {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            videoRef.current = video;
            setArMode('camera');
          } else {
            stream.getTracks().forEach(t => t.stop());
          }
          return;
        } catch {}
      }
      if (!cancelled) setArMode('pure3d');
    }
    detectAR();
    return () => {
      cancelled = true;
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
      videoRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const { seed, scale, amplitude, octaves, persistence, labels, landformInfo } = config;

    const scene = new THREE.Scene();
    if (videoRef.current) {
      scene.background = new THREE.VideoTexture(videoRef.current);
    } else {
      scene.background = new THREE.Color(0x1a1a2e);
    }
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(8, 6, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.left = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(labelRenderer.domElement);
    labelRendererRef.current = labelRenderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 3;
    controls.maxDistance = 25;
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.target.set(0, 0, 0);
    controls.update();
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x4444ff, 0.3);
    fillLight.position.set(-5, 0, 5);
    scene.add(fillLight);

    const grid = new THREE.GridHelper(30, 20, 0x444466, 0x333355);
    scene.add(grid);

    const group = new THREE.Group();
    scene.add(group);
    terrainGroupRef.current = group;

    const terrainConfig: TerrainConfig = {
      seed,
      width: 20,
      depth: 20,
      segments: 64,
      scale,
      amplitude,
      octaves,
      persistence,
    };
    const terrain = generateTerrain(terrainConfig);
    group.add(terrain);

    const waterConfig: WaterConfig = {
      width: 22,
      depth: 22,
      color: '#0077be',
      opacity: 0.6,
      heightOffset: -2.5 + (waterLevel / 100) * 5.5,
    };
    const water = createWater(waterConfig);
    group.add(water);
    waterMeshRef.current = water;

    labels.forEach((labelConfig) => {
      const label = createLabel(
        { id: labelConfig.id, name: labelConfig.name, position: new THREE.Vector3(...labelConfig.position) },
        () => {
          window.dispatchEvent(new CustomEvent('ar-label-click', { detail: { ...landformInfo } }));
        }
      );
      group.add(label);
    });

    const clock = new THREE.Clock();
    let running = true;

    function animate() {
      if (!running) return;
      animFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      group.rotation.y += 0.002;
      if (waterMeshRef.current) {
        animateWater(waterMeshRef.current, clock.getElapsedTime());
      }
      labelRenderer.render(scene, camera);
      renderer.render(scene, camera);
    }
    animate();

    function handleResize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (container.contains(labelRenderer.domElement)) {
        container.removeChild(labelRenderer.domElement);
      }
    };
  }, [config]);

  useEffect(() => {
    if (waterMeshRef.current) {
      waterMeshRef.current.position.y = -2.5 + (waterLevel / 100) * 5.5;
    }
  }, [waterLevel]);

  useEffect(() => {
    function handleLabelClick(e: Event) {
      const detail = (e as CustomEvent).detail;
      setSelectedLandformInfo(detail);
      setShowProfile(true);
    }
    window.addEventListener('ar-label-click', handleLabelClick);
    return () => window.removeEventListener('ar-label-click', handleLabelClick);
  }, []);

  const handleProfileClick = useCallback(() => {
    setSelectedLandformInfo(config.landformInfo);
    setShowProfile(true);
  }, [config]);

  const safetyHint = arMode === 'camera' || arMode === 'webxr';

  return (
    <div className="bg-background-dark text-white font-display h-screen w-full overflow-hidden relative select-none">
      <div ref={mountRef} className="absolute inset-0 z-0" />

      <header className="absolute top-0 left-0 right-0 z-50 p-4">
        <div className="glass-panel rounded-full p-2 pl-4 pr-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-white hover:text-primary-cyan transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="text-sm font-bold tracking-wide uppercase text-white/60">AR地理</h1>
              <p className="text-lg font-bold text-primary-cyan leading-none">地形: {config.name}</p>
            </div>
          </div>
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 bg-primary-cyan/20 hover:bg-primary-cyan/30 text-primary-cyan px-4 py-2 rounded-full transition-all border border-primary-cyan/30"
          >
            <span className="material-symbols-outlined text-[20px]">ssid_chart</span>
            <span className="text-sm font-bold">剖面图</span>
          </button>
        </div>
      </header>

      <div className="absolute top-24 left-4 z-50">
        <div className="glass-panel rounded-full px-3 py-1.5 flex items-center gap-2">
          {arMode === 'webxr' && <span className="material-symbols-outlined text-sm text-primary-cyan">view_in_ar</span>}
          {arMode === 'camera' && <span className="material-symbols-outlined text-sm text-green-400">photo_camera</span>}
          {arMode === 'pure3d' && <span className="material-symbols-outlined text-sm text-yellow-400">3d_rotation</span>}
          <span className="text-xs font-medium text-white/80">
            {arMode === 'webxr' ? 'AR模式' : arMode === 'camera' ? '相机模式' : '3D模式'}
          </span>
        </div>
      </div>

      {safetyHint && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-black/80 backdrop-blur text-white/90 text-xs py-2 px-4 rounded-full border border-white/10 flex items-center gap-2 animate-bounce shadow-xl">
            <span className="material-symbols-outlined text-sm text-yellow-400">warning</span>
            注意周围环境
          </div>
        </div>
      )}

      <aside className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 flex flex-col gap-6 items-end">
        <div className="glass-panel p-2 rounded-full h-72 w-16 flex flex-col items-center justify-between py-6 relative">
          <span className="material-symbols-outlined text-primary-cyan mb-2">water_drop</span>
          <div className="relative flex-1 w-2 bg-white/10 rounded-full overflow-hidden my-2">
            <div
              className="absolute bottom-0 w-full bg-gradient-to-t from-primary-cyan to-[#92c0c9] rounded-full transition-all duration-300"
              style={{ height: `${waterLevel}%` }}
            ></div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={waterLevel}
            onChange={(e) => setWaterLevel(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ns-resize z-10"
            style={{ transform: 'rotate(-90deg)' }}
          />
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center pointer-events-none transition-all duration-300"
            style={{ bottom: `calc(${waterLevel}% + 20px)` }}
          >
            <span className="text-[10px] font-bold text-background-dark">{waterLevel}%</span>
          </div>
          <span className="text-[10px] font-bold text-white/40 mt-2">水位</span>
        </div>
      </aside>

      <footer className="absolute bottom-0 left-0 right-0 z-50 flex flex-col justify-end bg-gradient-to-t from-background-dark via-background-dark/90 to-transparent pt-12 pb-6 px-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-white text-sm font-bold uppercase tracking-widest opacity-70">选择地貌</p>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
          {LANDFORM_CONFIGS.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedIndex(index)}
              className={`snap-center shrink-0 w-40 cursor-pointer hover:scale-[1.02] transition-transform ${selectedIndex === index ? 'w-48' : ''}`}
            >
              <div className={`h-28 rounded-xl ${selectedIndex === index ? 'bg-gradient-to-r from-primary-cyan to-[#92c0c9] p-[2px]' : 'glass-panel'}`}>
                <div className={`relative h-full rounded-xl ${selectedIndex === index ? 'bg-[#192f33]' : ''} p-3 flex flex-col justify-end border border-white/5 overflow-hidden`}>
                  {selectedIndex === index && (
                    <div className="relative z-10 flex justify-between items-start">
                      <span className="bg-primary-cyan text-background-dark text-[10px] font-bold px-1.5 py-0.5 rounded">当前</span>
                      <span className="material-symbols-outlined text-primary-cyan text-lg">check_circle</span>
                    </div>
                  )}
                  <div className="relative z-10">
                    <p className="text-white text-base font-bold leading-tight">{item.name}</p>
                    <p className="text-white/50 text-xs">{item.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </footer>

      <ProfileView
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        landform={selectedLandformInfo}
      />
    </div>
  );
};

export default ARView;
