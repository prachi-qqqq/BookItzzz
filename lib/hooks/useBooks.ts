'use client';

import { useState, useEffect } from 'react';

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  authors: string[];
  description?: string;
  isbn?: string;
  publisher?: string;
  publishedAt?: Date;
  genres: string[];
  coverUrl?: string;
  copiesTotal: number;
  copiesAvailable: number;
  aggregatedRating?: {
    _avg: { rating: number | null };
    _count: { rating: number };
  };
}

export function useBooks(filters?: { page?: number; limit?: number; q?: string; genre?: string }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  async function fetchBooks() {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters as any).toString();
      const res = await fetch(`/api/books?${params}`);
      if (!res.ok) throw new Error('Failed to fetch books');
      const data = await res.json();
      setBooks(data.data);
      setMeta(data.meta);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { books, loading, error, meta, refetch: fetchBooks };
}
