import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow p-6 ${className || ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
}

interface BookCardProps {
  title: string;
  authors: string[];
  coverUrl?: string;
  available: number;
  onClick?: () => void;
}

export function BookCard({ title, authors, coverUrl, available, onClick }: BookCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      {coverUrl ? (
        <img src={coverUrl} alt={title} className="w-full h-48 object-cover rounded-md mb-4" />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
          <span className="text-gray-400">No cover</span>
        </div>
      )}
      <h3 className="font-semibold text-lg mb-1 line-clamp-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-2">{authors.join(', ')}</p>
      <p className="text-xs text-gray-500">{available > 0 ? `${available} available` : 'Out of stock'}</p>
    </Card>
  );
}
