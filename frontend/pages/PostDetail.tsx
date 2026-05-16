import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { communityAPI, PostItem, CommentItem, getCurrentUser } from '../api';

const PostDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const user = getCurrentUser();
    const [post, setPost] = useState<PostItem | null>(null);
    const [comments, setComments] = useState<CommentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [replyTo, setReplyTo] = useState<CommentItem | null>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!id) return;
        loadPost();
        loadComments();
    }, [id]);

    const loadPost = async () => {
        if (!id) return;
        try {
            const data = await communityAPI.getPost(id);
            setPost(data);
        } catch (err) {
            console.error('Failed to load post', err);
        } finally {
            setLoading(false);
        }
    };

    const loadComments = async () => {
        if (!id) return;
        try {
            const data = await communityAPI.getComments(id);
            const sorted = [...data].sort((a, b) => {
                if (a.is_accepted && !b.is_accepted) return -1;
                if (!a.is_accepted && b.is_accepted) return 1;
                return 0;
            });
            setComments(sorted);
        } catch (err) {
            console.error('Failed to load comments', err);
        }
    };

    const handleLike = async () => {
        if (!post || !user) { if (!user) navigate('/login'); return; }
        try {
            const res = await communityAPI.toggleLike(post.id, 'post');
            setPost(prev => prev ? {
                ...prev,
                is_liked: res.liked,
                like_count: res.liked ? prev.like_count + 1 : prev.like_count - 1,
            } : null);
        } catch {}
    };

    const handleFavorite = async () => {
        if (!post || !user) { if (!user) navigate('/login'); return; }
        try {
            const res = await communityAPI.toggleFavorite(post.id);
            setPost(prev => prev ? {
                ...prev,
                is_favorited: res.favorited,
                favorite_count: res.favorited ? prev.favorite_count + 1 : prev.favorite_count - 1,
            } : null);
        } catch {}
    };

    const handleCommentLike = async (comment: CommentItem) => {
        if (!user) { navigate('/login'); return; }
        try {
            const res = await communityAPI.toggleLike(comment.id, 'comment');
            setComments(prev => prev.map(c => c.id === comment.id ? {
                ...c,
                is_liked: res.liked,
                like_count: res.liked ? c.like_count + 1 : c.like_count - 1,
            } : c));
        } catch {}
    };

    const handleAccept = async (commentId: string) => {
        if (!id) return;
        try {
            await communityAPI.acceptComment(commentId);
            await loadComments();
            await loadPost();
        } catch {}
    };

    const handleSubmitComment = async () => {
        if (!commentText.trim() || !id || !user) return;
        setSubmitting(true);
        try {
            await communityAPI.createComment(id, {
                content: commentText.trim(),
                parent_id: replyTo?.id,
            });
            setCommentText('');
            setReplyTo(null);
            await loadComments();
            setPost(prev => prev ? { ...prev, comment_count: prev.comment_count + 1 } : null);
        } catch (err) {
            console.error('Failed to post comment', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = (comment: CommentItem) => {
        setReplyTo(comment);
        inputRef.current?.focus();
    };

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return '刚刚';
        if (mins < 60) return `${mins}分钟前`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}小时前`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days}天前`;
        return new Date(dateStr).toLocaleDateString('zh-CN');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-2">error</span>
                <p className="text-slate-400">帖子不存在</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-primary text-sm font-medium">返回</button>
            </div>
        );
    }

    const isAuthor = user?.id === post.user_id;
    const acceptedComment = comments.find(c => c.is_accepted);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-3 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
                <button onClick={() => navigate(-1)} className="text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white flex-1">帖子详情</h1>
            </header>

            <main className="p-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 mb-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="size-10 rounded-full bg-cover bg-center bg-slate-200 dark:bg-slate-700"
                            style={{ backgroundImage: `url("${post.user_avatar}")` }}
                        />
                        <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{post.user_name}</p>
                            <p className="text-xs text-slate-400">{post.user_level} · {timeAgo(post.created_at)}</p>
                        </div>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{post.title}</h2>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                    {post.images && post.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {post.images.map((img, i) => (
                                <div key={i} className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                    <img src={img} alt="" className="max-w-full max-h-60 object-cover" loading="lazy" />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1.5 text-sm transition-colors ${post.is_liked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}
                        >
                            <span className={`material-symbols-outlined text-xl ${post.is_liked ? 'icon-filled' : ''}`}>favorite</span>
                            {post.like_count || '点赞'}
                        </button>
                        <button
                            onClick={handleFavorite}
                            className={`flex items-center gap-1.5 text-sm transition-colors ${post.is_favorited ? 'text-amber-500' : 'text-slate-400 hover:text-amber-400'}`}
                        >
                            <span className={`material-symbols-outlined text-xl ${post.is_favorited ? 'icon-filled' : ''}`}>star</span>
                            {post.favorite_count || '收藏'}
                        </button>
                        <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                            <span className="material-symbols-outlined text-xl">share</span>
                            分享
                        </button>
                    </div>
                </div>

                <div className="mb-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        评论 ({comments.length})
                    </h3>
                </div>

                {comments.length === 0 && (
                    <div className="text-center py-10 text-slate-400">
                        <span className="material-symbols-outlined text-4xl mb-1">chat_bubble_outline</span>
                        <p className="text-sm">暂无评论，快来抢沙发吧</p>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {comments.map(comment => (
                        <div
                            key={comment.id}
                            className={`bg-white dark:bg-slate-900 rounded-xl border p-3.5 ${
                                comment.is_accepted
                                    ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10'
                                    : 'border-slate-100 dark:border-slate-800'
                            }`}
                        >
                            {comment.is_accepted && (
                                <div className="flex items-center gap-1 mb-2">
                                    <span className="material-symbols-outlined text-emerald-500 text-base icon-filled">check_circle</span>
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">已采纳</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2.5 mb-2">
                                <div
                                    className="size-8 rounded-full bg-cover bg-center bg-slate-200 dark:bg-slate-700 flex-shrink-0"
                                    style={{ backgroundImage: `url("${comment.user_avatar}")` }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{comment.user_name}</p>
                                    <p className="text-xs text-slate-400">{timeAgo(comment.created_at)}</p>
                                </div>
                                {isAuthor && post.post_type === 'question' && !comment.is_accepted && !acceptedComment && (
                                    <button
                                        onClick={() => handleAccept(comment.id)}
                                        className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                                    >
                                        采纳
                                    </button>
                                )}
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{comment.content}</p>
                            {comment.images && comment.images.length > 0 && (
                                <div className="flex gap-2 mt-2">
                                    {comment.images.map((img, i) => (
                                        <img key={i} src={img} alt="" className="max-h-32 rounded-lg object-cover" loading="lazy" />
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center gap-4 mt-2.5">
                                <button
                                    onClick={() => handleCommentLike(comment)}
                                    className={`flex items-center gap-1 text-xs transition-colors ${comment.is_liked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}
                                >
                                    <span className={`material-symbols-outlined text-base ${comment.is_liked ? 'icon-filled' : ''}`}>favorite</span>
                                    {comment.like_count || ''}
                                </button>
                                <button
                                    onClick={() => handleReply(comment)}
                                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-base">reply</span>
                                    回复
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-3 pb-safe z-50">
                {replyTo && (
                    <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">
                        <span>回复 {replyTo.user_name}</span>
                        <button onClick={() => setReplyTo(null)} className="text-slate-400 hover:text-slate-600">
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                )}
                <div className="flex items-end gap-2">
                    <textarea
                        ref={inputRef}
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder={user ? '写评论...' : '登录后评论'}
                        disabled={!user}
                        rows={1}
                        className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 resize-none outline-none focus:ring-2 focus:ring-primary/30"
                        style={{ maxHeight: '100px' }}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitComment(); } }}
                    />
                    <button
                        onClick={handleSubmitComment}
                        disabled={!commentText.trim() || submitting}
                        className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl disabled:opacity-40 hover:bg-primary/90 transition-colors flex-shrink-0"
                    >
                        {submitting ? '...' : '发送'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
