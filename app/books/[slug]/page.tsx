import { Suspense } from 'react';
import BookDetailClient from './BookDetailClient';
import sampleData from '../../../data/sample-data-arc.json';

export async function generateStaticParams() {
  const books = (sampleData as any).books || [];
  return books.map((b: any) => ({ slug: b.slug }));
}

export default function BookDetail() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl text-gray-600">Loading...</div>
    </div>}>
      <BookDetailClient />
    </Suspense>
  );
}