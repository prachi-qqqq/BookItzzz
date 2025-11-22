'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '../../../components/Button';

interface Book {
  id: string;
  title: string;
  subtitle?: string;
  authors: string[];
  description?: string;
  isbn?: string;
  publisher?: string;
  publishedAt?: string;
  genres: string[];
  coverUrl?: string;
  copiesTotal: number;
  copiesAvailable: number;
  aggregatedRating?: {
    _avg: { rating: number | null };
    _count: { rating: number };
  };
}

interface Review {
  id: string;
  rating: number;
  content?: string;
  createdAt: string;
  user: {
    name: string;
  };
}

export default function BookDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBook();
      fetchReviews();
    }
  }, [id]);

  async function fetchBook() {
    try {
      const res = await fetch(`/api/books/${id}`);
      if (!res.ok) throw new Error('Book not found');
      const data = await res.json();
      setBook(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchReviews() {
    try {
      const res = await fetch(`/api/books/${id}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleBorrow() {
    setBorrowing(true);
    try {
      // In real app, get userId from session
      const userId = 'temp-user-id'; // Replace with actual session user
      const res = await fetch('/api/borrows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, bookId: id })
      });

      if (res.ok) {
        alert('Book borrowed successfully!');
        fetchBook(); // Refresh availability
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to borrow book');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setBorrowing(false);
    }
  }

  async function handleReserve() {
    try {
      const userId = 'temp-user-id';
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, bookId: id })
      });

      if (res.ok) {
        alert('Book reserved successfully!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to reserve book');
      }
    } catch (err) {
      alert('An error occurred');
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!book) {
    return <div className="text-center py-12">Book not found</div>;
  }

  const avgRating = book.aggregatedRating?._avg.rating || 0;
  const reviewCount = book.aggregatedRating?._count.rating || 0;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cover and Actions */}
        <div>
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg mb-4"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg shadow-lg mb-4 flex items-center justify-center">
              <span className="text-gray-400">No cover</span>
            </div>
          )}

          {book.copiesAvailable > 0 ? (
            <Button
              variant="primary"
              className="w-full mb-2"
              onClick={handleBorrow}
              disabled={borrowing}
            >
              {borrowing ? 'Borrowing...' : 'Borrow This Book'}
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="w-full mb-2"
              onClick={handleReserve}
            >
              Reserve (No Copies Available)
            </Button>
          )}

          <div className="bg-white rounded-lg shadow p-4 mt-4">
            <h3 className="font-semibold mb-2">Availability</h3>
            <p className="text-sm">
              <span className="font-medium">{book.copiesAvailable}</span> of{' '}
              <span className="font-medium">{book.copiesTotal}</span> copies available
            </p>
          </div>
        </div>

        {/* Book Details */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
          {book.subtitle && (
            <h2 className="text-xl text-gray-600 mb-4">{book.subtitle}</h2>
          )}
          
          <p className="text-lg text-gray-700 mb-4">
            by {book.authors.join(', ')}
          </p>

          {/* Rating */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={i < Math.round(avgRating) ? 'text-yellow-500' : 'text-gray-300'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {avgRating.toFixed(1)} ({reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Genres */}
          {book.genres.length > 0 && (
            <div className="flex gap-2 mb-4">
              {book.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Metadata */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            {book.publisher && (
              <p className="text-sm">
                <span className="font-medium">Publisher:</span> {book.publisher}
              </p>
            )}
            {book.publishedAt && (
              <p className="text-sm">
                <span className="font-medium">Published:</span>{' '}
                {new Date(book.publishedAt).toLocaleDateString()}
              </p>
            )}
            {book.isbn && (
              <p className="text-sm">
                <span className="font-medium">ISBN:</span> {book.isbn}
              </p>
            )}
          </div>

          {/* Description */}
          {book.description && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">About This Book</h3>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>
          )}

          {/* Reviews Section */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Reviews</h3>
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm font-medium">{review.user.name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.content && (
                      <p className="text-gray-700">{review.content}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
