import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ARView: React.FC = () => {
  const navigate = useNavigate();
  const [waterLevel, setWaterLevel] = useState(45);

  return (
    <div className="bg-background-dark text-white font-display h-screen w-full overflow-hidden relative select-none">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/20 z-10"></div> 
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAAv0xfX_ZDskGs-9mzcYdI7XnPw0Bnt9MWEckvQ0kLrsse5SvkkHYu4o1-Q7D0ZSAy-rI2_4-Xa9m17luzj7mBVpwNE0b0FT2vbKEbWCZYPzfB6HRN5hB2ZlpudQhNCFnpOClws2wS3hSZU0CsK1OIIHbRKys-VsNpvxMd6XlieNA6bGRBeLF7qUHBDcbvFtxWU4KWRc8H1ZNQXxWPigz6-RGnWAefJjxFNUKjh5WqDMM23xjBMBnh_GCLuCJaluw2iJD9zx1WQ8r_")' }}
        >
        </div>
        <div className="absolute inset-0 pointer-events-none z-10 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #13c8ec 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      <header className="absolute top-0 left-0 right-0 z-50 p-4">
        <div className="glass-panel rounded-full p-2 pl-4 pr-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="text-white hover:text-primary-cyan transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="text-sm font-bold tracking-wide uppercase text-white/60">AR地理</h1>
              <p className="text-lg font-bold text-primary-cyan leading-none">地形: 盆地</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-primary-cyan/20 hover:bg-primary-cyan/30 text-primary-cyan px-4 py-2 rounded-full transition-all border border-primary-cyan/30">
            <span className="material-symbols-outlined text-[20px]">ssid_chart</span>
            <span className="text-sm font-bold">剖面图</span>
          </button>
        </div>
      </header>

      <main className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="relative w-[340px] h-[340px] ar-glow transform rotate-x-12">
          <div 
            className="w-full h-full bg-contain bg-center bg-no-repeat opacity-90 animate-pulse-slow" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAoXAmVCVEIgASFzpupajADQJAb5143WKjF0k11GpLHN71xB2jDOgA07ag2Ak0o4rL1W2pHwUEKa3cPpL0gdIk54B3g5bahw4SjPxYPZm2kVfnz8WBBtWmxiR_y7ALNTUib-nPXMeTJm5xq3xNKRLjdXh_JghebM4Nls_3fxzpAridnlCj7D7-PSC7JzjF2TOHkCnK_gF4jPYr7jxKzEV-VVDoMYbXPV1e5jfG8M_q5gRVU82kHlfNcJEMJg_6Ro_Z8fH0MjrPuI4TV")' }}
          >
          </div>
          <div className="absolute top-1/4 right-0 transform translate-x-8 -translate-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-cyan rounded-full animate-ping"></div>
              <div className="bg-black/70 backdrop-blur px-2 py-1 rounded border border-primary-cyan/50 text-xs font-mono text-primary-cyan">
                海拔: 1,240m
              </div>
            </div>
          </div>
          <div className="absolute bottom-1/3 left-0 transform -translate-x-4">
            <div className="flex items-center gap-2 flex-row-reverse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="bg-black/70 backdrop-blur px-2 py-1 rounded border border-white/30 text-xs font-mono text-white">
                洪水风险
              </div>
            </div>
          </div>
          <div className="absolute bottom-10 left-4 right-4 h-24 bg-primary-cyan/20 border-t border-primary-cyan/50 blur-[2px] rounded-[50%] transform scale-y-50 translate-y-4"></div>
        </div>
      </main>

      <aside className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 flex flex-col gap-6 items-end">
        <div className="glass-panel p-3 rounded-2xl flex flex-col items-center gap-2 w-16">
          <button className="w-10 h-10 rounded-full bg-primary-cyan text-background-dark flex items-center justify-center shadow-[0_0_15px_rgba(19,200,236,0.5)]">
            <span className="material-symbols-outlined">layers</span>
          </button>
          <span className="text-[10px] uppercase font-bold text-white/70">图层</span>
        </div>
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
        <div className="absolute right-6 top-0 transform -translate-y-full mb-4">
          <button className="flex items-center justify-center rounded-full size-14 bg-white text-background-dark shadow-xl hover:bg-gray-100 transition-colors">
            <span className="material-symbols-outlined text-[32px]">photo_camera</span>
          </button>
        </div>
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-white text-sm font-bold uppercase tracking-widest opacity-70">选择地貌</p>
          <div className="flex gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-cyan"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
          <div className="snap-center shrink-0 w-48 relative group cursor-pointer">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-cyan to-[#92c0c9] rounded-xl opacity-75 blur opacity-100 transition duration-200"></div>
            <div className="relative h-28 rounded-xl bg-[#192f33] p-3 flex flex-col justify-between border border-white/10 overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAbteVbQ0sa32oJuXjgLDVmvaD19LnBTEtHqH8n2V56o_eOYr82vQvYc-c9mcNZiTAY69hWKUQMk8gBOjIpMney81f5MzZtS4-WaYaaTbcLQs6ImGEkr1Qk9-gJhhzwdqCa8LXxTQ5M9JOyXbWdOK_xHinDUtSrrUXcjQhrznc_7zFJFziqTu0nE03fOgN0-2citcLO8oIs2HsvIx362dDp2lQwv5C-obe24IsH2_JX-aqa_LLIM1Zc-0-9jbtEvsmP-g2ubKLzgT0N")' }}
              ></div>
              <div className="relative z-10 flex justify-between items-start">
                <span className="bg-primary-cyan text-background-dark text-[10px] font-bold px-1.5 py-0.5 rounded">当前</span>
                <span className="material-symbols-outlined text-primary-cyan text-lg">check_circle</span>
              </div>
              <div className="relative z-10">
                <p className="text-white text-lg font-bold leading-tight">盆地</p>
                <p className="text-[#92c0c9] text-xs">洼地地形</p>
              </div>
            </div>
          </div>
          <div className="snap-center shrink-0 w-40 cursor-pointer hover:scale-[1.02] transition-transform">
            <div className="h-28 rounded-xl glass-panel p-3 flex flex-col justify-end border border-white/5 relative overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAQcli__sM-0T1nstJTOl6SetpNyGEBznEa-Zsi6xaG1ixJqfs0HcgjvCs2Po6NzNoUI6tZbF6e8fmmKwtZcTqFzoPa-DbZaNGgWIWbolwDRIVFZ9CaFOhjJSJgnTi7DYOukp3W6tIyYKEJOErTFrIKjFBQ1DCWRokbvgs1sOSmA1JtE9SnxrHSHnwNTrZ6ZK7MhvwILC3iZvSXqOM2i-r0d1cLSwX74av7u8S4nGFX203DOYCteiflNN20_0erVYcF_I0paD7A06YI")' }}
              ></div>
              <div className="relative z-10">
                <p className="text-white text-base font-bold leading-tight">山峰</p>
                <p className="text-white/50 text-xs">高海拔</p>
              </div>
            </div>
          </div>
          <div className="snap-center shrink-0 w-40 cursor-pointer hover:scale-[1.02] transition-transform">
            <div className="h-28 rounded-xl glass-panel p-3 flex flex-col justify-end border border-white/5 relative overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC2gpXpxJZuZSBZd2Ys7C0tWIMax-mUPYfYy5U0GZQlfKBf3WlO9NDSSlqCc9bNWpfprjN2zO_tweoiSl8X2HN7NqJ33y4TweqKFXbNTkU8dsSlN1suiDGLg2DJNX6uRmKLrsX3QiVvrEoR6fCtqGKoS7U629fAo_nSeuv-V804_VnLmTkAp0iVy7rg4IVfE5CkLGLY3PO3eYCpkMTFu5WtOel0dUdU_ssEMG29zHsU-0GskpHhtIGSTXGaL8fzhWthY-En3RGdkWAg")' }}
              ></div>
              <div className="relative z-10">
                <p className="text-white text-base font-bold leading-tight">山谷</p>
                <p className="text-white/50 text-xs">河流路径</p>
              </div>
            </div>
          </div>
          <div className="snap-center shrink-0 w-40 cursor-pointer hover:scale-[1.02] transition-transform">
            <div className="h-28 rounded-xl glass-panel p-3 flex flex-col justify-end border border-white/5 relative overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBPhbbndKJv9XTmDhnfCUixfjC9B5RJ7FlGj3mPluThV6pBadflks3DXszXQ4ewuvGKzvwQFkUfvLmhl7bTbawbAZ4zWUpvBVipjIX-zqlVEErd1x9mZawxXnuK-BYdDA5t3AXDY4afolw6S_6ktlHNjzR__h9LZiMdE50rPIgfPj5OFRWvLdSeMWQJ6EM9kvSyAHUHq_tGKANQPyHDfF5lWWgu1Oa7xwqXfQdu7DgvgeK3_bv50DgfCHON90oGLihJJJfEQmrpSjnJ")' }}
              ></div>
              <div className="relative z-10">
                <p className="text-white text-base font-bold leading-tight">悬崖</p>
                <p className="text-white/50 text-xs">垂直落差</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
        <div className="bg-black/80 backdrop-blur text-white/90 text-xs py-2 px-4 rounded-full border border-white/10 flex items-center gap-2 animate-bounce shadow-xl">
          <span className="material-symbols-outlined text-sm text-yellow-400">warning</span>
          注意周围环境
        </div>
      </div>
    </div>
  );
};

export default ARView;