'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchNews } from '../lib/api';
import { Post } from '../lib/types';
import NewsCardCompact from './NewsCardCompact';

interface NewsSidebarProps {
  currentNewsId?: number;
  currentNewsSlug?: string;
}

export default function NewsSidebar({ currentNewsId, currentNewsSlug }: NewsSidebarProps) {
  const [relatedNews, setRelatedNews] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedNews();
  }, [currentNewsId]);

  const fetchRelatedNews = async () => {
    try {
      const news = await fetchNews(5);
      // Filter out current news and take first 4
      const filtered = news
        .filter((newsItem: Post) =>
          newsItem.id !== currentNewsId && newsItem.slug !== currentNewsSlug
        )
        .slice(0, 4);
      setRelatedNews(filtered);
    } catch (error) {
      console.error('Failed to fetch related news:', error);
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

  if (relatedNews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
        More News
      </h3>

      <div className="space-y-4">
        {relatedNews.map((newsItem) => (
          <NewsCardCompact key={newsItem.id} post={newsItem} />
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <Link
          href="/news"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          View all news
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}