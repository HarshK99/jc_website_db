'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchBooks } from '../lib/api';
import { Book } from '../lib/types';
import BookCardCompact from './BookCardCompact';

interface BookSidebarProps {
  currentBookId: number;
  currentBookSlug: string;
}

export default function BookSidebar({ currentBookId, currentBookSlug }: BookSidebarProps) {
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedBooks();
  }, [currentBookId]);

  const fetchRelatedBooks = async () => {
    try {
      const books = await fetchBooks();
      // Filter out current book and take first 4
      const filtered = books
        .filter((book: Book) =>
          book.id !== currentBookId && book.slug !== currentBookSlug
        )
        .slice(0, 4);
      setRelatedBooks(filtered);
    } catch (error) {
      console.error('Failed to fetch related books:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-32 rounded-lg mb-3"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-3 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (relatedBooks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
        More Books
      </h3>

      <div className="space-y-4">
        {relatedBooks.map((book) => (
          <BookCardCompact key={book.id} book={book} />
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <Link
          href="/books"
          className="inline-flex items-center text-primary hover:text-primary-dark font-medium text-sm"
        >
          View all books
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}