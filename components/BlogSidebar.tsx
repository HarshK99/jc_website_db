'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  publishedAt: string;
  authorName?: string;
}

interface BlogSidebarProps {
  currentPostId?: number;
  currentPostSlug?: string;
}

export default function BlogSidebar({ currentPostId, currentPostSlug }: BlogSidebarProps) {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedPosts();
  }, [currentPostId]);

  const fetchRelatedPosts = async () => {
    try {
      const response = await fetch('http://localhost:8080/jc_backend/api/posts?limit=5');
      if (response.ok) {
        const posts = await response.json();
        // Filter out current post and take first 4
        const filtered = posts
          .filter((post: Post) =>
            post.id !== currentPostId && post.slug !== currentPostSlug
          )
          .slice(0, 4);
        setRelatedPosts(filtered);
      }
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
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="block group"
          >
            <article className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
              {post.coverImage && (
                <div className="h-24 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}

              <div className="p-4">
                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2 text-sm leading-tight">
                  {post.title.length > 60 ? post.title.substring(0, 60) + '...' : post.title}
                </h4>

                {post.excerpt && (
                  <p className="text-sm text-gray-600 mb-2 text-xs leading-tight">
                    {post.excerpt.length > 80 ? post.excerpt.substring(0, 80) + '...' : post.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  {post.authorName && <span>{post.authorName}</span>}
                  {post.publishedAt && (
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  )}
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
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