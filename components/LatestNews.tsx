import { Post } from '../lib/types';

interface LatestNewsProps {
  news: Post[];
  maxNews?: number;
}

export default function LatestNews({ news, maxNews = 5 }: LatestNewsProps) {
  const displayNews = news.slice(0, maxNews);

  if (displayNews.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
        Latest News
      </h3>
      <div className="space-y-4">
        {displayNews.map((newsItem) => (
          <article key={newsItem.id} className="flex space-x-3">
            <div className="flex-shrink-0">
              {newsItem.coverImage ? (
                <img
                  src={newsItem.coverImage}
                  alt={newsItem.title}
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">
                    {newsItem.title ? newsItem.title.charAt(0).toUpperCase() : 'N'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 mb-1">
                <a href={`/news/post?slug=${newsItem.slug}`} className="hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                  {newsItem.title}
                </a>
              </h4>
              <p className="text-xs text-gray-500">
                {new Date(newsItem.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}