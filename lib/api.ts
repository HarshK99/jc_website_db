import { Book, Post } from './types';
import sampleData from '../data/sample-data.json';

// Determine API base URL based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDevelopment
  ? 'http://localhost:8080/jc_backend'
  : (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080');

export async function fetchBooks(): Promise<Book[]> {
  try {
    console.log('Attempting to fetch from:', `${API_BASE_URL}/api/books.php`);
    const response = await fetch(`${API_BASE_URL}/api/books.php`);
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    const data = await response.json();
    console.log('Fetched books from API:', data);
    return data;
  } catch (error) {
    console.error('Error fetching books:', error);
    // For development, return sample data from JSON
    console.log('Using sample data from JSON');
    return sampleData.books;
  }
}

export async function fetchPosts(limit?: number): Promise<Post[]> {
  try {
    const url = new URL(`${API_BASE_URL}/api/posts.php`);
    if (limit) {
      url.searchParams.set('limit', limit.toString());
    }
    console.log('Attempting to fetch posts from:', url.toString());
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const data = await response.json();
    console.log('Fetched posts from API:', data);
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    // For development, return sample posts from JSON
    console.log('Using sample posts from JSON');
    return sampleData.posts || [];
  }
}