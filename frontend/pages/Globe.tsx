import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GeographicFeature, api } from '../api';

declare const L: any;

const MIN_ZOOM_FOR_MARKERS = 5;
const DEFAULT_CENTER: [number, number] = [35.0, 105.0];
const DEFAULT_ZOOM = 3;

const categoryColors: Record<string, string> = {
  地质: '#ef4444',
  地形: '#f97316',
  生态: '#22c55e',
  水文: '#3b82f6',
  人文: '#a855f7',
  气候: '#eab308',
};

const categoryIcons: Record<string, string> = {
  地质: 'landscape',
  地形: 'terrain',
  生态: 'forest',
  水文: 'water_drop',
  人文: 'temple_buddhist',
  气候: 'thermostat',
};

const Globe: React.FC = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const pulseLayerRef = useRef<any>(null);

  const [markers, setMarkers] = useState<GeographicFeature[]>([]);
  const [selected, setSelected] = useState<GeographicFeature | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeographicFeature[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const [filters, setFilters] = useState({
    gradeLevel: '',
    textbook: '',
    sourceType: '',
    category: '',
  });

  const filteredMarkers = useMemo(() => markers.filter(m => {
    if (filters.gradeLevel && m.grade_level !== filters.gradeLevel) return false;
    if (filters.sourceType && m.source_type !== filters.sourceType) return false;
    if (filters.category && m.category !== filters.category) return false;
    if (filters.textbook && filters.sourceType === '知识点' && m.textbook !== filters.textbook) return false;
    return true;
  }), [markers, filters]);

  useEffect(() => {
    api.geoFeatures.getMapMarkers().then(data => {
      setMarkers(data.filter(m => m.latitude != null && m.longitude != null));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true,
      worldCopyJump: true,
    });

    L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: '1234',
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    pulseLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const updateMapMarkers = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const markersGroup = markersLayerRef.current;
    const pulseGroup = pulseLayerRef.current;
    markersGroup.clearLayers();
    pulseGroup.clearLayers();

    const currentZoom = map.getZoom();

    filteredMarkers.forEach(f => {
      const lat = f.latitude!;
      const lng = f.longitude!;
      const minZoom = f.min_zoom ?? MIN_ZOOM_FOR_MARKERS;
      const color = categoryColors[f.category || ''] || '#277bf1';

      if (currentZoom >= minZoom) {
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;cursor:pointer;">
            <span class="material-symbols-outlined" style="font-size:16px;color:white;">${categoryIcons[f.category || ''] || 'place'}</span>
          </div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([lat, lng], { icon })
          .on('click', () => setSelected(f));

        markersGroup.addLayer(marker);
      } else {
        const circle = L.circleMarker([lat, lng], {
          radius: 5,
          fillColor: color,
          fillOpacity: 0.7,
          color: 'white',
          weight: 2,
          className: 'leaflet-pulse-dot',
        });

        pulseGroup.addLayer(circle);
      }
    });
  }, [filteredMarkers]);

  useEffect(() => {
    updateMapMarkers();
  }, [updateMapMarkers]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const handler = () => updateMapMarkers();
    map.on('zoomend', handler);
    return () => map.off('zoomend', handler);
  }, [updateMapMarkers]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const results = await api.geoFeatures.searchFeatures(query, 10);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    }
  };

  const flyToFeature = (f: GeographicFeature) => {
    const map = mapInstanceRef.current;
    if (!map || f.latitude == null || f.longitude == null) return;
    map.flyTo([f.latitude, f.longitude], Math.max(f.min_zoom ?? MIN_ZOOM_FOR_MARKERS, 6), { duration: 1.2 });
    setSelected(f);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const toggleFilter = (key: keyof typeof filters, value: string) => {
    setFilters(prev => {
      if (key === 'sourceType') {
        const nextSourceType = prev.sourceType === value ? '' : value;
        return { ...prev, sourceType: nextSourceType, textbook: nextSourceType !== '知识点' ? '' : prev.textbook };
      }
      return { ...prev, [key]: prev[key] === value ? '' : value };
    });
  };

  const resetFilters = () => setFilters({ gradeLevel: '', textbook: '', sourceType: '', category: '' });

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const grades = ['高一', '高二', '高三'];
  const textbooks = ['人教版', '鲁教版', '湘教版', '中图版'];
  const sourceTypes = ['知识点', '高考真题', '模拟题'];
  const categories = ['地质', '地形', '生态', '水文', '人文', '气候'];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div ref={mapRef} className="absolute inset-0 z-0" />

      <div className="absolute top-0 left-0 right-0 z-[1000] px-4 pt-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center size-10 rounded-xl bg-white/90 backdrop-blur-md shadow-lg text-slate-700 hover:bg-white shrink-0"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <div className="flex-1 relative">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg px-3 h-10">
            <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
            <input
              type="text"
              placeholder="搜索地理特征..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => setShowSearch(true)}
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none h-full"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setSearchResults([]); setShowSearch(false); }}>
                <span className="material-symbols-outlined text-slate-400 text-lg">close</span>
              </button>
            )}
          </div>

          {showSearch && searchResults.length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200 max-h-64 overflow-y-auto z-50">
              {searchResults.map(f => (
                <button
                  key={f.id}
                  onClick={() => flyToFeature(f)}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-slate-50 text-left border-b border-slate-100 last:border-0"
                >
                  <span className="material-symbols-outlined text-primary text-lg">{categoryIcons[f.category || ''] || 'place'}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{f.name}</p>
                    <p className="text-xs text-slate-500">{f.grade_level} · {f.category} · {f.source_type}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowFilter(true)}
          className="relative flex items-center justify-center size-10 rounded-xl bg-white/90 backdrop-blur-md shadow-lg text-slate-700 hover:bg-white shrink-0"
        >
          <span className="material-symbols-outlined">tune</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 size-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {selected && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000] animate-[slideUp_0.3s_ease-out]">
          <div className="bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-[0_-8px_32px_rgba(0,0,0,0.15)] border-t border-slate-200 pb-6 pt-2 px-5 max-h-[60vh] overflow-y-auto">
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3" />

            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: categoryColors[selected.category || ''] || '#277bf1' }}
                  >
                    {selected.category}
                  </span>
                  {selected.grade_level && (
                    <span className="text-xs text-slate-500">{selected.grade_level}{selected.textbook ? ` · ${selected.textbook}` : ''}</span>
                  )}
                  {selected.source_type && selected.source_type !== '知识点' && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold">{selected.source_type}</span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">{selected.name}</h2>
                {selected.region && (
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">public</span>
                    {selected.region}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center justify-center size-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors">
                  <span className="material-symbols-outlined text-lg">bookmark_border</span>
                </button>
                <button onClick={() => setSelected(null)} className="flex items-center justify-center size-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors">
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            </div>

            {selected.stats && Object.keys(selected.stats).length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {Object.entries(selected.stats).slice(0, 3).map(([key, val]) => (
                  <div key={key} className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-primary font-bold text-sm">{String(val)}</span>
                    <span className="text-[10px] uppercase text-slate-500 font-medium mt-0.5">{key}</span>
                  </div>
                ))}
              </div>
            )}

            {selected.description && (
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{selected.description}</p>
            )}

            {selected.level_id && (
              <button
                onClick={() => navigate(`/level/${selected.level_id}`)}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:bg-blue-600 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                开始课程
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      )}

      {showFilter && (
        <div className="absolute inset-0 z-[1100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowFilter(false)} />
          <div className="relative bg-white rounded-t-3xl shadow-[0_-8px_32px_rgba(0,0,0,0.2)] pt-2 pb-6 px-5 max-h-[75vh] overflow-y-auto animate-[slideUp_0.3s_ease-out]">
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-4">筛选条件</h3>

            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-700 mb-2">年级</p>
              <div className="flex flex-wrap gap-2">
                {grades.map(g => (
                  <button key={g} onClick={() => toggleFilter('gradeLevel', g)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filters.gradeLevel === g ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-700 mb-2">来源类型</p>
              <div className="flex flex-wrap gap-2">
                {sourceTypes.map(s => (
                  <button key={s} onClick={() => toggleFilter('sourceType', s)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filters.sourceType === s ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {filters.sourceType === '知识点' && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">教材版本</p>
                <div className="flex flex-wrap gap-2">
                  {textbooks.map(t => (
                    <button key={t} onClick={() => toggleFilter('textbook', t)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filters.textbook === t ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-5">
              <p className="text-sm font-semibold text-slate-700 mb-2">分类</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button key={c} onClick={() => toggleFilter('category', c)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filters.category === c ? 'text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    style={filters.category === c ? { backgroundColor: categoryColors[c] || '#277bf1' } : undefined}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={resetFilters} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold text-sm hover:bg-slate-200 transition-colors">
                重置
              </button>
              <button onClick={() => setShowFilter(false)} className="flex-1 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-blue-600 transition-colors">
                应用 ({filteredMarkers.length})
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Globe;
