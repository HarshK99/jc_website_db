import { Book, Post, CurrentAffairs } from './types';

// Determine API base URL based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDevelopment
  ? 'http://localhost:8080/jc_backend'
  : (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080');

export async function fetchBooks(searchParams?: URLSearchParams): Promise<Book[]> {
  try {
    const url = new URL(`${API_BASE_URL}/api/books.php`);
    if (searchParams) {
      // Copy all search params to the URL
      for (const [key, value] of searchParams) {
        url.searchParams.set(key, value);
      }
    }
    console.log('Attempting to fetch from:', url.toString());
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    const data = await response.json();
    console.log('Fetched books from API:', data);
    return data;
  } catch (error) {
    console.error('Error fetching books:', error);
    // Return empty array instead of sample data
    return [];
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
    // Return empty array instead of sample data
    return [];
  }
}

export async function fetchRecommendedPosts(): Promise<Post[]> {
  try {
    console.log('Attempting to fetch recommended posts from:', `${API_BASE_URL}/api/posts.php?recommended=1`);
    const response = await fetch(`${API_BASE_URL}/api/posts.php?recommended=1`);
    if (!response.ok) {
      throw new Error('Failed to fetch recommended posts');
    }
    const data = await response.json();
    console.log('Fetched recommended posts from API:', data);
    return data;
  } catch (error) {
    console.error('Error fetching recommended posts:', error);
    // Return empty array instead of sample data
    return [];
  }
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  try {
    const url = new URL(`${API_BASE_URL}/api/posts.php`);
    url.searchParams.set('slug', slug);
    console.log('Attempting to fetch post from:', url.toString());
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }
    const data = await response.json();
    console.log('Fetched post from API:', data);
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching post:', error);
    // Return null instead of sample data
    return null;
  }
}

export async function fetchNews(limit?: number): Promise<Post[]> {
  try {
    const url = new URL(`${API_BASE_URL}/api/news.php`);
    if (limit) {
      url.searchParams.set('limit', limit.toString());
    }
    console.log('Attempting to fetch news from:', url.toString());
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    const data = await response.json();
    console.log('Fetched news from API:', data);
    return data;
  } catch (error) {
    console.error('Error fetching news:', error);
    // Return empty array instead of sample data
    return [];
  }
}

export async function fetchRecommendedNews(): Promise<Post[]> {
  try {
    console.log('Attempting to fetch recommended news from:', `${API_BASE_URL}/api/news.php?recommended=1`);
    const response = await fetch(`${API_BASE_URL}/api/news.php?recommended=1`);
    if (!response.ok) {
      throw new Error('Failed to fetch recommended news');
    }
    const data = await response.json();
    console.log('Fetched recommended news from API:', data);
    return data;
  } catch (error) {
    console.error('Error fetching recommended news:', error);
    // Return empty array instead of sample data
    return [];
  }
}

export async function fetchNewsBySlug(slug: string): Promise<Post | null> {
  try {
    const url = new URL(`${API_BASE_URL}/api/news.php`);
    url.searchParams.set('slug', slug);
    console.log('Attempting to fetch news from:', url.toString());
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    const data = await response.json();
    console.log('Fetched news from API:', data);
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching news:', error);
    // Return null instead of sample data
    return null;
  }
}

export async function fetchFeaturedBooks(): Promise<Book[]> {
  try {
    console.log('Attempting to fetch featured books from:', `${API_BASE_URL}/api/books.php?featured=1`);
    const response = await fetch(`${API_BASE_URL}/api/books.php?featured=1`);
    if (!response.ok) {
      throw new Error('Failed to fetch featured books');
    }
    const data = await response.json();
    console.log('Fetched featured books from API:', data);
    return data;
  } catch (error) {
    console.error('Error fetching featured books:', error);
    // Return empty array instead of sample data
    return [];
  }
}

export async function fetchCurrentAffairs(limit?: number): Promise<CurrentAffairs[]> {
  try {
    const url = new URL(`${API_BASE_URL}/api/current-affairs.php`);
    if (limit) {
      url.searchParams.set('limit', limit.toString());
    }
    console.log('Attempting to fetch current affairs from:', url.toString());
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Failed to fetch current affairs');
    }
    const data = await response.json();
    console.log('Fetched current affairs from API:', data);
    return data;
  } catch (error) {
    console.error('Error fetching current affairs:', error);
    // Return empty array instead of sample data
    return [];
  }
}

export async function fetchCurrentAffairsBySlug(slug: string): Promise<CurrentAffairs | null> {
  try {
    const url = new URL(`${API_BASE_URL}/api/current-affairs.php`);
    url.searchParams.set('slug', slug);
    console.log('Attempting to fetch current affairs from:', url.toString());
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Failed to fetch current affairs');
    }
    const data = await response.json();
    console.log('Fetched current affairs from API:', data);
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching current affairs:', error);
    // Return null instead of sample data
    return null;
  }
}