'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import NewsForm from '../../../../components/NewsForm';

function EditNewsContent() {
  const [newsId, setNewsId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    setNewsId(id);
  }, [searchParams]);

  if (!newsId) {
    return <div>Loading...</div>;
  }

  return <NewsForm mode="edit" newsId={newsId} />;
}

export default function EditNews() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditNewsContent />
    </Suspense>
  );
}