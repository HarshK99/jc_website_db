import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Book } from '../lib/types';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-64 bg-gray-200">
        {!imageError ? (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Image not available</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {book.title}
        </h3>
        <p className="text-gray-600 mb-4">
          {book.shortDescription}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>{book.ageGroup}</span>
          <span>{book.publishedYear}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{book.pages} pages</span>
          <Link
            href={book.buyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}