'use client';

import { useState } from 'react';
import PostForm from '../../../../components/PostForm';

export default function EditPost() {
  const [postId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get('id');
    }
    return null;
  });

  if (!postId) {
    return <div>Loading...</div>;
  }

  return <PostForm mode="edit" postId={postId} />;
}