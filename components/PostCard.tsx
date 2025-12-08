import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Post } from '../lib/types';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const [avatarError, setAvatarError] = useState(false);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${featured ? 'md:col-span-2 lg:col-span-2' : ''}`}>
      <div className={`relative ${featured ? 'h-64 md:h-80' : 'h-48'}`}>
        <Image
          src={post.coverImage || '/uploads/blog/default.jpg'}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Article
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {post.authorAvatar && post.authorAvatar.trim() !== '' && !avatarError ? (
              <Image
                src={post.authorAvatar}
                alt={post.authorName || 'Author'}
                width={32}
                height={32}
                className="rounded-full mr-3"
                onError={() => setAvatarError(true)}
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
              <p className="text-sm text-gray-500">{formatDate(post.publishedAt)}</p>
            </div>
          </div>
        </div>
        <h3 className={`font-bold text-gray-900 mb-3 ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}>
          <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className={`text-gray-600 mb-4 ${featured ? 'text-base' : 'text-sm'}`}>
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <Link
            href={`/blog/${post.slug}`}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Read More →
          </Link>
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
    </article>
  );
}