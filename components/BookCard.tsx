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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group w-48 h-80">
      <div className="relative aspect-[2/3] bg-gray-200">
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

        {/* Hover overlay with more info */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 text-white">
          <h3 className="text-xl font-semibold mb-2 text-center">
            {book.title}
          </h3>
          <p className="text-sm mb-4 text-center line-clamp-3">
            {book.shortDescription}
          </p>
          <div className="flex justify-between items-center w-full text-xs mb-2">
            <span>{book.ageGroup}</span>
            <span>{book.publishedYear}</span>
          </div>
          {book.author && (
            <div className="text-xs mb-2">
              By {book.author}
            </div>
          )}
          <div className="text-xs mb-4">
            {(book.pages || book.price) && (
              <>
                {book.pages && `${book.pages} pages`}
                {book.pages && book.price && ' • '}
                {book.price && `₹${book.price}`}
              </>
            )}
          </div>
          {/* <Link
            href={book.buyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          >
            Buy Now
          </Link> */}
        </div>
      </div>

      {/* Title below image */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 text-center line-clamp-2">
          {book.title}
        </h3>
      </div>
    </div>
  );
}