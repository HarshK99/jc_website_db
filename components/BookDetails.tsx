import Image from 'next/image';
import { useState } from 'react';
import { Book } from '../lib/types';

interface BookDetailsProps {
  book: Book;
}

export default function BookDetails({ book }: BookDetailsProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Content Container */}
      <div className="px-8 lg:px-16 py-12">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {book.title}
          </h1>

          {book.shortDescription && (
            <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light">
              {book.shortDescription}
            </p>
          )}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6 space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
              {book.author && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-xs">
                      {book.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">By {book.author}</span>
                </div>
              )}
              {book.publishedYear && (
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{book.publishedYear}</span>
                </span>
              )}
              {book.category && (
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>{book.category}</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {book.ageGroup && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {book.ageGroup}
                </span>
              )}
              {book.is_featured > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  Featured
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Book Cover and Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="relative aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden shadow-lg">
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
                      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">Image not available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Book Details Card */}
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Details</h3>
                <div className="space-y-3">
                  {book.pages && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pages:</span>
                      <span className="font-medium">{book.pages}</span>
                    </div>
                  )}
                  {book.isbn && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">ISBN:</span>
                      <span className="font-medium font-mono text-sm">{book.isbn}</span>
                    </div>
                  )}
                  {book.price && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium text-lg text-green-600">₹{book.price}</span>
                    </div>
                  )}
                </div>

                {/* Buy Button */}
                {book.buyLink && (
                  <a
                    href={book.buyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium text-center block"
                  >
                    Buy Now
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Book Description */}
          <div className="lg:col-span-2">
            {book.description && (
              <div className="prose prose-lg prose-gray max-w-none">
                <div
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: book.description }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}