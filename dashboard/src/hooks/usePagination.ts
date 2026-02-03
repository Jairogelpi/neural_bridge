import { useState, useEffect, useCallback } from 'react';

/**
 * LAZY LOADING HOOK 📄⚡
 * 
 * Provides pagination for large datasets with:
 * - Infinite scroll support
 * - Manual pagination controls
 * - Loading states
 * - Error handling
 */

export interface UsePaginationOptions<T> {
    fetchPage: (page: number, pageSize: number) => Promise<T[]>;
    pageSize?: number;
    initialPage?: number;
}

export interface UsePaginationReturn<T> {
    data: T[];
    loading: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
    loadMore: () => void;
    reload: () => void;
    reset: () => void;
}

export function usePagination<T>({
    fetchPage,
    pageSize = 50,
    initialPage = 0
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(initialPage);
    const [hasMore, setHasMore] = useState(true);

    const loadPage = useCallback(async (pageNum: number, append: boolean = true) => {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const newData = await fetchPage(pageNum, pageSize);

            setData(prev => append ? [...prev, ...newData] : newData);
            setHasMore(newData.length === pageSize);
            setPage(pageNum);
        } catch (err) {
            setError((err as Error).message);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [fetchPage, pageSize, loading]);

    // Initial load
    useEffect(() => {
        loadPage(initialPage, false);
    }, [loadPage, initialPage]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            loadPage(page + 1, true);
        }
    }, [loadPage, loading, hasMore, page]);

    const reload = useCallback(() => {
        setData([]);
        setPage(initialPage);
        setHasMore(true);
        loadPage(initialPage, false);
    }, [loadPage, initialPage]);

    const reset = useCallback(() => {
        setData([]);
        setPage(initialPage);
        setHasMore(true);
        setError(null);
    }, [initialPage]);

    return {
        data,
        loading,
        error,
        page,
        hasMore,
        loadMore,
        reload,
        reset
    };
}

/**
 * INFINITE SCROLL HOOK 🔄
 * 
 * Auto-loads more data when scrolling to bottom
 */
export function useInfiniteScroll(
    callback: () => void,
    options?: {
        threshold?: number;
        enabled?: boolean;
    }
) {
    const { threshold = 0.9, enabled = true } = options || {};

    useEffect(() => {
        if (!enabled) return;

        const handleScroll = () => {
            const scrolled = window.scrollY + window.innerHeight;
            const total = document.documentElement.scrollHeight;
            const percentage = scrolled / total;

            if (percentage >= threshold) {
                callback();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [callback, threshold, enabled]);
}
