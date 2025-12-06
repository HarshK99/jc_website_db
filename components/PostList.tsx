import { Post } from '../lib/types';
import PostCard from './PostCard';

interface PostListProps {
  posts: Post[];
  featured?: boolean;
}

export default function PostList({ posts, featured = false }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No blog posts available at the moment.</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-8 ${featured ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} featured={featured} />
      ))}
    </div>
  );
}