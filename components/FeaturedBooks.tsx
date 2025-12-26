'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchFeaturedBooks } from '../lib/api';
import { Book } from '../lib/types';
import BookCard from './BookCard';

export default function FeaturedBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchFeaturedBooks();
        setBooks(data);
      } catch (err) {
        setError('Failed to load books');
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Books
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error && books.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Books
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Books
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our collection of carefully crafted stories for young readers.
          </p>
        </div>

        {/* Horizontal scrolling container */}
        <div className="overflow-x-auto hide-scrollbar pb-4" style={{ scrollBehavior: 'smooth' }}>
          <div className={`flex space-x-6 px-4 transition-all duration-300 ${books.length <= 3 ? 'justify-center' : 'w-max'}`}>
            {books.map((book) => (
              <div key={book.id} className="flex-shrink-0 w-64">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>

        {/* View All Books button - only show if there are books */}
        {books.length > 0 && (
          <div className="text-center mt-8">
            <Link
              href="/books"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
            >
              View All Books
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}