import { fetchPosts, fetchPostBySlug } from '../../../lib/api';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  try {
    const posts = await fetchPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          {post.excerpt && <p className="text-xl text-gray-600 mb-4">{post.excerpt}</p>}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {post.authorName && <span>By {post.authorName}</span>}
            {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString()}</span>}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4">
              {post.tags.map((tag) => (
                <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm mr-2">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>
        {post.coverImage && (
          <img src={post.coverImage} alt={post.title} className="w-full h-64 object-cover mb-8 rounded-lg" />
        )}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  );
}