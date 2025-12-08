'use client';

import { useEffect, useState } from 'react';
import { fetchPosts } from '../../lib/api';
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
                  <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <div className="relative h-48 md:h-full">
                          <img
                            src={post.coverImage || '/uploads/blog/default.jpg'}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {post.authorAvatar && post.authorAvatar.trim() !== '' ? (
                              <img
                                src={post.authorAvatar}
                                alt={post.authorName || 'Author'}
                                className="w-8 h-8 rounded-full mr-3"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-blue-600 font-semibold text-xs">
                                  {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'A'}
                                </span>
                              </div>
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
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          <a href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                            {post.title}
                          </a>
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <a
                            href={`/blog/${post.slug}`}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Read More →
                          </a>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {post.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* Right Side - Sidebar (30%) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Recommended Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                Recommended for You
              </h3>
              <div className="space-y-4">
                {recommendedPosts.map((post) => (
                  <article key={post.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      <a href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </a>
                    </h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{post.authorName}</span>
                      <span className="mx-2">•</span>
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Latest Posts Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                Latest Posts
              </h3>
              <div className="space-y-4">
                {latestPosts.slice(0, 5).map((post) => (
                  <article key={post.id} className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <img
                        src={post.coverImage || '/uploads/blog/default.jpg'}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 mb-1">
                        <a href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                          {post.title}
                        </a>
                      </h4>
                      <p className="text-xs text-gray-500">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
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