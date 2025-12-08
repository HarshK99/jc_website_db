'use client';

import { useEffect, useState } from 'react';
import { fetchPosts } from '../../lib/api';
import BlogCardHorizontal from '../../components/BlogCardHorizontal';
import RecommendedPosts from '../../components/RecommendedPosts';
import LatestPosts from '../../components/LatestPosts';
import { Post } from '../../lib/types';

export default function BlogPage() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        // Fetch all posts
        const allData = await fetchPosts();
        setAllPosts(allData);

        // Get recommended posts (first 3)
        setRecommendedPosts(allData.slice(0, 3));

        // Get latest posts (most recent 6)
        setLatestPosts(allData.slice(0, 6));
      } catch (err) {
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Blogs
            </h1>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Blogs
            </h1>
            <p className="text-red-600 mt-4">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Blogs
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Insights, stories, and expert advice on children's literature,
            reading development, and the magic of storytelling.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-12">
          {/* Left Side - All Posts (70%) */}
          <div className="lg:col-span-7">
            <section id="all-posts">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  All Blog Posts
                </h2>
                <p className="text-gray-600">
                  Explore our complete collection of articles and insights.
                </p>
              </div>
              <div className="space-y-8">
                {allPosts.map((post) => (
                  <BlogCardHorizontal key={post.id} post={post} />
                ))}
              </div>
            </section>
          </div>

          {/* Right Side - Sidebar (30%) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Recommended Section */}
            <RecommendedPosts posts={recommendedPosts} />

            {/* Latest Posts Section */}
            <LatestPosts posts={latestPosts} maxPosts={5} />
          </div>
        </div>

        {/* Newsletter Signup */}
        <section className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Stay Updated
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest articles, book recommendations,
            and insights on children's literature.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}