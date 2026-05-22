/**
 * GeoExplorer API Client
 * 前端 API 调用封装
 */

// Vite injects import.meta.env at build time
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080';

/**
 * Get stored access token
 */
function getAccessToken(): string | null {
    return localStorage.getItem('access_token');
}

function getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
}

function setAccessToken(token: string) {
    localStorage.setItem('access_token', token);
}

function clearAuthData() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
}

// Track in-flight refresh to avoid concurrent refresh storms
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
        const resp = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });
        if (!resp.ok) return false;
        const data = await resp.json();
        setAccessToken(data.access_token);
        if (data.refresh_token) {
            localStorage.setItem('refresh_token', data.refresh_token);
        }
        return true;
    } catch {
        return false;
    }
}

/**
 * Generic fetch wrapper with error handling and auto token refresh
 */
async function fetchAPI<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = getAccessToken();
    if (token) {
        (defaultHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    // 401 + has refresh token → try refresh once and retry
    if (response.status === 401 && getRefreshToken()) {
        if (!refreshPromise) {
            refreshPromise = refreshAccessToken().finally(() => {
                refreshPromise = null;
            });
        }
        const refreshed = await refreshPromise;

        if (refreshed) {
            // Retry with new token
            const retryHeaders: HeadersInit = {
                'Content-Type': 'application/json',
            };
            const newToken = getAccessToken();
            if (newToken) {
                (retryHeaders as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
            }

            response = await fetch(url, {
                ...options,
                headers: {
                    ...retryHeaders,
                    ...options.headers,
                },
            });
        } else {
            clearAuthData();
            window.location.href = '#/login';
            throw new Error('登录已过期，请重新登录');
        }
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

// ============ Auth API ============

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
}

export interface AuthResponse {
    message: string;
    success: boolean;
}

export interface UserAuth {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    avatar_url?: string;
    level: string;
    total_stars: number;
    is_verified: boolean;
    created_at: string;
    gender?: 'male' | 'female' | 'other';
    age?: number;
}

// 保存用户登录信息到本地存储
export function saveAuthData(token: TokenResponse, user?: UserAuth) {
    localStorage.setItem('access_token', token.access_token);
    localStorage.setItem('refresh_token', token.refresh_token);
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
    }
}

// 获取当前登录用户信息
export function getCurrentUser(): UserAuth | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        return JSON.parse(userStr);
    }
    return null;
}

// 清除登录信息
export { clearAuthData };

export const authAPI = {
    // Send verification code
    sendCode: (target: string, type: 'register' | 'login') =>
        fetchAPI<AuthResponse>('/api/auth/send-code', {
            method: 'POST',
            body: JSON.stringify({ target, type }),
        }),

    // Register with code
    register: async (data: {
        email?: string;
        phone?: string;
        code: string;
        name: string;
        password: string;
        avatar_url?: string;
    }) => {
        const token = await fetchAPI<TokenResponse>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        // 获取用户信息
        const user = await authAPI.getMe(token.access_token);
        saveAuthData(token, user);
        return token;
    },

    // Login with password
    loginWithPassword: async (data: {
        email?: string;
        phone?: string;
        password: string;
    }) => {
        const token = await fetchAPI<TokenResponse>('/api/auth/login/password', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        // 获取用户信息
        const user = await authAPI.getMe(token.access_token);
        saveAuthData(token, user);
        return token;
    },

    // Login with code
    loginWithCode: async (data: {
        email?: string;
        phone?: string;
        code: string;
    }) => {
        const token = await fetchAPI<TokenResponse>('/api/auth/login/code', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        // 获取用户信息
        const user = await authAPI.getMe(token.access_token);
        saveAuthData(token, user);
        return token;
    },

    // Get current user info
    getMe: (token?: string) =>
        fetchAPI<UserAuth>('/api/auth/me', {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined
        }),

    // Refresh token
    refreshToken: (refresh_token: string) =>
        fetchAPI<TokenResponse>('/api/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refresh_token }),
        }),

    // Logout
    logout: (refresh_token: string) =>
        fetchAPI<AuthResponse>('/api/auth/logout', {
            method: 'POST',
            body: JSON.stringify({ refresh_token }),
        }),
};

// ============ User API ============

export interface User {
    id: string;
    name: string;
    avatar_url?: string;
    level: string;
    total_stars: number;
    created_at: string;
}

export interface UserProgress {
    user_id: string;
    total_stars: number;
    level: string;
    completed_levels: number;
    current_level_id?: string;
}

export const userAPI = {
    getUser: (userId: string) =>
        fetchAPI<User>(`/api/users/${userId}`),

    updateUser: (userId: string, data: Partial<User>) =>
        fetchAPI<User>(`/api/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    getUserProgress: (userId: string) =>
        fetchAPI<UserProgress>(`/api/users/${userId}/progress`),
};

// ============ Trivia API ============

export interface DailyTrivia {
    id: string;
    title: string;
    description?: string;
    image_url?: string;
    location?: string;
    region?: string;
    featured_date?: string;
    created_at: string;
}

export const triviaAPI = {
    getTodayTrivia: () =>
        fetchAPI<DailyTrivia>('/api/trivia/today'),

    getAllTrivia: (limit = 20, offset = 0) =>
        fetchAPI<DailyTrivia[]>(`/api/trivia?limit=${limit}&offset=${offset}`),

    getTrivia: (triviaId: string) =>
        fetchAPI<DailyTrivia>(`/api/trivia/${triviaId}`),
};

// ============ Levels API ============

export interface Level {
    id: string;
    name: string;
    description?: string;
    order_index: number;
    unlock_requirement: number;
    image_url?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface UserLevelProgress {
    id?: string;
    user_id: string;
    level_id: string;
    status: 'locked' | 'active' | 'completed';
    score: number;
    stars: number;
    completion_percentage: number;
    completed_at?: string;
    level_name?: string;
    level_order?: number;
    created_at: string;
    updated_at: string;
}

export const levelsAPI = {
    getAllLevels: () =>
        fetchAPI<Level[]>('/api/levels'),

    getLevel: (levelId: string) =>
        fetchAPI<Level>(`/api/levels/${levelId}`),

    getUserLevelProgress: (userId: string) =>
        fetchAPI<UserLevelProgress[]>(`/api/levels/user/${userId}/progress`),

    updateLevelProgress: (userId: string, levelId: string, data: Partial<UserLevelProgress>) =>
        fetchAPI<UserLevelProgress>(`/api/levels/user/${userId}/progress/${levelId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
};

// ============ Mistakes API ============

export interface Mistake {
    id: string;
    user_id: string;
    title: string;
    question?: string;
    category: 'physical' | 'human' | 'regional';
    mastery_level: 'low' | 'medium' | 'critical';
    image_url?: string;
    added_at: string;
}

export const mistakesAPI = {
    getMistakes: (params?: {
        userId?: string;
        category?: string;
        masteryLevel?: string;
        limit?: number;
        offset?: number;
    }) => {
        const searchParams = new URLSearchParams();
        if (params?.userId) searchParams.append('user_id', params.userId);
        if (params?.category) searchParams.append('category', params.category);
        if (params?.masteryLevel) searchParams.append('mastery_level', params.masteryLevel);
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.offset) searchParams.append('offset', params.offset.toString());

        return fetchAPI<Mistake[]>(`/api/mistakes?${searchParams.toString()}`);
    },

    getMistake: (mistakeId: string) =>
        fetchAPI<Mistake>(`/api/mistakes/${mistakeId}`),

    createMistake: (data: Omit<Mistake, 'id' | 'added_at'>) =>
        fetchAPI<Mistake>('/api/mistakes', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    updateMistake: (mistakeId: string, data: Partial<Mistake>) =>
        fetchAPI<Mistake>(`/api/mistakes/${mistakeId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    deleteMistake: (mistakeId: string) =>
        fetchAPI<{ message: string }>(`/api/mistakes/${mistakeId}`, {
            method: 'DELETE',
        }),
};

// ============ Geographic Features API ============

export interface GeographicFeature {
    id: string;
    name: string;
    description?: string;
    feature_type?: string;
    latitude?: number;
    longitude?: number;
    region?: string;
    image_url?: string;
    stats?: Record<string, unknown>;
    created_at: string;
}

export const geoFeaturesAPI = {
    getFeatures: (params?: {
        featureType?: string;
        region?: string;
        limit?: number;
        offset?: number;
    }) => {
        const searchParams = new URLSearchParams();
        if (params?.featureType) searchParams.append('feature_type', params.featureType);
        if (params?.region) searchParams.append('region', params.region);
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.offset) searchParams.append('offset', params.offset.toString());

        return fetchAPI<GeographicFeature[]>(`/api/geo-features?${searchParams.toString()}`);
    },

    getFeature: (featureId: string) =>
        fetchAPI<GeographicFeature>(`/api/geo-features/${featureId}`),

    searchFeatures: (query: string, limit = 10) =>
        fetchAPI<GeographicFeature[]>(`/api/geo-features/search/${encodeURIComponent(query)}?limit=${limit}`),
};

// ============ AR Landforms API ============

export interface ARLandform {
    id: string;
    name: string;
    description?: string;
    type: 'basin' | 'peak' | 'valley' | 'cliff';
    image_url?: string;
    elevation?: number;
    created_at: string;
}

export const arLandformsAPI = {
    getLandforms: (landformType?: string) => {
        const params = landformType ? `?landform_type=${landformType}` : '';
        return fetchAPI<ARLandform[]>(`/api/ar-landforms${params}`);
    },

    getLandform: (landformId: string) =>
        fetchAPI<ARLandform>(`/api/ar-landforms/${landformId}`),
};

// ============ Questions API ============

export interface Question {
    id: string;
    level_id: string;
    question: string;
    options: string[];
    correct_answer: number;
    explanation?: string;
    image_url?: string;
    order_index: number;
}

export interface QuizResult {
    question_id: string;
    user_id: string;
    selected_answer: number;
    is_correct: boolean;
}

export const questionsAPI = {
    getQuestionsByLevel: (levelId: string) =>
        fetchAPI<Question[]>(`/api/questions/level/${levelId}`),

    getQuestion: (questionId: string) =>
        fetchAPI<Question>(`/api/questions/${questionId}`),

    submitAnswer: (result: QuizResult) =>
        fetchAPI<{ is_correct: boolean; correct_answer: number; explanation: string }>('/api/questions/submit', {
            method: 'POST',
            body: JSON.stringify(result),
        }),

    getUserResults: (userId: string) =>
        fetchAPI<QuizResult[]>(`/api/questions/user/${userId}/results`),
};

// ============ Community API ============

export interface PostItem {
    id: string;
    user_id: string;
    user_name: string;
    user_avatar: string;
    user_level: string;
    post_type: 'share' | 'checkin' | 'question';
    title: string;
    content: string;
    images?: string[];
    status: string;
    like_count: number;
    comment_count: number;
    favorite_count: number;
    is_top: boolean;
    is_liked: boolean;
    is_favorited: boolean;
    is_accepted?: boolean;
    created_at: string;
}

export interface CommentItem {
    id: string;
    post_id: string;
    user_id: string;
    user_name: string;
    user_avatar: string;
    parent_id?: string;
    content: string;
    images?: string[];
    is_accepted: boolean;
    like_count: number;
    is_liked: boolean;
    created_at: string;
}

export interface PostCreateData {
    post_type: string;
    title: string;
    content: string;
    images?: string[];
}

export const communityAPI = {
    getPosts: (type?: string, page = 1, size = 10) => {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        if (type) params.set('type', type);
        return fetchAPI<PostItem[]>(`/api/posts?${params}`);
    },

    getPost: (id: string) =>
        fetchAPI<PostItem>(`/api/posts/${id}`),

    createPost: (data: PostCreateData) =>
        fetchAPI<PostItem>('/api/posts', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    deletePost: (id: string) =>
        fetchAPI<{ message: string }>(`/api/posts/${id}`, { method: 'DELETE' }),

    getComments: (postId: string, page = 1, size = 20) =>
        fetchAPI<CommentItem[]>(`/api/posts/${postId}/comments?page=${page}&size=${size}`),

    createComment: (postId: string, data: { content: string; parent_id?: string; images?: string[] }) =>
        fetchAPI<CommentItem>(`/api/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    acceptComment: (commentId: string) =>
        fetchAPI<{ message: string }>(`/api/comments/${commentId}/accept`, { method: 'POST' }),

    toggleLike: (targetId: string, targetType: string) =>
        fetchAPI<{ liked: boolean }>('/api/likes', {
            method: 'POST',
            body: JSON.stringify({ target_id: targetId, target_type: targetType }),
        }),

    toggleFavorite: (postId: string) =>
        fetchAPI<{ favorited: boolean }>('/api/favorites', {
            method: 'POST',
            body: JSON.stringify({ postId }),
        }),

    getFavorites: (page = 1, size = 10) =>
        fetchAPI<PostItem[]>(`/api/favorites?page=${page}&size=${size}`),
};

// Export all APIs
export const api = {
    auth: authAPI,
    user: userAPI,
    trivia: triviaAPI,
    levels: levelsAPI,
    mistakes: mistakesAPI,
    geoFeatures: geoFeaturesAPI,
    arLandforms: arLandformsAPI,
    questions: questionsAPI,
    community: communityAPI,
};

export default api;
