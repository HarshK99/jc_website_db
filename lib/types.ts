export interface Meta {
  brand: string;
  tagline: string;
}

export interface Author {
  id: number;
  name: string;
  bio: string;
  avatar: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: string;
  publishedAt: string;
  is_recommended: boolean;
  updatedAt: string;
  authorId: number;
  authorName?: string; // From API join
  authorAvatar?: string; // From API join
  tags?: string[];
}

export interface Book {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  ageGroup: string;
  coverImage: string;
  buyLink: string;
  publishedYear: number;
  pages: number;
  is_featured: boolean;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Taxonomy {
  categories: Category[];
  tags: Tag[];
}