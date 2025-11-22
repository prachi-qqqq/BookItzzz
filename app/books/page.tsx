'use client';

import { useState } from 'react';
import { useBooks } from '../../lib/hooks/useBooks';
import { BookCard } from '../../components/Card';
import { Input } from '../../components/Form';

export default function BooksPage() {
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [page, setPage] = useState(1);
  
  const { books, loading, meta } = useBooks({ 
    page, 
    limit: 12, 
    q: search || undefined,
    genre: selectedGenre || undefined 
  });

  const genres = ['Fiction', 'Nonfiction', 'Sci-Fi', 'Fantasy', 'History', 'Biography'];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Browse Books</h1>
      
      {/* Search Bar */}
      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search books by title, author, or ISBN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-lg"
        />
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-4 sticky top-24">
            <h3 className="font-semibold mb-4">Filters</h3>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Genre</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="genre"
                    checked={selectedGenre === ''}
                    onChange={() => setSelectedGenre('')}
                    className="mr-2"
                  />
                  <span className="text-sm">All Genres</span>
                </label>
                {genres.map((genre) => (
                  <label key={genre} className="flex items-center">
                    <input
                      type="radio"
                      name="genre"
                      checked={selectedGenre === genre}
                      onChange={() => setSelectedGenre(genre)}
                      className="mr-2"
                    />
                    <span className="text-sm">{genre}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Books Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No books found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {books.map((book) => (
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

              {/* Pagination */}
              <div className="mt-8 flex justify-center items-center gap-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page {page} of {Math.ceil(meta.total / meta.limit)}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * meta.limit >= meta.total}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
