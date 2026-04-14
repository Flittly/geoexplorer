import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const API_BASE_URL = 'http://localhost:8000';

interface Notification {
  id: string;
  user_id?: string;
  user_name?: string;
  title: string;
  content: string;
  type: string;
  is_read: boolean;
  is_broadcast: boolean;
  created_at: string;
}

interface User {
  id: string;
  name: string;
}

const NotificationManagement: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAdmin();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isBroadcast, setIsBroadcast] = useState(false);

  const [formData, setFormData] = useState({
    user_id: '',
    title: '',
    content: '',
    type: 'system',
  });

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchNotifications();
    fetchUsers();
  }, [token, navigate]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error('获取通知失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users?page_size=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('获取用户失败:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/notifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          is_broadcast: isBroadcast,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        fetchNotifications();
      }
    } catch (err) {
      console.error('发送通知失败:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条通知吗？')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchNotifications();
    } catch (err) {
      console.error('删除通知失败:', err);
    }
  };

  const getTypeText = (type: string) => {
    const map: Record<string, string> = { system: '系统', course: '课程', achievement: '成就', reminder: '提醒' };
    return map[type] || type;
  };

  const getTypeColor = (type: string) => {
    const map: Record<string, string> = { system: 'blue', course: 'green', achievement: 'yellow', reminder: 'purple' };
    return map[type] || 'gray';
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <header className="bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/admin/dashboard')} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">消息通知管理</h1>
            </div>
            <button
              onClick={() => {
                setIsBroadcast(false);
                setFormData({ user_id: '', title: '', content: '', type: 'system' });
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
            >
              <span className="material-symbols-outlined">add</span>
              发送通知
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">标题</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">接收者</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">状态</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">加载中...</td></tr>
              ) : notifications.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">暂无通知</td></tr>
              ) : (
                notifications.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 dark:text-white">{n.title}</p>
                      <p className="text-sm text-slate-500 line-clamp-1">{n.content}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 bg-${getTypeColor(n.type)}-100 dark:bg-${getTypeColor(n.type)}-900/20 text-${getTypeColor(n.type)}-700 dark:text-${getTypeColor(n.type)}-300 rounded text-sm`}>
                        {getTypeText(n.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {n.is_broadcast ? (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded text-sm">全员广播</span>
                      ) : (
                        <span className="text-slate-900 dark:text-white">{n.user_name || n.user_id}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm ${n.is_read ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'}`}>
                        {n.is_read ? '已读' : '未读'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">发送通知</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="broadcast"
                  checked={isBroadcast}
                  onChange={(e) => setIsBroadcast(e.target.checked)}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="broadcast" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  发送给所有用户（广播）
                </label>
              </div>

              {!isBroadcast && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">选择用户</label>
                  <select
                    value={formData.user_id}
                    onChange={(e) => setFormData({...formData, user_id: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required={!isBroadcast}
                  >
                    <option value="">请选择用户</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">通知类型</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="system">系统通知</option>
                  <option value="course">课程通知</option>
                  <option value="achievement">成就通知</option>
                  <option value="reminder">提醒通知</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">内容</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
                >
                  发送
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export { NotificationManagement };
export default NotificationManagement;
