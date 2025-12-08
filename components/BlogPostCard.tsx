import { Post } from '../lib/types';

interface BlogPostCardProps {
  post: Post;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
                  {formatDate(post.publishedAt)}
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
  );
}