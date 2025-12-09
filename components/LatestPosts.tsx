import { Post } from '../lib/types';

interface LatestPostsProps {
  posts: Post[];
  maxPosts?: number;
}

export default function LatestPosts({ posts, maxPosts = 5 }: LatestPostsProps) {
  const displayPosts = posts.slice(0, maxPosts);

  if (displayPosts.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
        Latest Posts
      </h3>
      <div className="space-y-4">
        {displayPosts.map((post) => (
          <article key={post.id} className="flex space-x-3">
            <div className="flex-shrink-0">
              {post.coverImage ? (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">
                    {post.title ? post.title.charAt(0).toUpperCase() : 'B'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 mb-1">
                <a href={`/blog/post?slug=${post.slug}`} className="hover:text-blue-600 transition-colors line-clamp-2 text-sm">
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
  );
}