'use client';

import { fetchBook } from '../../../lib/api';
import { useEffect, useState } from 'react';
import { Book } from '../../../lib/types';
import { useParams } from 'next/navigation';
import BookSidebar from '../../../components/BookSidebar';
import BookDetails from '../../../components/BookDetails';

export default function BookDetailClient() {
  const params = useParams();
  const slug = params.slug as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('No slug provided');
      setLoading(false);
      return;
    }

    async function loadBook() {
      try {
        const data = await fetchBook(slug);
        if (data) {
          setBook(data);
        } else {
          setError('Book not found');
        }
      } catch (err) {
        console.error('Error loading book:', err);
        setError('Failed to load book');
      } finally {
        setLoading(false);
      }
    }
    loadBook();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">{error || 'Book not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-4">
            <BookDetails book={book} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookSidebar currentBookId={book.id} currentBookSlug={book.slug} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}