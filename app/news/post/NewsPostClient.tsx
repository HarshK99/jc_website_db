'use client';

import { fetchNewsBySlug } from '../../../lib/api';
import { useEffect, useState } from 'react';
import { Post } from '../../../lib/types';
import NewsSidebar from '../../../components/NewsSidebar';
import { useSearchParams } from 'next/navigation';

export default function NewsPostClient() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  const [news, setNews] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('No slug provided');
      setLoading(false);
      return;
    }

    async function loadNews() {
      try {
        const data = await fetchNewsBySlug(slug!);
        if (data) {
          setNews(data);
        } else {
          setError('News article not found');
        }
      } catch (err) {
        console.error('Error loading news:', err);
        setError('Failed to load news article');
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">{error || 'News article not found'}</div>
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
                  <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">{news.title}</h1>

                  {news.excerpt && (
                    <p className="text-xl text-gray-400 leading-relaxed mb-8 font-light">{news.excerpt}</p>
                  )}

                  <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      {news.authorName && (
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-primary font-semibold text-xs">
                              {news.authorName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium">By {news.authorName}</span>
                        </div>
                      )}
                      {news.publishedAt && (
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(news.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </span>
                      )}
                    </div>

                    {news.tags && news.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {news.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </header>

                {/* Article Content */}
                <div
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:text-gray-600 prose-blockquote:font-normal prose-blockquote:italic"
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <NewsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}