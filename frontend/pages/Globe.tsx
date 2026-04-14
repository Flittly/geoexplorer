import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface GeoFeature {
  id: string;
  name: string;
  type: string;
  region: string;
  stats: { label: string; value: string }[];
  description: string;
}

const Globe: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState(0);

  const geoFeatures: GeoFeature[] = [
    {
      id: '1',
      name: '火环 (环太平洋火山地震带)',
      type: '地质特征',
      region: '太平洋海盆',
      stats: [
        { label: '火山', value: '452' },
        { label: '活火山占比', value: '75%' },
        { label: '全长', value: '40K' },
      ],
      description: '环绕太平洋边缘的马蹄形地带，这里活火山和地震活动频繁。全球约75%的活火山和休眠火山都分布于此。',
    },
    {
      id: '2',
      name: '喜马拉雅山脉',
      type: '地形特征',
      region: '亚洲',
      stats: [
        { label: '最高峰', value: '8848m' },
        { label: '长度', value: '2400km' },
        { label: '形成时间', value: '5000万年' },
      ],
      description: '世界最高的山脉，由印度板块与欧亚板块碰撞形成。包含世界最高峰珠穆朗玛峰。',
    },
    {
      id: '3',
      name: '亚马逊雨林',
      type: '生态特征',
      region: '南美洲',
      stats: [
        { label: '面积', value: '550万km²' },
        { label: '物种', value: '10%' },
        { label: '含氧量', value: '20%' },
      ],
      description: '世界上最大的热带雨林，被称为"地球之肺"，拥有全球10%的物种。',
    },
  ];

  const currentFeature = geoFeatures[selectedFeature];

  return (
    <div className="relative h-screen w-full overflow-hidden flex flex-col bg-background-dark text-slate-900">
      <div className="absolute inset-0 z-0 bg-background-dark">
        <div 
          className="w-full h-full bg-cover bg-center transform scale-105" 
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAguUrUOwLmBkvDC8ktavChpifcEti-Fqt4nPqKN668GhbhUcEVIczoHNLOT6JBICPkf3WQSTOOGTQqeYg1sLJf-w3FpzZvf_W2wlNRLWB8RebNE7nJZZH-IlmfE4KgjDRq2x3g0d5dZ2G_AQAgFjZlB6WEFaK2hpVx1l9a7yzj8oBSDlfRrjjulvje7s-G8GvX68beixYPkXbkYpa6C6MdLMvXC11vMwOvo03I6CBIVWcBeRLDM9_MiCy1lhn8vPDZQdOxIZVfO8Ic")' }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-black/40 pointer-events-none"></div>
        </div>
      </div>

      <div className="relative z-20 px-4 pt-4 pb-4 w-full flex items-start justify-between pointer-events-none">
        <div className="flex items-center justify-between w-full pointer-events-auto">
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center justify-center size-12 rounded-xl bg-white/80 backdrop-blur-md border border-white/40 shadow-lg text-slate-800 hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined text-2xl group-hover:rotate-45 transition-transform duration-500">explore</span>
          </button>
          <div className="flex flex-col items-center mx-4 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <h1 className="text-white text-lg font-bold tracking-wide uppercase drop-shadow-md">全球探索</h1>
            <div className="flex items-center gap-2 text-xs font-medium text-blue-100/80">
              <span className="material-symbols-outlined text-[10px]">my_location</span>
              <span>35.6762° N, 139.6503° E</span>
            </div>
          </div>
          <button className="flex items-center justify-center size-12 rounded-xl bg-white/80 backdrop-blur-md border border-white/40 shadow-lg text-slate-800 hover:bg-white transition-colors">
            <span className="material-symbols-outlined text-2xl">search</span>
          </button>
        </div>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4">
        <div className="group/fab relative flex items-center justify-end">
          <span className="absolute right-14 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/fab:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-sm">板块</span>
          <button className="flex items-center justify-center size-14 rounded-full bg-white/80 backdrop-blur-md border border-white/40 shadow-lg text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95">
            <span className="material-symbols-outlined text-2xl">landslide</span>
          </button>
        </div>
        <div className="group/fab relative flex items-center justify-end">
          <span className="absolute right-14 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/fab:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-sm">气温</span>
          <button className="flex items-center justify-center size-14 rounded-full bg-white/80 backdrop-blur-md border border-white/40 shadow-lg text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95">
            <span className="material-symbols-outlined text-2xl">thermostat</span>
          </button>
        </div>
        <div className="group/fab relative flex items-center justify-end">
          <span className="absolute right-14 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/fab:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-sm">地形</span>
          <button className="flex items-center justify-center size-14 rounded-full bg-primary backdrop-blur-md border border-white/20 shadow-lg shadow-blue-900/30 text-white hover:bg-blue-600 transition-all active:scale-95 ring-4 ring-primary/20">
            <span className="material-symbols-outlined text-2xl">landscape</span>
          </button>
        </div>
      </div>

      {/* Feature Selector */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
        {geoFeatures.map((feature, index) => (
          <button
            key={feature.id}
            onClick={() => setSelectedFeature(index)}
            className={`size-10 rounded-full flex items-center justify-center transition-all ${
              selectedFeature === index 
                ? 'bg-primary text-white shadow-lg' 
                : 'bg-white/80 text-slate-600 hover:bg-white'
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {index === 0 ? 'local_fire_department' : index === 1 ? 'terrain' : 'forest'}
            </span>
          </button>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full z-30 transform transition-transform duration-300 ease-out">
        <div className="w-full bg-white/85 backdrop-blur-xl rounded-t-3xl border-t border-white/50 shadow-[0_-8px_32px_rgba(0,0,0,0.3)] pb-8 pt-2 px-6 flex flex-col gap-4">
          <div className="w-full flex justify-center py-2">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full"></div>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">{currentFeature.type}</span>
                <span className="flex items-center text-slate-500 text-xs">
                  <span className="material-symbols-outlined text-[14px] mr-1">public</span>
                  {currentFeature.region}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">{currentFeature.name}</h2>
            </div>
            <button className="flex items-center justify-center size-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <span className="material-symbols-outlined text-xl">bookmark_border</span>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {currentFeature.stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/60 border border-white/50 shadow-sm">
                <span className="text-primary font-bold text-lg">{stat.value}</span>
                <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wide">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="relative">
            <p className="text-slate-600 text-sm leading-relaxed font-normal">
              {currentFeature.description}
            </p>
            <button 
              onClick={() => navigate('/levels')}
              className="mt-4 w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:bg-blue-600 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              开始课程
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Globe;