'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PostForm from '../../../../components/PostForm';

function EditPostContent() {
  const [postId, setPostId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    setPostId(id);
  }, [searchParams]);

  if (!postId) {
    return <div>Loading...</div>;
  }

  return <PostForm mode="edit" postId={postId} />;
}

export default function EditPost() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditPostContent />
    </Suspense>
  );
}