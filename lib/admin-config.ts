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
  editCurrentAffairs: `${ADMIN_API_BASE}/admin/edit-current-affairs.php`,
  editPoem: `${ADMIN_API_BASE}/admin/edit-poem.php`,
  uploadImage: `${ADMIN_API_BASE}/admin/upload-image.php`,
} as const;

export const API_ENDPOINTS = {
  baseUrl: ADMIN_API_BASE,
  books: `${ADMIN_API_BASE}/api/books.php`,
  posts: `${ADMIN_API_BASE}/api/posts.php`,
  news: `${ADMIN_API_BASE}/api/news.php`,
  currentAffairs: `${ADMIN_API_BASE}/api/current-affairs.php`,
  poems: `${ADMIN_API_BASE}/api/poems.php`,
} as const;