import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const API_BASE_URL = 'http://localhost:8000';

interface Stats {
  total_users: number;
  total_courses: number;
  total_questions: number;
  total_trivia: number;
  today_new_users: number;
  today_active_users: number;
  unread_notifications: number;
}

interface Activity {
  id: string;
  action: string;
  admin_name: string;
  details: Record<string, any>;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { token, logout } = useAdmin();
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchDashboardData();
  }, [token, navigate]);

  const fetchDashboardData = async () => {
    try {
      // 获取统计数据
      const statsRes = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // 获取最近活动
      const activitiesRes = await fetch(`${API_BASE_URL}/api/admin/dashboard/recent-activities`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json();
        setActivities(activitiesData.activities || []);
      }
    } catch (err) {
      console.error('获取数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getActionText = (action: string) => {
    const actionMap: Record<string, string> = {
      'login': '登录',
      'create': '创建',
      'update': '更新',
      'delete': '删除',
      'update_progress': '更新进度',
      'send_notification': '发送通知',
      'send_broadcast': '发送广播',
    };
    return actionMap[action] || action;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-slate-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white">admin_panel_settings</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">GeoExplorer 管理后台</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">logout</span>
              <span>退出</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {[
              { path: '/admin/dashboard', icon: 'dashboard', label: '仪表盘' },
              { path: '/admin/users', icon: 'people', label: '用户管理' },
              { path: '/admin/levels', icon: 'school', label: '课程管理' },
              { path: '/admin/questions', icon: 'quiz', label: '题库管理' },
              { path: '/admin/trivia', icon: 'lightbulb', label: '每日百科' },
              { path: '/admin/notifications', icon: 'notifications', label: '消息通知' },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-colors whitespace-nowrap"
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: '总用户数', value: stats?.total_users || 0, icon: 'people', color: 'blue' },
            { label: '课程总数', value: stats?.total_courses || 0, icon: 'school', color: 'green' },
            { label: '题目总数', value: stats?.total_questions || 0, icon: 'quiz', color: 'purple' },
            { label: '百科条目', value: stats?.total_trivia || 0, icon: 'lightbulb', color: 'yellow' },
          ].map((stat, index) => (
            <div key={index} className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value.toLocaleString()}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  <span className={`material-symbols-outlined text-${stat.color}-600 dark:text-${stat.color}-400`}>{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm">
            <p className="text-sm text-slate-500 dark:text-slate-400">今日新用户</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats?.today_new_users || 0}</p>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm">
            <p className="text-sm text-slate-500 dark:text-slate-400">今日活跃用户</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats?.today_active_users || 0}</p>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm">
            <p className="text-sm text-slate-500 dark:text-slate-400">未读通知</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats?.unread_notifications || 0}</p>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">最近操作</h2>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {activities.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                暂无操作记录
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm text-slate-500">history</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {activity.admin_name} {getActionText(activity.action)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(activity.created_at).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export { AdminDashboard };
export default AdminDashboard;
