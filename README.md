# J & C Group Publishing Website

A modern, responsive website for J & C Group publishing company built with Next.js (frontend) and PHP/MySQL (backend).

## Features

- **Home Page**: Hero section, company information, featured books
- **Books Page**: Dynamic book catalog with API integration
- **Blog**: Industry-standard blog with recommended posts, latest articles, and individual post pages
- **Static Export**: Optimized for shared hosting deployment
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: PHP 8+, MySQL, PDO
- **Deployment**: Hostinger shared hosting (static export)
- **Development**: XAMPP for local backend

## Environment Setup

### Frontend (Next.js)

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.

### Backend (PHP/MySQL)

1. **Install XAMPP** (for local development):
   - Download and install XAMPP from https://www.apachefriends.org/
   - Start Apache and MySQL modules

2. **Setup Database**:
   - Open phpMyAdmin at http://localhost/phpmyadmin
   - Create database: `jc_website_db`
   - Import the schema from `backend/database-schema.sql`

3. **Configure Backend**:
   - Copy `backend/` folder to your XAMPP htdocs directory or configure virtual host
   - For XAMPP, place backend in: `C:\xampp\htdocs\jc_backend`
   - Access backend at: http://localhost:8080 (or your configured port)

4. **Environment URLs**:
   - **Development**: `http://localhost:8080` (configured in `lib/api.ts`)
   - **Production**: `https://slateblue-cheetah-410739.hostingersite.com/backend` (set in `.env.local`)

### Database Configuration

The backend automatically detects the environment:
- **Development**: Uses XAMPP MySQL (localhost, root, no password)
- **Production**: Uses Hostinger MySQL credentials

## API Endpoints

- `GET /api/books.php` - Fetch all published books
- `GET /api/posts.php` - Fetch all published blog posts
- `GET /api/posts.php?limit=5` - Fetch limited number of posts

## Building for Production

1. Build the static export:
```bash
npm run build
npm run export
```

2. Upload the `out/` folder contents to your Hostinger public_html directory

3. Upload the `backend/` folder to your Hostinger account (maintain the same domain structure)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── blog/              # Blog pages
│   ├── books/             # Books page
│   └── page.tsx           # Home page
├── backend/               # PHP backend
│   ├── api/              # API endpoints
│   ├── config/           # Database configuration
│   └── database-schema.sql
├── components/            # React components
├── lib/                   # Utility functions and types
└── public/               # Static assets
```

## Development Notes

- The site uses static export for Hostinger compatibility
- API calls fall back to sample data if backend is unavailable
- Database schema includes sample books and blog posts
- CORS is configured to allow all origins for development
