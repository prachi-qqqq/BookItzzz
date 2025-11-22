import './globals.css';
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'BookItzzz - Modern Library Management',
  description: 'Discover, borrow, and enjoy thousands of books'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          {/* Header */}
          <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                  <span className="text-2xl font-bold text-blue-600">📚 BookItzzz</span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                  <Link
                    href="/books"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Browse Books
                  </Link>
                  <Link
                    href="/admin/dashboard"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/auth/signin"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </Link>
                </nav>

                {/* Mobile menu button */}
                <button className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-bold text-lg mb-3">BookItzzz</h3>
                  <p className="text-sm text-gray-600">
                    Your modern digital library platform for discovering and borrowing books.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Quick Links</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/books" className="text-gray-600 hover:text-blue-600">Browse Books</Link></li>
                    <li><Link href="/admin/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Support</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-gray-600 hover:text-blue-600">Help Center</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600">Contact Us</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Legal</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600">Terms of Service</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-600">
                <p>© 2025 BookItzzz. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
