'use client';

import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { BookCard } from '../components/Card';

interface Book {
  id: string;
  title: string;
  authors: string[];
  coverUrl?: string;
  copiesAvailable: number;
}

export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedBooks();
  }, []);

  async function fetchFeaturedBooks() {
    try {
      const res = await fetch('/api/books?limit=8');
      if (res.ok) {
        const data = await res.json();
        setFeaturedBooks(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch featured books:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-12 mb-12 text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to BookItzzz</h1>
        <p className="text-xl mb-6 text-blue-100">
          Your modern digital library. Discover, borrow, and enjoy thousands of books at your fingertips.
        </p>
        <div className="flex gap-4">
          <Button
            variant="primary"
            className="bg-white text-blue-600 hover:bg-blue-50"
            onClick={() => window.location.href = '/books'}
          >
            Browse Catalog
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-blue-700"
            onClick={() => window.location.href = '/auth/signin'}
          >
            Sign In
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
          <div className="text-gray-600">Books Available</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
          <div className="text-gray-600">Access Anytime</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">Free</div>
          <div className="text-gray-600">Membership</div>
        </div>
      </div>

      {/* Featured Books Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Featured Books</h2>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/books'}
          >
            View All →
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard
                key={book.id}
                title={book.title}
                authors={book.authors}
                coverUrl={book.coverUrl}
                available={book.copiesAvailable}
                onClick={() => window.location.href = `/books/${book.id}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose BookItzzz?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Vast Collection</h3>
            <p className="text-gray-600">
              Access thousands of books across all genres and categories
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Access</h3>
            <p className="text-gray-600">
              Borrow books instantly with just one click
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
            <p className="text-gray-600">
              Find exactly what you're looking for with powerful filters
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="bg-gray-100 rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Reading?</h2>
        <p className="text-lg text-gray-600 mb-6">
          Join thousands of readers and start your literary journey today
        </p>
        <Button
          variant="primary"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => window.location.href = '/books'}
        >
          Explore Our Collection
        </Button>
      </div>
    </div>
  );
}
