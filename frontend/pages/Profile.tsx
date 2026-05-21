import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { UserAuth, clearAuthData } from '../api';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserAuth | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [gender, setGender] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const ageInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const userData = await api.auth.getMe(token);
        setUser(userData);
        setName(userData.name || '');
        setGender(userData.gender || '');
        setAge(userData.age?.toString() || '');
        setAvatarUrl(userData.avatar_url || '');
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updateData: Partial<UserAuth> = {
        name,
        avatar_url: avatarUrl,
      };

      if (gender) updateData.gender = gender;
      if (ageInputRef.current?.value) updateData.age = parseInt(ageInputRef.current.value, 10);

      await api.user.updateUser(user.id, updateData);
      setSuccess('个人信息更新成功！');

      const updatedUser = {
        ...user,
        name,
        avatar_url: avatarUrl,
        gender: gender || user.gender,
        age: age ? parseInt(age, 10) : user.age,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setName(user.name || '');
      setGender(user.gender || '');
      setAge(user.age?.toString() || '');
      setAvatarUrl(user.avatar_url || '');
    }
    setIsEditing(false);
    setError('');
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${(import.meta as any).env?.VITE_API_URL || 'http://localhost:8080'}/api/upload/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const data = await response.json();
      setAvatarUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : '头像上传失败');
    }
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    try {
      if (refreshToken) {
        await api.auth.logout(refreshToken);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuthData();
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/50">
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">个人资料</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <span className="material-symbols-outlined">{isEditing ? 'close' : 'edit'}</span>
        </button>
      </header>

      <main className="p-4 space-y-6">
        {/* 头像区域 */}
        <div className="text-center py-6">
          <div
            className={`relative inline-block ${isEditing ? 'cursor-pointer' : ''}`}
            onClick={handleAvatarClick}
          >
            <div
              className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-white dark:border-surface-dark shadow-lg mx-auto"
              style={{ backgroundImage: `url("${avatarUrl || 'https://via.placeholder.com/96'}")` }}
            ></div>
            {isEditing && (
              <>
                <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white text-2xl">camera_alt</span>
                </div>
                <div className="absolute bottom-0 right-0 size-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-sm">camera_alt</span>
                </div>
              </>
            )}
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {isEditing ? '点击更换头像' : user?.name || '用户'}
          </p>
        </div>

        {/* 消息提示 */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        {success && (
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
          </div>
        )}

        {/* 基本信息 */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">基本信息</h2>

          {/* 昵称 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">昵称</label>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入昵称"
                maxLength={100}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            ) : (
              <p className="px-4 py-3 text-slate-900 dark:text-white">{user?.name || '未设置'}</p>
            )}
          </div>

          {/* 性别 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">性别</label>
            {isEditing ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    gender === 'male'
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="material-symbols-outlined inline-block mr-1">male</span>
                  男
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    gender === 'female'
                      ? 'bg-pink-50 border-pink-300 text-pink-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="material-symbols-outlined inline-block mr-1">female</span>
                  女
                </button>
                <button
                  type="button"
                  onClick={() => setGender('other')}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    gender === 'other'
                      ? 'bg-purple-50 border-purple-300 text-purple-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  保密
                </button>
              </div>
            ) : (
              <p className="px-4 py-3 text-slate-900 dark:text-white">
                {user?.gender === 'male' ? '男' : user?.gender === 'female' ? '女' : '未设置'}
              </p>
            )}
          </div>

          {/* 年龄 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">年龄</label>
            {isEditing ? (
              <input
                ref={ageInputRef}
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="请输入年龄"
                min={1}
                max={120}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            ) : (
              <p className="px-4 py-3 text-slate-900 dark:text-white">{user?.age || '未设置'}</p>
            )}
          </div>
        </div>

        {/* 学习统计 */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">学习统计</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-xs text-slate-500">已完成关卡</p>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center">
              <p className="text-2xl font-bold text-emerald-600">85%</p>
              <p className="text-xs text-slate-500">平均正确率</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
              <p className="text-2xl font-bold text-purple-600">7</p>
              <p className="text-xs text-slate-500">连续学习天数</p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center">
              <p className="text-2xl font-bold text-orange-600">156</p>
              <p className="text-xs text-slate-500">总答题数</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">本周学习时间</span>
            <span className="font-bold">4小时32分钟</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">快捷入口</h2>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => navigate('/mistakes')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-red-500">error</span>
              <span className="text-xs">错题集</span>
            </button>
            <button
              onClick={() => navigate('/leaderboard')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-yellow-500">leaderboard</span>
              <span className="text-xs">排行榜</span>
            </button>
            <button
              onClick={() => navigate('/daily-challenge')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-purple-500">bolt</span>
              <span className="text-xs">每日挑战</span>
            </button>
          </div>
        </div>

        {/* 账号信息 */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">账号信息</h2>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-600 dark:text-slate-400">邮箱</span>
            <span className="text-slate-900 dark:text-white">{user?.email || '未绑定'}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-600 dark:text-slate-400">手机</span>
            <span className="text-slate-900 dark:text-white">{user?.phone || '未绑定'}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-600 dark:text-slate-400">学习等级</span>
            <span className="text-slate-900 dark:text-white">{user?.level || '初学者'}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-600 dark:text-slate-400">获得星星</span>
            <span className="text-amber-500 font-bold">★ {user?.total_stars || 0}</span>
          </div>
        </div>

        {/* 编辑模式下的保存/取消按钮 */}
        {isEditing && (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-base hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3.5 rounded-xl bg-primary text-white font-bold text-base shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {saving ? '保存中...' : '保存修改'}
            </button>
          </div>
        )}

        {/* 退出登录 */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full py-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-bold text-base hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-95 transition-all"
        >
          退出登录
        </button>
      </main>

      {/* 退出登录确认弹窗 */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-red-500">logout</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">确认退出登录？</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">退出后需要重新登录才能访问您的个人数据</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
