'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  status: string;
  publishedAt: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchPosts();
  }, []);

  const checkAuth = async () => {
    const response = await fetch('http://localhost:8080/jc_backend/admin/check-session.php', {
      credentials: 'include'
    });
    const data = await response.json();
    if (!data.logged_in) {
      router.push('/admin/login');
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('/backend/api/posts.php');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <Link href="/admin/posts/add" className="bg-blue-600 text-white px-4 py-2 rounded">Add New Post</Link>
      <table className="w-full mt-8">
        <thead>
          <tr>
            <th className="text-left">Title</th>
            <th className="text-left">Status</th>
            <th className="text-left">Published</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{post.status}</td>
              <td>{post.publishedAt}</td>
              <td>
                <Link href={`/admin/posts/edit?id=${post.id}`} className="text-blue-600">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}