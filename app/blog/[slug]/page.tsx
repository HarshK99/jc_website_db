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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Content Container */}
          <div className="px-12 py-16">
            {/* Header with minimal padding */}
            <header className="mb-12">
              <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">{post.title}</h1>
              
              {post.excerpt && (
                <p className="text-2xl text-gray-600 leading-relaxed mb-8 font-light">{post.excerpt}</p>
              )}
              
              <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  {post.authorName && (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-xs">
                          {post.authorName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium">By {post.authorName}</span>
                    </div>
                  )}
                  {post.publishedAt && (
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </span>
                  )}
                </div>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </header>

            {/* Featured Image */}
            {post.coverImage && (
              <div className="mb-12">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-96 object-cover rounded-lg shadow-sm" 
                />
              </div>
            )}

            {/* Article Content with generous padding */}
            <div className="prose prose-lg prose-gray max-w-none">
              <div 
                className="text-gray-800 leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}