// Frontend API client helpers

const API_BASE = '/api';

export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// Books
export const booksAPI = {
  list: (params?: { page?: number; limit?: number; q?: string; genre?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchAPI<{ data: any[]; meta: any }>(`/books?${query}`);
  },
  get: (id: string) => fetchAPI<any>(`/books/${id}`),
  create: (data: any) => fetchAPI<any>(`/books`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    fetchAPI<any>(`/books/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<any>(`/books/${id}`, { method: 'DELETE' })
};

// Borrows
export const borrowsAPI = {
  list: () => fetchAPI<{ data: any[] }>(`/borrows`),
  create: (userId: string, bookId: string) =>
    fetchAPI<any>(`/borrows`, { method: 'POST', body: JSON.stringify({ userId, bookId }) }),
  return: (id: string) => fetchAPI<any>(`/borrows/${id}/return`, { method: 'POST' })
};

// Reservations
export const reservationsAPI = {
  create: (userId: string, bookId: string) =>
    fetchAPI<any>(`/reservations`, { method: 'POST', body: JSON.stringify({ userId, bookId }) })
};

// Reviews
export const reviewsAPI = {
  list: (bookId: string) => fetchAPI<{ data: any[] }>(`/books/${bookId}/reviews`),
  create: (bookId: string, userId: string, rating: number, content: string) =>
    fetchAPI<any>(`/books/${bookId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ userId, rating, content })
    })
};

// Admin
export const adminAPI = {
  stats: () => fetchAPI<any>(`/admin/stats`)
};

// ImageKit upload token
export const uploadAPI = {
  getToken: (fileName: string) =>
    fetchAPI<any>(`/uploads/imagekit`, { method: 'POST', body: JSON.stringify({ fileName }) })
};
