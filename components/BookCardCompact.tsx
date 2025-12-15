import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Book } from '../lib/types';

interface BookCardCompactProps {
  book: Book;
}

export default function BookCardCompact({ book }: BookCardCompactProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={`/books/post?slug=${book.slug}`}
      className="block group"
    >
      <article className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="h-24 overflow-hidden relative">
          {!imageError ? (
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <span className="text-green-600 font-bold text-xl">
                {book.title ? book.title.charAt(0).toUpperCase() : 'B'}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2 text-sm leading-tight">
            {book.title.length > 60 ? book.title.substring(0, 60) + '...' : book.title}
          </h4>

          {book.shortDescription && (
            <p className="text-sm text-gray-600 mb-2 text-xs leading-tight">
              {book.shortDescription.length > 80 ? book.shortDescription.substring(0, 80) + '...' : book.shortDescription}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            {book.author && <span>{book.author}</span>}
            {book.publishedYear && (
              <span>
                {book.publishedYear}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}