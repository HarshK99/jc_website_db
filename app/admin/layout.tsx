'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ADMIN_ENDPOINTS, ADMIN_API_BASE } from '../../lib/admin-config';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(ADMIN_ENDPOINTS.checkSession, {
        credentials: 'include'
      });
      const data = await response.json();
      if (!data.logged_in && !pathname.includes('/login')) {
        router.push('/admin/login');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${ADMIN_API_BASE}/admin/logout.php`, {
        method: 'POST',
        credentials: 'include'
      });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Don't show admin header on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header - Different from main site */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-xl font-bold text-gray-900">
                JNC Admin
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/admin/dashboard" className="text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link href="/admin/posts/add" className="text-gray-700 hover:text-gray-900">
                  Add Post
                </Link>
                <Link href="/admin/news/add" className="text-gray-700 hover:text-gray-900">
                  Add News
                </Link>
              </nav>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - No Footer */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}