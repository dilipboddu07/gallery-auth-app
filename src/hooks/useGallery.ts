import { useState, useEffect, useCallback, useMemo } from 'react';
import { PicsumImage, FilterCategory } from '../types';
import { useDebounce } from './useDebounce';

const BASE_URL = 'https://picsum.photos/v2/list';
const LIMIT = 20;

export const useGallery = () => {
  const [images, setImages] = useState<PicsumImage[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('ALL');
  const debouncedSearch = useDebounce(searchQuery, 350);

  const fetchImages = useCallback(async (targetPage: number, reset = false) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}?page=${targetPage}&limit=${LIMIT}`);
      if (!res.ok) throw new Error('Failed to load images from server.');
      const data: PicsumImage[] = await res.json();

      if (data.length < LIMIT) setHasMore(false);
      setImages((prev) => (reset ? data : [...prev, ...data]));
      setPage(targetPage);
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchImages(1, true);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setHasMore(true);
    fetchImages(1, true);
  }, [fetchImages]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchImages(page + 1, false);
    }
  }, [loading, hasMore, page, fetchImages]);

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const matchSearch = img.author.toLowerCase().includes(debouncedSearch.toLowerCase());
      if (!matchSearch) return false;

      const firstChar = img.author.trim().charAt(0).toUpperCase();
      if (filterCategory === 'A-M') return firstChar >= 'A' && firstChar <= 'M';
      if (filterCategory === 'N-Z') return firstChar >= 'N' && firstChar <= 'Z';
      return true;
    });
  }, [images, debouncedSearch, filterCategory]);

  return {
    images: filteredImages,
    loading,
    refreshing,
    error,
    onRefresh,
    loadMore,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    retry: () => fetchImages(1, true),
  };
};