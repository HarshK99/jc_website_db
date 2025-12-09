import Link from 'next/link';
import { Post } from '../lib/types';

interface BlogCardCompactProps {
  post: Post;
}

export default function BlogCardCompact({ post }: BlogCardCompactProps) {
  return (
    <Link
      href={`/blog/post?slug=${post.slug}`}
      className="block group"
    >
      <article className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="h-24 overflow-hidden">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">
                {post.title ? post.title.charAt(0).toUpperCase() : 'B'}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2 text-sm leading-tight">
            {post.title.length > 60 ? post.title.substring(0, 60) + '...' : post.title}
          </h4>

          {post.excerpt && (
            <p className="text-sm text-gray-600 mb-2 text-xs leading-tight">
              {post.excerpt.length > 80 ? post.excerpt.substring(0, 80) + '...' : post.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            {post.authorName && <span>{post.authorName}</span>}
            {post.publishedAt && (
              <span>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}