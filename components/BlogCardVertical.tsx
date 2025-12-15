import Image from 'next/image';
import Link from 'next/link';
import { Post } from '../lib/types';

interface BlogCardVerticalProps {
  post: Post;
  featured?: boolean;
}

export default function BlogCardVertical({ post, featured = false }: BlogCardVerticalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link href={`/blog/post?slug=${post.slug}`} className="block group">
      <article className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${featured ? 'md:col-span-2 lg:col-span-2' : ''}`}>
        <div className={`relative ${featured ? 'h-64 md:h-80' : 'h-48'}`}>
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
              <span className="text-primary font-bold text-3xl">
                {post.title ? post.title.charAt(0).toUpperCase() : 'B'}
              </span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
              Article
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {post.authorAvatar && post.authorAvatar.trim() !== '' ? (
                <Image
                  src={post.authorAvatar}
                  alt={post.authorName || 'Author'}
                  width={32}
                  height={32}
                  className="rounded-full mr-3"
                />
              ) : (
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary font-semibold text-xs">
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
          <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}>
            {post.title}
          </h3>
          <p className={`text-gray-600 mb-4 ${featured ? 'text-base' : 'text-sm'}`}>
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-primary group-hover:text-primary-dark font-medium text-sm">
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
      </article>
    </Link>
  );
}