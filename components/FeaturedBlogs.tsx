'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchRecommendedPosts } from '../lib/api';
import { Post } from '../lib/types';
import PostCard from './PostCard';

export default function FeaturedBlogs() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchRecommendedPosts();
        setPosts(data.slice(0, 3)); // Limit to 3 posts
      } catch (err) {
        setError('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Blogs
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Blogs
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null; // Don't show section if no recommended posts
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Blogs
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Insights and stories from our community of writers and thinkers.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            View All Blogs
          </Link>
        </div>
      </div>
    </section>
  );
}