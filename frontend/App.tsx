import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Globe from './pages/Globe';
import Mistakes from './pages/Mistakes';
import MistakeDetail from './pages/MistakeDetail';
import Levels from './pages/Levels';
import LevelDetail from './pages/LevelDetail';
import Quiz from './pages/Quiz';
import ARView from './pages/ARView';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import MicroCourse from './pages/MicroCourse';
import DailyChallenge from './pages/DailyChallenge';
import TriviaDetail from './pages/TriviaDetail';
import Mine from './pages/Mine';
import MyCourses from './pages/MyCourses';
import Settings from './pages/Settings';
import ModuleManage from './pages/ModuleManage';
import Community from './pages/Community';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import CourseShop from './pages/CourseShop';
import CourseDetail from './pages/CourseDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import CoursePlayer from './pages/CoursePlayer';
import BottomNav from './components/BottomNav';

// Lazy load admin components
const AdminProvider = lazy(() => import('../admin/src/context/AdminContext').then(m => ({ default: m.AdminProvider })));
const AdminLogin = lazy(() => import('../admin/src/pages/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('../admin/src/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const UserManagement = lazy(() => import('../admin/src/pages/UserManagement').then(m => ({ default: m.UserManagement })));
const LevelManagement = lazy(() => import('../admin/src/pages/LevelManagement').then(m => ({ default: m.LevelManagement })));
const QuestionManagement = lazy(() => import('../admin/src/pages/QuestionManagement').then(m => ({ default: m.QuestionManagement })));
const TriviaManagement = lazy(() => import('../admin/src/pages/TriviaManagement').then(m => ({ default: m.TriviaManagement })));
const NotificationManagement = lazy(() => import('../admin/src/pages/NotificationManagement').then(m => ({ default: m.NotificationManagement })));
const PostManagement = lazy(() => import('../admin/src/pages/PostManagement').then(m => ({ default: m.PostManagement })));

// Fix: Make children optional in type definition to prevent TS error about missing children
const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  // Don't show standard nav on immersive pages like Globe or AR, and auth pages, and admin pages
  const hideNav = ['/globe', '/ar', '/levels', '/login', '/register', '/profile', '/leaderboard', '/daily-challenge', '/mine', '/my-courses', '/settings', '/module-manage', '/community/create', '/micro-course', '/cart', '/orders'].includes(location.pathname) ||
                  location.pathname.startsWith('/admin') ||
                  location.pathname.startsWith('/level/') ||
                  location.pathname.startsWith('/quiz/') ||
                  location.pathname.startsWith('/mistake/') ||
                  location.pathname.startsWith('/trivia/') ||
                  location.pathname.startsWith('/community/') ||
                  location.pathname.startsWith('/course-shop/') ||
                  location.pathname.startsWith('/my-courses/');
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {children}
      </div>
      {!hideNav && <BottomNav />}
    </div>
  );
};

// Admin layout without bottom nav
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载�?..</div>}>
      <AdminProvider>{children}</AdminProvider>
    </Suspense>
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
          <Route path="/mistake/:mistakeId" element={<MistakeDetail />} />
          <Route path="/levels" element={<Levels />} />
          <Route path="/level/:levelId" element={<LevelDetail />} />
          <Route path="/quiz/:levelId" element={<Quiz />} />
          <Route path="/ar" element={<ARView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/micro-course" element={<MicroCourse />} />
          <Route path="/daily-challenge" element={<DailyChallenge />} />
          <Route path="/trivia/:id" element={<TriviaDetail />} />
          <Route path="/mine" element={<Mine />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/module-manage" element={<ModuleManage />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/create" element={<CreatePost />} />
          <Route path="/community/:id" element={<PostDetail />} />
          <Route path="/course-shop" element={<CourseShop />} />
          <Route path="/course-shop/:id" element={<CourseDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<Orders />} />
          <Route path="/my-courses/:id" element={<CoursePlayer />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLayout><AdminLogin /></AdminLayout>} />
          <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
          <Route path="/admin/levels" element={<AdminLayout><LevelManagement /></AdminLayout>} />
          <Route path="/admin/questions" element={<AdminLayout><QuestionManagement /></AdminLayout>} />
          <Route path="/admin/trivia" element={<AdminLayout><TriviaManagement /></AdminLayout>} />
          <Route path="/admin/notifications" element={<AdminLayout><NotificationManagement /></AdminLayout>} />
          <Route path="/admin/posts" element={<AdminLayout><PostManagement /></AdminLayout>} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
