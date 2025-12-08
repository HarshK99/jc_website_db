import { Post } from '../lib/types';

interface RecommendedPostsProps {
  posts: Post[];
}

export default function RecommendedPosts({ posts }: RecommendedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
        Recommended for You
      </h3>
      <div className="space-y-4">
        {posts.map((post) => (
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
  );
}