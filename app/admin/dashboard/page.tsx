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

interface Book {
  id: number;
  title: string;
  slug: string;
  publishedYear: number;
  is_featured: boolean;
}

interface News {
  id: number;
  title: string;
  slug: string;
  status: string;
  publishedAt: string;
}

interface CurrentAffairs {
  id: number;
  title: string;
  slug: string;
  status: string;
  publishedAt: string;
  is_featured: number;
}

interface Poem {
  id: number;
  title: string;
  author: string;
  status: string;
  publishedAt: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [currentAffairs, setCurrentAffairs] = useState<CurrentAffairs[]>([]);
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
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

  const fetchData = async () => {
    try {
      // Fetch posts
      const postsResponse = await fetch(API_ENDPOINTS.posts);
      const postsData = await postsResponse.json();
      if (Array.isArray(postsData)) {
        setPosts(postsData);
      } else {
        setPosts([]);
      }

      // Fetch books
      const booksResponse = await fetch(API_ENDPOINTS.books);
      const booksData = await booksResponse.json();
      if (Array.isArray(booksData)) {
        setBooks(booksData);
      } else {
        setBooks([]);
      }

      // Fetch news
      const newsResponse = await fetch(API_ENDPOINTS.news);
      const newsData = await newsResponse.json();
      if (Array.isArray(newsData)) {
        setNews(newsData);
      } else {
        setNews([]);
      }

      // Fetch current affairs
      const currentAffairsResponse = await fetch(API_ENDPOINTS.currentAffairs);
      const currentAffairsData = await currentAffairsResponse.json();
      if (Array.isArray(currentAffairsData)) {
        setCurrentAffairs(currentAffairsData);
      } else {
        setCurrentAffairs([]);
      }

      // Fetch poems
      const poemsResponse = await fetch(API_ENDPOINTS.poems);
      const poemsData = await poemsResponse.json();
      if (Array.isArray(poemsData)) {
        setPoems(poemsData);
      } else {
        setPoems([]);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setPosts([]);
      setBooks([]);
      setNews([]);
      setCurrentAffairs([]);
      setPoems([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Posts Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Posts</h2>
          <Link href="/admin/posts/add" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add New Post</Link>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(posts) && posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.publishedAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/posts/edit?id=${post.id}`} className="text-blue-600 hover:text-blue-900">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* News Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Articles</h2>
          <Link href="/admin/news/add" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Add New Articles</Link>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(news) && news.map((newsItem) => (
                <tr key={newsItem.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{newsItem.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      newsItem.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {newsItem.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{newsItem.publishedAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/news/edit?id=${newsItem.id}`} className="text-blue-600 hover:text-blue-900">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Current Affairs Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Update Current Affairs</h2>
          <Link href="/admin/current-affairs/add" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">Add Update Current Affairs</Link>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(currentAffairs) && currentAffairs.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.is_featured > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.is_featured > 0 ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.publishedAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/current-affairs/edit?id=${item.id}`} className="text-blue-600 hover:text-blue-900">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Poems Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Poems</h2>
          <Link href="/admin/poems/add" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">Add New Poem</Link>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(poems) && poems.map((poem) => (
                <tr key={poem.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{poem.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{poem.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      poem.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {poem.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{poem.publishedAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/poems/edit?id=${poem.id}`} className="text-blue-600 hover:text-blue-900">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Books Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Books</h2>
          <Link href="/admin/books/add" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add New Book</Link>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(books) && books.map((book) => (
                <tr key={book.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{book.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.publishedYear}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      book.is_featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {book.is_featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/books/edit?id=${book.id}`} className="text-blue-600 hover:text-blue-900">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}