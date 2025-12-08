'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  publishedAt: string;
}

export default function EditPost() {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'draft',
    publishedAt: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');
    setId(postId);
    if (postId) {
      fetchPost(postId);
    }
  }, []);

  const fetchPost = async (postId: string) => {
    try {
      const response = await fetch(`/backend/api/posts.php?id=${postId}`);
      const data = await response.json();
      if (data.length > 0) {
        const post = data[0];
        setForm({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          status: post.status,
          publishedAt: post.publishedAt,
        });
      }
    } catch (err) {
      console.error('Failed to fetch post');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/jc_backend/admin/edit-post.php?id=' + id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(form),
        credentials: 'include'
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        alert('Failed to update post');
      }
    } catch (err) {
      alert('Error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full p-2 border"
        />
        <input
          type="text"
          name="slug"
          value={form.slug}
          onChange={handleChange}
          placeholder="Slug"
          required
          className="w-full p-2 border"
        />
        <textarea
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          placeholder="Excerpt"
          className="w-full p-2 border"
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Content"
          rows={10}
          className="w-full p-2 border"
        />
        <select name="status" value={form.status} onChange={handleChange} className="p-2 border">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <input
          type="datetime-local"
          name="publishedAt"
          value={form.publishedAt}
          onChange={handleChange}
          className="p-2 border"
        />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Updating...' : 'Update Post'}
        </button>
      </form>
    </div>
  );
}