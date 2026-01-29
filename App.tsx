import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Globe from './pages/Globe';
import Mistakes from './pages/Mistakes';
import Levels from './pages/Levels';
import ARView from './pages/ARView';
import BottomNav from './components/BottomNav';

// Fix: Make children optional in type definition to prevent TS error about missing children
const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  // Don't show standard nav on immersive pages like Globe or AR
  const hideNav = ['/globe', '/ar', '/levels'].includes(location.pathname);
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {children}
      </div>
      {!hideNav && <BottomNav />}
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/globe" element={<Globe />} />
          <Route path="/mistakes" element={<Mistakes />} />
          <Route path="/levels" element={<Levels />} />
          <Route path="/ar" element={<ARView />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}