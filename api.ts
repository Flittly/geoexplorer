/**
 * GeoExplorer API Client
 * 前端 API 调用封装
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

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
    created_at: string;
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

// Export all APIs
export const api = {
    user: userAPI,
    trivia: triviaAPI,
    levels: levelsAPI,
    mistakes: mistakesAPI,
    geoFeatures: geoFeaturesAPI,
    arLandforms: arLandformsAPI,
};

export default api;
