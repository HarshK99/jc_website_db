import Link from 'next/link';
import { Post } from '../lib/types';

interface NewsCardHorizontalProps {
  post: Post;
}

export default function NewsCardHorizontal({ post }: NewsCardHorizontalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link href={`/news/post?slug=${post.slug}`} className="block group">
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="md:flex">
          <div className="md:w-1/3">
            <div className="relative h-48 md:h-full">
              {post.coverImage ? (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-2xl">
                    {post.title ? post.title.charAt(0).toUpperCase() : 'N'}
                  </span>
                </div>
              )}
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
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-blue-600 group-hover:text-blue-700 font-medium">
                Read More →
              </span>
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
    </Link>
  );
}