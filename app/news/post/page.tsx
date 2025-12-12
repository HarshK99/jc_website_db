import { Suspense } from 'react';
import NewsPostClient from './NewsPostClient';

export default function NewsPost() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl text-gray-600">Loading...</div>
    </div>}>
      <NewsPostClient />
    </Suspense>
  );
}