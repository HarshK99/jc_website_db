'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ADMIN_ENDPOINTS, API_ENDPOINTS } from '../../../lib/admin-config';

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
    const response = await fetch(ADMIN_ENDPOINTS.checkSession, {
      credentials: 'include'
    });
    const data = await response.json();
    if (!data.logged_in) {
      router.push('/admin/login');
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.posts);
      const data = await response.json();
      console.log('Posts API response:', data);
      // Ensure data is an array
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error('Posts API did not return an array:', data);
        setPosts([]);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setPosts([]);
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
          {Array.isArray(posts) && posts.map((post) => (
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