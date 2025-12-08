'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PostForm from '../../../../components/PostForm';

export default function EditPost() {
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