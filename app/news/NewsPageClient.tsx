'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchNews } from '../../lib/api';
import NewsCardHorizontal from '../../components/NewsCardHorizontal';
import RecommendedNews from '../../components/RecommendedNews';
import LatestNews from '../../components/LatestNews';
import { Post } from '../../lib/types';

export default function NewsPageClient() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [allNews, setAllNews] = useState<Post[]>([]);
  const [recommendedNews, setRecommendedNews] = useState<Post[]>([]);
  const [latestNews, setLatestNews] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter news based on search query
  const filteredNews = allNews.filter(news =>
    searchQuery === '' ||
    news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    const loadNews = async () => {
      try {
        // Fetch all news
        const allData = await fetchNews();
        setAllNews(allData);

        // Get recommended news (first 3)
        setRecommendedNews(allData.slice(0, 3));

        // Get latest news (most recent 6)
        setLatestNews(allData.slice(0, 6));
      } catch (err) {
        setError('Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Latest News
            </h1>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest News'}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {searchQuery
              ? `Found ${filteredNews.length} news article${filteredNews.length !== 1 ? 's' : ''} matching your search.`
              : 'Stay updated with the latest news and announcements from JNC Group'
            }
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-12">
          {/* Left Side - All News (70%) */}
          <div className="lg:col-span-7">
            {filteredNews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchQuery ? 'No news articles found matching your search.' : 'No news articles available.'}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredNews.map((news) => (
                  <NewsCardHorizontal key={news.id} post={news} />
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Sidebar (30%) */}
          <div className="lg:col-span-3 space-y-8">
            <RecommendedNews news={recommendedNews} />
            <LatestNews news={latestNews} />
          </div>
        </div>
      </div>
    </div>
  );
}