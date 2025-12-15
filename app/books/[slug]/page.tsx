import { Suspense } from 'react';
import BookDetailClient from './BookDetailClient';

export default function BookDetail() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl text-gray-600">Loading...</div>
    </div>}>
      <BookDetailClient />
    </Suspense>
  );
}