'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../../components/Button';

interface Stats {
  totalBooks: number;
  activeBorrows: number;
  overdueCount: number;
  totalUsers: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    activeBorrows: 0,
    overdueCount: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="primary" onClick={() => window.location.href = '/admin/books/new'}>
          Add New Book
        </Button>
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
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = '/admin/books'}
            >
              Manage Books
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = '/admin/borrows'}
            >
              View All Borrows
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = '/admin/users'}
            >
              Manage Users
            </Button>
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
