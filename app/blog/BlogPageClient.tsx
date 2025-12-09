'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchPosts } from '../../lib/api';
import BlogCardHorizontal from '../../components/BlogCardHorizontal';
import RecommendedPosts from '../../components/RecommendedPosts';
import LatestPosts from '../../components/LatestPosts';
import { Post } from '../../lib/types';

export default function BlogPageClient() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter posts based on search query
  const filteredPosts = allPosts.filter(post =>
    searchQuery === '' ||
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
          <div className="text-center">
            <p className="text-red-600">{error}</p>
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
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Our Blogs'}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {searchQuery
              ? `Found ${filteredPosts.length} blog post${filteredPosts.length !== 1 ? 's' : ''} matching your search.`
              : 'Insights, stories, and expert advice on children\'s literature, reading development, and the magic of storytelling.'
            }
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-12">
          {/* Left Side - All Posts (70%) */}
          <div className="lg:col-span-7">
            <section id="all-posts">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {searchQuery ? 'Search Results' : 'All Blog Posts'}
                </h2>
                <p className="text-gray-600">
                  {searchQuery ? `Showing ${filteredPosts.length} result${filteredPosts.length !== 1 ? 's' : ''} for "${searchQuery}".` : 'Explore our complete collection of articles and insights.'}
                </p>
              </div>
              <div className="space-y-8">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <BlogCardHorizontal key={post.id} post={post} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No blog posts found matching your search.</p>
                    <p className="text-gray-500 mt-2">Try different keywords or browse all posts.</p>
                  </div>
                )}
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}