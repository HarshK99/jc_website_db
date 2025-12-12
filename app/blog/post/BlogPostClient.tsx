'use client';

import { fetchPostBySlug } from '../../../lib/api';
import { useEffect, useState } from 'react';
import { Post } from '../../../lib/types';
import BlogSidebar from '../../../components/BlogSidebar';
import { useSearchParams } from 'next/navigation';

export default function BlogPostClient() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('No slug provided');
      setLoading(false);
      return;
    }

    async function loadPost() {
      try {
        const data = await fetchPostBySlug(slug!);
        if (data) {
          setPost(data);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.error('Error loading post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">{error || 'Post not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-4">
            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Content Container */}
              <div className="px-16 py-12">
                {/* Header with minimal padding */}
                <header className="mb-8">
                  <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">{post.title}</h1>

                  {post.excerpt && (
                    <p className="text-xl text-gray-400 leading-relaxed mb-8 font-light">{post.excerpt}</p>
                  )}

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6 space-y-4 md:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
                      {post.authorName && (
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-primary font-semibold text-xs">
                              {post.authorName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium">By {post.authorName}</span>
                        </div>
                      )}
                      {post.publishedAt && (
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </span>
                      )}
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary-dark">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </header>

                {/* Featured Image */}
                {post.coverImage && (
                  <div className="mb-12">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-96 object-cover rounded-lg shadow-sm"
                    />
                  </div>
                )}

                {/* Article Content with generous padding */}
                <div className="prose prose-lg prose-gray max-w-none">
                  <div
                    className="text-gray-800 leading-relaxed lg:px-18"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BlogSidebar currentPostId={post.id} currentPostSlug={post.slug} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}