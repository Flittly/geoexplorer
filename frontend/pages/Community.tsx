import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { communityAPI, PostItem, getCurrentUser } from '../api';

const tabs = [
    { key: '', label: '全部' },
    { key: 'share', label: '学习分享' },
    { key: 'checkin', label: '打卡动态' },
    { key: 'question', label: '问答交流' },
];

const Community: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('');
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const user = getCurrentUser();

    const loadPosts = useCallback(async (pageNum: number, reset: boolean) => {
        if (loading) return;
        setLoading(true);
        try {
            const type = activeTab || undefined;
            const data = await communityAPI.getPosts(type, pageNum, 10);
            setPosts(prev => reset ? data : [...prev, ...data]);
            setHasMore(data.length >= 10);
        } catch (err) {
            console.error('Failed to load posts', err);
        } finally {
            setLoading(false);
        }
    }, [activeTab, loading]);

    useEffect(() => {
        setPage(1);
        setPosts([]);
        setHasMore(true);
        loadPosts(1, true);
    }, [activeTab]);

    const loadMore = () => {
        if (!hasMore || loading) return;
        const nextPage = page + 1;
        setPage(nextPage);
        loadPosts(nextPage, false);
    };

    const handleLike = async (e: React.MouseEvent, post: PostItem) => {
        e.stopPropagation();
        if (!user) { navigate('/login'); return; }
        try {
            const res = await communityAPI.toggleLike(post.id, 'post');
            setPosts(prev => prev.map(p => p.id === post.id ? {
                ...p,
                is_liked: res.liked,
                like_count: res.liked ? p.like_count + 1 : p.like_count - 1,
            } : p));
        } catch {}
    };

    const handleFavorite = async (e: React.MouseEvent, post: PostItem) => {
        e.stopPropagation();
        if (!user) { navigate('/login'); return; }
        try {
            const res = await communityAPI.toggleFavorite(post.id);
            setPosts(prev => prev.map(p => p.id === post.id ? {
                ...p,
                is_favorited: res.favorited,
                favorite_count: res.favorited ? p.favorite_count + 1 : p.favorite_count - 1,
            } : p));
        } catch {}
    };

    const getPostTypeColor = (type: string) => {
        switch (type) {
            case 'checkin': return 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
            case 'question': return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
            default: return 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400';
        }
    };

    const getPostTypeLabel = (type: string) => {
        switch (type) {
            case 'checkin': return '打卡';
            case 'question': return '问答';
            default: return '分享';
        }
    };

    const renderImageGrid = (images?: string[]) => {
        if (!images || images.length === 0) return null;
        const displayImages = images.slice(0, 3);
        const gridClass = displayImages.length === 1
            ? 'grid-cols-1'
            : displayImages.length === 2
                ? 'grid-cols-2'
                : 'grid-cols-3';
        return (
            <div className={`grid ${gridClass} gap-1.5 mt-3 rounded-xl overflow-hidden`}>
                {displayImages.map((img, i) => (
                    <div key={i} className="aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">社区</h1>
                <button
                    onClick={() => user ? navigate('/community/create') : navigate('/login')}
                    className="flex items-center justify-center size-9 rounded-full bg-primary text-white shadow-sm hover:bg-primary/90 transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">add</span>
                </button>
            </header>

            <div className="sticky top-[56px] z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4">
                <div className="flex gap-1 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                                activeTab === tab.key
                                    ? 'text-primary border-primary'
                                    : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <main className="p-4 flex flex-col gap-3">
                {posts.length === 0 && !loading && (
                    <div className="text-center py-20 text-slate-400">
                        <span className="material-symbols-outlined text-5xl mb-2">forum</span>
                        <p>暂无帖子</p>
                    </div>
                )}

                {posts.map(post => (
                    <div
                        key={post.id}
                        onClick={() => navigate(`/community/${post.id}`)}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-4 cursor-pointer active:scale-[0.99] transition-transform"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div
                                className="size-9 rounded-full bg-cover bg-center bg-slate-200 dark:bg-slate-700 flex-shrink-0"
                                style={{ backgroundImage: `url("${post.user_avatar}")` }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{post.user_name}</p>
                                <p className="text-xs text-slate-400">{post.user_level}</p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPostTypeColor(post.post_type)}`}>
                                {getPostTypeLabel(post.post_type)}
                            </span>
                            {post.post_type === 'question' && post.is_accepted && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 font-medium">
                                    已采纳
                                </span>
                            )}
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 line-clamp-1">{post.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">{post.content}</p>

                        {renderImageGrid(post.images)}

                        <div className="flex items-center gap-5 mt-3 pt-3 border-t border-slate-50 dark:border-slate-800">
                            <button
                                onClick={(e) => handleLike(e, post)}
                                className={`flex items-center gap-1 text-xs transition-colors ${post.is_liked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}
                            >
                                <span className={`material-symbols-outlined text-lg ${post.is_liked ? 'icon-filled' : ''}`}>favorite</span>
                                {post.like_count || ''}
                            </button>
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                                <span className="material-symbols-outlined text-lg">chat_bubble_outline</span>
                                {post.comment_count || ''}
                            </span>
                            <button
                                onClick={(e) => handleFavorite(e, post)}
                                className={`flex items-center gap-1 text-xs transition-colors ${post.is_favorited ? 'text-amber-500' : 'text-slate-400 hover:text-amber-400'}`}
                            >
                                <span className={`material-symbols-outlined text-lg ${post.is_favorited ? 'icon-filled' : ''}`}>star</span>
                                {post.favorite_count || ''}
                            </button>
                        </div>
                    </div>
                ))}

                {hasMore && posts.length > 0 && (
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="py-3 text-sm text-primary font-medium"
                    >
                        {loading ? '加载中...' : '加载更多'}
                    </button>
                )}

                {loading && posts.length === 0 && (
                    <div className="text-center py-20 text-slate-400">
                        <div className="animate-spin inline-block size-6 border-2 border-primary border-t-transparent rounded-full mb-2" />
                        <p>加载中...</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Community;
