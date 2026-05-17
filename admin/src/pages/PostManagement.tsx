import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const API_BASE_URL = 'http://localhost:8000';

interface PostItem {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  post_type: string;
  title: string;
  content: string;
  images?: string[];
  status: string;
  like_count: number;
  comment_count: number;
  favorite_count: number;
  created_at: string;
}

const PostManagement: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAdmin();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchPosts();
  }, [token, navigate, filter, typeFilter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: '1', size: '50' });
      if (filter !== 'all') params.set('status', filter);
      if (typeFilter) params.set('type', typeFilter);

      const res = await fetch(`${API_BASE_URL}/api/admin/posts/all?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('获取帖子失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/posts/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('审核失败:', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/posts/${id}/reject`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('拒绝失败:', err);
    }
  };

  const getTypeBadge = (type: string) => {
    const map: Record<string, { label: string; color: string }> = {
      share: { label: '学习分享', color: 'bg-blue-100 text-blue-700' },
      checkin: { label: '打卡动态', color: 'bg-green-100 text-green-700' },
      question: { label: '问答交流', color: 'bg-purple-100 text-purple-700' },
    };
    const info = map[type] || { label: type, color: 'bg-gray-100 text-gray-700' };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${info.color}`}>
        {info.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      pending: { label: '待审核', color: 'bg-yellow-100 text-yellow-700' },
      approved: { label: '已通过', color: 'bg-green-100 text-green-700' },
      rejected: { label: '已拒绝', color: 'bg-red-100 text-red-700' },
    };
    const info = map[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${info.color}`}>
        {info.label}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('zh-CN');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">帖子审核</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="flex bg-white rounded-lg border overflow-hidden">
            {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {{ pending: '待审核', approved: '已通过', rejected: '已拒绝', all: '全部' }[f]}
              </button>
            ))}
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-white"
          >
            <option value="">全部类型</option>
            <option value="share">学习分享</option>
            <option value="checkin">打卡动态</option>
            <option value="question">问答交流</option>
          </select>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">加载中...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <span className="material-symbols-outlined text-5xl text-gray-300">check_circle</span>
            <p className="text-gray-500 mt-2">暂无{filter === 'pending' ? '待审核' : ''}帖子</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4">
                  {/* Author info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-full bg-gray-200 bg-cover bg-center"
                      style={{ backgroundImage: `url("${post.user_avatar || ''}")` }}
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{post.user_name}</span>
                      <span className="text-xs text-gray-500 ml-2">{formatDate(post.created_at)}</span>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      {getTypeBadge(post.post_type)}
                      {getStatusBadge(post.status)}
                    </div>
                  </div>

                  {/* Title and content */}
                  <h3 className="font-bold text-gray-900 mb-1">{post.title}</h3>
                  <p className={`text-sm text-gray-600 ${expandedId === post.id ? '' : 'line-clamp-3'}`}>
                    {post.content}
                  </p>
                  {post.content.length > 150 && (
                    <button
                      onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
                      className="text-xs text-blue-500 mt-1"
                    >
                      {expandedId === post.id ? '收起' : '展开'}
                    </button>
                  )}

                  {/* Images */}
                  {post.images && post.images.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                      {post.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="w-20 h-20 rounded-lg bg-gray-100 bg-cover bg-center flex-shrink-0 border"
                          style={{ backgroundImage: `url("${img}")` }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex gap-4 mt-3 text-xs text-gray-500">
                    <span>❤ {post.like_count}</span>
                    <span>💬 {post.comment_count}</span>
                    <span>⭐ {post.favorite_count}</span>
                  </div>
                </div>

                {/* Actions */}
                {post.status === 'pending' && (
                  <div className="flex border-t">
                    <button
                      onClick={() => handleApprove(post.id)}
                      className="flex-1 py-3 text-sm font-medium text-green-600 hover:bg-green-50 transition-colors"
                    >
                      ✓ 通过
                    </button>
                    <div className="w-px bg-gray-200"></div>
                    <button
                      onClick={() => handleReject(post.id)}
                      className="flex-1 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      ✗ 拒绝
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export { PostManagement };
export default PostManagement;
