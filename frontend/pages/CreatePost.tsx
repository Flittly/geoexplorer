import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { communityAPI, PostCreateData, getCurrentUser } from '../api';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

const postTypes = [
    { key: 'share', label: '学习分享' },
    { key: 'checkin', label: '打卡动态' },
    { key: 'question', label: '问答交流' },
];

const CreatePost: React.FC = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [postType, setPostType] = useState('share');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [publishing, setPublishing] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const remaining = 9 - images.length;
        if (remaining <= 0) return;

        const token = localStorage.getItem('access_token');
        setUploading(true);

        for (let i = 0; i < Math.min(files.length, remaining); i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
                    method: 'POST',
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    const url = data.url || data.image_url || data.file_url;
                    if (url) {
                        setImages(prev => [...prev, url]);
                    }
                }
            } catch (err) {
                console.error('Upload failed', err);
            }
        }

        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handlePublish = async () => {
        if (!title.trim() || !content.trim()) return;

        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
            return;
        }

        setPublishing(true);
        try {
            const data: PostCreateData = {
                post_type: postType,
                title: title.trim(),
                content: content.trim(),
                images: images.length > 0 ? images : undefined,
            };
            await communityAPI.createPost(data);
            alert('发布成功，等待审核通过后会显示在社区中');
            navigate('/community');
        } catch (err: any) {
            console.error('Failed to publish', err);
            if (err?.message?.includes('401') || err?.message?.includes('403')) {
                alert('登录已过期，请重新登录');
                navigate('/login');
            } else {
                alert('发布失败，请重试');
            }
        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                <button onClick={() => navigate(-1)} className="text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">发布帖子</h1>
                <button
                    onClick={handlePublish}
                    disabled={!title.trim() || !content.trim() || publishing}
                    className="px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-full disabled:opacity-40 hover:bg-primary/90 transition-colors"
                >
                    {publishing ? '发布中...' : '发布'}
                </button>
            </header>

            <main className="p-4 flex flex-col gap-4">
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                    {postTypes.map(type => (
                        <button
                            key={type.key}
                            onClick={() => setPostType(type.key)}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                                postType === type.key
                                    ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>

                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="输入标题"
                    maxLength={100}
                    className="w-full bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                />

                <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="分享你的地理学习心得..."
                    rows={8}
                    className="w-full bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 outline-none resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 leading-relaxed"
                />

                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">图片</span>
                        <span className="text-xs text-slate-400">({images.length}/9)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {images.map((img, i) => (
                            <div key={i} className="relative size-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => removeImage(i)}
                                    className="absolute top-1 right-1 size-5 bg-black/50 rounded-full flex items-center justify-center"
                                >
                                    <span className="material-symbols-outlined text-white text-sm">close</span>
                                </button>
                            </div>
                        ))}
                        {images.length < 9 && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="size-20 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-primary hover:text-primary transition-colors"
                            >
                                {uploading ? (
                                    <div className="animate-spin size-5 border-2 border-primary border-t-transparent rounded-full" />
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                                        <span className="text-[10px]">添加图片</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                </div>

                <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl">
                    <span className="material-symbols-outlined text-amber-500 text-base">info</span>
                    <span className="text-xs text-amber-700 dark:text-amber-400">发布后需审核通过才会显示</span>
                </div>
            </main>
        </div>
    );
};

export default CreatePost;
