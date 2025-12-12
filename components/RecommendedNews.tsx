import { Post } from '../lib/types';

interface RecommendedNewsProps {
  news: Post[];
}

export default function RecommendedNews({ news }: RecommendedNewsProps) {
  if (news.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
        Recommended News
      </h3>
      <div className="space-y-4">
        {news.map((newsItem) => (
          <article key={newsItem.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
            <h4 className="font-semibold text-gray-900 mb-2">
              <a href={`/news/post?slug=${newsItem.slug}`} className="hover:text-blue-600 transition-colors line-clamp-2">
                {newsItem.title}
              </a>
            </h4>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {newsItem.excerpt}
            </p>
            <div className="flex items-center text-xs text-gray-500">
              <span>{newsItem.authorName}</span>
              <span className="mx-2">•</span>
              <span>
                {new Date(newsItem.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}