"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PoemForm from '../../../../components/PoemForm';

function EditPoemContent() {
  const [poemId, setPoemId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    setPoemId(id);
  }, [searchParams]);

  if (!poemId) {
    return <div>Loading...</div>;
  }

  return <PoemForm mode="edit" poemId={poemId} />;
}

export default function EditPoemPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditPoemContent />
    </Suspense>
  );
}