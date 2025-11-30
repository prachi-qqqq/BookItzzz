'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookCard } from '../../components/Card';
import { Input } from '../../components/Form';

interface Book {
  id: string;
  title: string;
  subtitle?: string;
  authors: string[];
  description?: string;
  isbn?: string;
  publisher?: string;
  genres: string[];
  coverUrl?: string;
  copiesTotal: number;
  copiesAvailable: number;
}

// Demo books for when database is not available
const DEMO_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    authors: ['F. Scott Fitzgerald'],
    genres: ['Fiction', 'Classic'],
    description: 'A story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan.',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
    copiesTotal: 5,
    copiesAvailable: 3
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    authors: ['Harper Lee'],
    genres: ['Fiction', 'Classic'],
    description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop',
    copiesTotal: 4,
    copiesAvailable: 2
  },
  {
    id: '3',
    title: 'Dune',
    authors: ['Frank Herbert'],
    genres: ['Sci-Fi', 'Fantasy'],
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides.',
    coverUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop',
    copiesTotal: 6,
    copiesAvailable: 4
  },
  {
    id: '4',
    title: 'Pride and Prejudice',
    authors: ['Jane Austen'],
    genres: ['Fiction', 'Romance'],
    description: 'A romantic novel following the character development of Elizabeth Bennet.',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
    copiesTotal: 3,
    copiesAvailable: 1
  },
  {
    id: '5',
    title: 'The Hobbit',
    authors: ['J.R.R. Tolkien'],
    genres: ['Fantasy', 'Adventure'],
    description: 'Bilbo Baggins embarks on an unexpected journey with a group of dwarves.',
    coverUrl: 'https://images.unsplash.com/photo-1518744386442-2d48ac47a7eb?w=300&h=400&fit=crop',
    copiesTotal: 5,
    copiesAvailable: 5
  },
  {
    id: '6',
    title: 'Sapiens: A Brief History of Humankind',
    authors: ['Yuval Noah Harari'],
    genres: ['Nonfiction', 'History'],
    description: 'An exploration of how Homo sapiens came to dominate the world.',
    coverUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=400&fit=crop',
    copiesTotal: 4,
    copiesAvailable: 0
  },
  {
    id: '7',
    title: '1984',
    authors: ['George Orwell'],
    genres: ['Fiction', 'Dystopian'],
    description: 'A dystopian social science fiction novel set in a totalitarian society.',
    coverUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=400&fit=crop',
    copiesTotal: 5,
    copiesAvailable: 2
  },
  {
    id: '8',
    title: 'The Alchemist',
    authors: ['Paulo Coelho'],
    genres: ['Fiction', 'Philosophy'],
    description: 'A philosophical book about a young Andalusian shepherd on his journey.',
    coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=400&fit=crop',
    copiesTotal: 3,
    copiesAvailable: 3
  },
  {
    id: '9',
    title: 'Atomic Habits',
    authors: ['James Clear'],
    genres: ['Nonfiction', 'Self-Help'],
    description: 'An easy and proven way to build good habits and break bad ones.',
    coverUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=300&h=400&fit=crop',
    copiesTotal: 6,
    copiesAvailable: 4
  }
];

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 12 });

  const genres = ['Fiction', 'Nonfiction', 'Sci-Fi', 'Fantasy', 'History', 'Biography', 'Romance', 'Classic'];

  useEffect(() => {
    fetchBooks();
  }, [page, search, selectedGenre]);

  async function fetchBooks() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: '12',
        ...(search && { q: search }),
        ...(selectedGenre && { genre: selectedGenre })
      });
      
      const res = await fetch(`/api/books?${params}`);
      
      if (res.ok) {
        const data = await res.json();
        setBooks(data.data);
        setMeta(data.meta);
        setIsDemo(false);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.error('Failed to fetch books:', err);
      // Use demo data with filtering
      let filteredBooks = DEMO_BOOKS;
      if (search) {
        const q = search.toLowerCase();
        filteredBooks = filteredBooks.filter(b => 
          b.title.toLowerCase().includes(q) || 
          b.authors.some(a => a.toLowerCase().includes(q))
        );
      }
      if (selectedGenre) {
        filteredBooks = filteredBooks.filter(b => b.genres.includes(selectedGenre));
      }
      setBooks(filteredBooks);
      setMeta({ total: filteredBooks.length, page: 1, limit: 12 });
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(meta.total / meta.limit) || 1;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Browse Books</h1>
        <p className="text-gray-600">
          {meta.total} {meta.total === 1 ? 'book' : 'books'} available
        </p>
      </div>

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
                <strong>Demo Mode:</strong> Showing sample books. Connect to the database to see your library.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Search Bar */}
      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search books by title, author, or ISBN..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-lg"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-4 md:sticky md:top-24">
            <h3 className="font-semibold mb-4">Filters</h3>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Genre</h4>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="radio"
                    name="genre"
                    checked={selectedGenre === ''}
                    onChange={() => {
                      setSelectedGenre('');
                      setPage(1);
                    }}
                    className="mr-2 text-blue-600"
                  />
                  <span className="text-sm">All Genres</span>
                </label>
                {genres.map((genre) => (
                  <label key={genre} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="radio"
                      name="genre"
                      checked={selectedGenre === genre}
                      onChange={() => {
                        setSelectedGenre(genre);
                        setPage(1);
                      }}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm">{genre}</span>
                  </label>
                ))}
              </div>
            </div>

            {(search || selectedGenre) && (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedGenre('');
                  setPage(1);
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Books Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-48 mb-4" />
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No books found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {search || selectedGenre 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding some books to the library.'}
              </p>
              {(search || selectedGenre) && (
                <button
                  onClick={() => {
                    setSearch('');
                    setSelectedGenre('');
                  }}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.map((book) => (
                  <Link key={book.id} href={`/books/${book.id}`}>
                    <BookCard
                      title={book.title}
                      authors={book.authors}
                      coverUrl={book.coverUrl}
                      available={book.copiesAvailable}
                    />
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-10 h-10 rounded-lg ${
                            page === pageNum 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="px-2">...</span>
                        <button
                          onClick={() => setPage(totalPages)}
                          className={`w-10 h-10 rounded-lg ${
                            page === totalPages 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
