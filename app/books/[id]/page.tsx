'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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

// Demo book data
const DEMO_BOOKS: Record<string, Book> = {
  '1': {
    id: '1',
    title: 'The Great Gatsby',
    subtitle: 'A Novel',
    authors: ['F. Scott Fitzgerald'],
    genres: ['Fiction', 'Classic'],
    description: 'The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway\'s interactions with mysterious millionaire Jay Gatsby and Gatsby\'s obsession to reunite with his former lover, Daisy Buchanan.',
    isbn: '978-0743273565',
    publisher: 'Scribner',
    publishedAt: '1925-04-10',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
    copiesTotal: 5,
    copiesAvailable: 3,
    aggregatedRating: { _avg: { rating: 4.5 }, _count: { rating: 128 } }
  },
  '2': {
    id: '2',
    title: 'To Kill a Mockingbird',
    authors: ['Harper Lee'],
    genres: ['Fiction', 'Classic'],
    description: 'To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature.',
    isbn: '978-0061120084',
    publisher: 'Harper Perennial Modern Classics',
    publishedAt: '1960-07-11',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop',
    copiesTotal: 4,
    copiesAvailable: 2,
    aggregatedRating: { _avg: { rating: 4.8 }, _count: { rating: 256 } }
  },
  '3': {
    id: '3',
    title: 'Dune',
    subtitle: 'Dune Chronicles, Book 1',
    authors: ['Frank Herbert'],
    genres: ['Sci-Fi', 'Fantasy'],
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange.',
    isbn: '978-0441172719',
    publisher: 'Ace',
    publishedAt: '1965-08-01',
    coverUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop',
    copiesTotal: 6,
    copiesAvailable: 4,
    aggregatedRating: { _avg: { rating: 4.7 }, _count: { rating: 312 } }
  }
};

const DEMO_REVIEWS: Review[] = [
  {
    id: 'r1',
    rating: 5,
    content: 'Absolutely brilliant! One of the best books I\'ve ever read. The prose is beautiful and the story is timeless.',
    createdAt: '2025-10-15T10:30:00Z',
    user: { name: 'Sarah Johnson' }
  },
  {
    id: 'r2',
    rating: 4,
    content: 'Great classic that everyone should read at least once. The characters are memorable and the themes are still relevant today.',
    createdAt: '2025-09-20T14:45:00Z',
    user: { name: 'Michael Chen' }
  },
  {
    id: 'r3',
    rating: 5,
    content: 'A masterpiece of American literature.',
    createdAt: '2025-08-05T09:15:00Z',
    user: { name: 'Emily Rodriguez' }
  }
];

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

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
      setIsDemo(false);
    } catch (err) {
      console.error(err);
      // Use demo data
      const demoBook = DEMO_BOOKS[id] || DEMO_BOOKS['1'];
      if (demoBook) {
        setBook({ ...demoBook, id });
        setIsDemo(true);
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchReviews() {
    try {
      const res = await fetch(`/api/books/${id}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.data || []);
      } else {
        throw new Error('Failed to fetch reviews');
      }
    } catch (err) {
      console.error(err);
      setReviews(DEMO_REVIEWS);
    }
  }

  async function handleBorrow() {
    if (isDemo) {
      alert('Demo mode: Connect to the database to borrow books.');
      return;
    }
    
    setBorrowing(true);
    try {
      const res = await fetch('/api/borrows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: id })
      });

      if (res.ok) {
        alert('Book borrowed successfully!');
        fetchBook();
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
    if (isDemo) {
      alert('Demo mode: Connect to the database to reserve books.');
      return;
    }
    
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: id })
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
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="bg-gray-200 rounded-lg h-96 mb-4"></div>
            <div className="bg-gray-200 rounded-lg h-12 mb-2"></div>
          </div>
          <div className="md:col-span-2">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 className="mt-2 text-lg font-semibold text-gray-900">Book not found</h3>
        <p className="mt-1 text-sm text-gray-500">The book you're looking for doesn't exist.</p>
        <Link href="/books" className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Browse Books
        </Link>
      </div>
    );
  }

  const avgRating = book.aggregatedRating?._avg.rating || 0;
  const reviewCount = book.aggregatedRating?._count.rating || 0;

  return (
    <div>
      {/* Back button */}
      <Link href="/books" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Browse Books
      </Link>

      {isDemo && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Demo Mode:</strong> Showing sample book data. Connect to the database for full functionality.
              </p>
            </div>
          </div>
        </div>
      )}

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
