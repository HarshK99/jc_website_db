import { Book } from './types';
import sampleData from '../data/sample-data.json';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'; // Adjust for production

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