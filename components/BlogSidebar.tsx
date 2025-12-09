'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchPosts } from '../lib/api';
import { Post } from '../lib/types';
import BlogCardCompact from './BlogCardCompact';

interface BlogSidebarProps {
  currentPostId: number;
  currentPostSlug: string;
}

export default function BlogSidebar({ currentPostId, currentPostSlug }: BlogSidebarProps) {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedPosts();
  }, [currentPostId]);

  const fetchRelatedPosts = async () => {
    try {
      const posts = await fetchPosts(5);
      // Filter out current post and take first 4
      const filtered = posts
        .filter((post: Post) =>
          post.id !== currentPostId && post.slug !== currentPostSlug
        )
        .slice(0, 4);
      setRelatedPosts(filtered);
    } catch (error) {
      console.error('Failed to fetch related posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-32 rounded-lg mb-3"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-3 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
        More Articles
      </h3>

      <div className="space-y-4">
        {relatedPosts.map((post) => (
          <BlogCardCompact key={post.id} post={post} />
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <Link
          href="/blog"
          className="inline-flex items-center text-primary hover:text-primary-dark font-medium text-sm"
        >
          View all articles
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}