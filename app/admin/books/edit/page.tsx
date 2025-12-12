'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BookForm from '../../../../components/BookForm';

function EditBookContent() {
  const [bookId, setBookId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    setBookId(id);
  }, [searchParams]);

  if (!bookId) {
    return <div>Loading...</div>;
  }

  return <BookForm mode="edit" bookId={bookId} />;
}

export default function EditBookPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditBookContent />
    </Suspense>
  );
}