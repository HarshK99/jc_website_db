// Admin API configuration
export const ADMIN_API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://jncnews.in/backend'
  : 'http://localhost:8080/jc_backend';

export const ADMIN_ENDPOINTS = {
  login: `${ADMIN_API_BASE}/admin/login.php`,
  checkSession: `${ADMIN_API_BASE}/admin/check-session.php`,
  editPost: `${ADMIN_API_BASE}/admin/edit-post.php`,
  editNews: `${ADMIN_API_BASE}/admin/edit-news.php`,
  editBook: `${ADMIN_API_BASE}/admin/edit-book.php`,
  uploadImage: `${ADMIN_API_BASE}/admin/upload-image.php`,
} as const;

export const API_ENDPOINTS = {
  baseUrl: ADMIN_API_BASE,
  books: `${ADMIN_API_BASE}/api/books.php`,
  posts: `${ADMIN_API_BASE}/api/posts.php`,
  news: `${ADMIN_API_BASE}/api/news.php`,
} as const;