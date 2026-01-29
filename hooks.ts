/**
 * React Hooks for GeoExplorer API
 * 用于简化 React 组件中的 API 调用
 */

import { useState, useEffect, useCallback } from 'react';
import api, {
    User,
    UserProgress,
    DailyTrivia,
    Level,
    UserLevelProgress,
    Mistake,
    GeographicFeature,
    ARLandform,
} from './api';

// Default user ID for demo (matches sample data)
export const DEFAULT_USER_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

/**
 * Generic hook for fetching data with loading and error states
 */
function useAsyncData<T>(
    fetchFn: () => Promise<T>,
    dependencies: unknown[] = []
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchFn();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setLoading(false);
        }
    }, dependencies);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { data, loading, error, refetch };
}

/**
 * Hook for fetching user data
 */
export function useUser(userId: string = DEFAULT_USER_ID) {
    return useAsyncData<User>(() => api.user.getUser(userId), [userId]);
}

/**
 * Hook for fetching user progress
 */
export function useUserProgress(userId: string = DEFAULT_USER_ID) {
    return useAsyncData<UserProgress>(
        () => api.user.getUserProgress(userId),
        [userId]
    );
}

/**
 * Hook for fetching today's trivia
 */
export function useTodayTrivia() {
    return useAsyncData<DailyTrivia>(() => api.trivia.getTodayTrivia(), []);
}

/**
 * Hook for fetching all trivia
 */
export function useAllTrivia(limit = 20, offset = 0) {
    return useAsyncData<DailyTrivia[]>(
        () => api.trivia.getAllTrivia(limit, offset),
        [limit, offset]
    );
}

/**
 * Hook for fetching all levels
 */
export function useLevels() {
    return useAsyncData<Level[]>(() => api.levels.getAllLevels(), []);
}

/**
 * Hook for fetching user level progress
 */
export function useUserLevelProgress(userId: string = DEFAULT_USER_ID) {
    return useAsyncData<UserLevelProgress[]>(
        () => api.levels.getUserLevelProgress(userId),
        [userId]
    );
}

/**
 * Hook for fetching mistakes with filters
 */
export function useMistakes(params?: {
    userId?: string;
    category?: string;
    masteryLevel?: string;
}) {
    return useAsyncData<Mistake[]>(
        () =>
            api.mistakes.getMistakes({
                userId: params?.userId || DEFAULT_USER_ID,
                category: params?.category,
                masteryLevel: params?.masteryLevel,
            }),
        [params?.userId, params?.category, params?.masteryLevel]
    );
}

/**
 * Hook for fetching geographic features
 */
export function useGeoFeatures(params?: {
    featureType?: string;
    region?: string;
}) {
    return useAsyncData<GeographicFeature[]>(
        () => api.geoFeatures.getFeatures(params),
        [params?.featureType, params?.region]
    );
}

/**
 * Hook for fetching AR landforms
 */
export function useARLandforms(landformType?: string) {
    return useAsyncData<ARLandform[]>(
        () => api.arLandforms.getLandforms(landformType),
        [landformType]
    );
}

/**
 * Hook for managing mistakes (CRUD operations)
 */
export function useMistakeActions() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const deleteMistake = useCallback(async (mistakeId: string) => {
        setLoading(true);
        setError(null);
        try {
            await api.mistakes.deleteMistake(mistakeId);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete'));
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateMastery = useCallback(
        async (mistakeId: string, masteryLevel: 'low' | 'medium' | 'critical') => {
            setLoading(true);
            setError(null);
            try {
                await api.mistakes.updateMistake(mistakeId, { mastery_level: masteryLevel });
                return true;
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to update'));
                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return { deleteMistake, updateMastery, loading, error };
}

/**
 * Hook for updating level progress
 */
export function useLevelProgressActions(userId: string = DEFAULT_USER_ID) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateProgress = useCallback(
        async (levelId: string, data: Partial<UserLevelProgress>) => {
            setLoading(true);
            setError(null);
            try {
                const result = await api.levels.updateLevelProgress(userId, levelId, data);
                return result;
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to update'));
                return null;
            } finally {
                setLoading(false);
            }
        },
        [userId]
    );

    const completeLevel = useCallback(
        async (levelId: string, score: number, stars: number) => {
            return updateProgress(levelId, {
                status: 'completed',
                score,
                stars,
                completion_percentage: 100,
            });
        },
        [updateProgress]
    );

    const startLevel = useCallback(
        async (levelId: string) => {
            return updateProgress(levelId, { status: 'active' });
        },
        [updateProgress]
    );

    return { updateProgress, completeLevel, startLevel, loading, error };
}
