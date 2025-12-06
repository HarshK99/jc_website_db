'use client';

import { useEffect, useState } from 'react';
import { fetchPosts } from '../../lib/api';
import PostList from '../../components/PostList';
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
              Our Blog
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
              Our Blog
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
            Our Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Insights, stories, and expert advice on children's literature,
            reading development, and the magic of storytelling.
          </p>
        </div>

        {/* Recommended Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Recommended for You
            </h2>
            <a href="#all-posts" className="text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </a>
          </div>
          <PostList posts={recommendedPosts} featured={true} />
        </section>

        {/* Latest Posts Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Latest Posts
            </h2>
            <a href="#all-posts" className="text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </a>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.slice(0, 6).map((post, index) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src={post.coverImage || '/uploads/blog/default.jpg'}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Latest
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {post.authorAvatar && (
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{post.authorName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    <a href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </a>
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {post.excerpt}
                  </p>
                  <a
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Read More →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* All Posts Section */}
        <section id="all-posts">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              All Blog Posts
            </h2>
            <p className="text-gray-600">
              Explore our complete collection of articles and insights.
            </p>
          </div>
          <PostList posts={allPosts} />
        </section>

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