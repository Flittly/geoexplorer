import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const API_BASE_URL = 'http://localhost:8000';

interface Trivia {
  id: string;
  title: string;
  description: string;
  location?: string;
  region?: string;
  featured_date: string;
  image_url?: string;
}

const TriviaManagement: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAdmin();
  const [triviaList, setTriviaList] = useState<Trivia[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTrivia, setEditingTrivia] = useState<Trivia | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    region: '',
    featured_date: new Date().toISOString().split('T')[0],
    image_url: '',
  });

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchTrivia();
  }, [token, navigate]);

  const fetchTrivia = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/trivia`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTriviaList(data.trivia || []);
      }
    } catch (err) {
      console.error('获取百科失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTrivia 
        ? `${API_BASE_URL}/api/admin/trivia/${editingTrivia.id}`
        : `${API_BASE_URL}/api/admin/trivia`;
      
      const method = editingTrivia ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingTrivia(null);
        fetchTrivia();
      }
    } catch (err) {
      console.error('保存百科失败:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条百科吗？')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/trivia/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchTrivia();
    } catch (err) {
      console.error('删除百科失败:', err);
    }
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
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">每日百科管理</h1>
            </div>
            <button
              onClick={() => {
                setEditingTrivia(null);
                setFormData({
                  title: '',
                  description: '',
                  location: '',
                  region: '',
                  featured_date: new Date().toISOString().split('T')[0],
                  image_url: '',
                });
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
            >
              <span className="material-symbols-outlined">add</span>
              添加百科
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8 text-slate-500">加载中...</div>
          ) : triviaList.length === 0 ? (
            <div className="col-span-full text-center py-8 text-slate-500">暂无百科条目</div>
          ) : (
            triviaList.map((trivia) => (
              <div key={trivia.id} className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm overflow-hidden">
                {trivia.image_url && (
                  <div className="h-40 bg-slate-200 dark:bg-slate-700">
                    <img src={trivia.image_url} alt={trivia.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <p className="text-xs text-slate-500 mb-1">{trivia.featured_date}</p>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{trivia.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{trivia.description}</p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        setEditingTrivia(trivia);
                        setFormData({
                          title: trivia.title,
                          description: trivia.description,
                          location: trivia.location || '',
                          region: trivia.region || '',
                          featured_date: trivia.featured_date,
                          image_url: trivia.image_url || '',
                        });
                        setShowModal(true);
                      }}
                      className="flex-1 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(trivia.id)}
                      className="flex-1 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              {editingTrivia ? '编辑百科' : '添加百科'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">地点</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">地区</label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">展示日期</label>
                <input
                  type="date"
                  value={formData.featured_date}
                  onChange={(e) => setFormData({...formData, featured_date: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">图片URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="https://..."
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
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export { TriviaManagement };
export default TriviaManagement;
