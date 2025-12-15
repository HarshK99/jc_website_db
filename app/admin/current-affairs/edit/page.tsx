"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CurrentAffairsForm from '../../../../components/CurrentAffairsForm';

function EditCurrentAffairsContent() {
  const [caId, setCaId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    setCaId(id);
  }, [searchParams]);

  if (!caId) {
    return <div>Loading...</div>;
  }

  return <CurrentAffairsForm mode="edit" currentAffairsId={caId} />;
}

export default function EditCurrentAffairsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditCurrentAffairsContent />
    </Suspense>
  );
}
