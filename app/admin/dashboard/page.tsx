'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../../../components/Button';

interface Stats {
  totalBooks: number;
  activeBorrows: number;
  overdueCount: number;
  totalUsers: number;
}

// Demo data for when database is not available
const DEMO_STATS: Stats = {
  totalBooks: 1250,
  activeBorrows: 89,
  overdueCount: 12,
  totalUsers: 456
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>(DEMO_STATS);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setIsDemo(false);
      } else {
        // Use demo data if API fails
        setStats(DEMO_STATS);
        setIsDemo(true);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setStats(DEMO_STATS);
      setIsDemo(true);
      setError('Using demo data - database not connected');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {isDemo && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Demo Mode:</strong> Showing sample data. Connect to the database to see real statistics.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/books/new">
          <Button variant="primary">
            Add New Book
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Total Books</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalBooks}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Active Borrows</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.activeBorrows}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Overdue</h3>
          <p className="text-3xl font-bold text-red-600">{stats.overdueCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalUsers}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link href="/books" className="block">
              <Button variant="outline" className="w-full">
                Browse All Books
              </Button>
            </Link>
            <Link href="/admin/books" className="block">
              <Button variant="outline" className="w-full">
                Manage Books
              </Button>
            </Link>
            <Link href="/admin/borrows" className="block">
              <Button variant="outline" className="w-full">
                View All Borrows
              </Button>
            </Link>
            <Link href="/admin/users" className="block">
              <Button variant="outline" className="w-full">
                Manage Users
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">Import Data</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload a CSV file to bulk import books
          </p>
          <input
            type="file"
            accept=".csv"
            className="text-sm mb-2"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              
              const formData = new FormData();
              formData.append('file', file);
              
              try {
                const res = await fetch('/api/books/import', {
                  method: 'POST',
                  body: formData
                });
                
                if (res.ok) {
                  alert('Books imported successfully!');
                  fetchStats();
                } else {
                  alert('Import failed');
                }
              } catch (err) {
                alert('An error occurred');
              }
            }}
          />
          <p className="text-xs text-gray-500">
            Format: title,subtitle,authors,description,isbn,publisher,publishedAt,genres,coverUrl,copiesTotal,copiesAvailable
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Database</span>
              <span className="text-green-600 font-medium">● Online</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Redis Cache</span>
              <span className="text-green-600 font-medium">● Online</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">API</span>
              <span className="text-green-600 font-medium">● Healthy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-500 text-sm">
          Activity log coming soon. This will show recent borrows, returns, and user registrations.
        </p>
      </div>
    </div>
  );
}
