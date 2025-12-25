'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchCurrentAffairs } from '../../lib/api';
import { CurrentAffairs } from '../../lib/types';

export default function CurrentAffairsPage() {
  const [currentAffairs, setCurrentAffairs] = useState<CurrentAffairs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCurrentAffairs = async () => {
      try {
        const data = await fetchCurrentAffairs();
        setCurrentAffairs(data);
      } catch (err) {
        setError('Failed to load current affairs');
      } finally {
        setLoading(false);
      }
    };

    loadCurrentAffairs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Update Current Affairs
            </h1>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Update Current Affairs
            </h1>
            <p className="text-red-600 mt-4">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Update Current Affairs
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay informed with the latest developments and important news from around the world.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            {currentAffairs.map((item) => (
              <article key={item.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                  {/* <Link
                    href={`/current-affairs/${item.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                  </Link> */}
                </h2>
                <p className="text-gray-600 mb-3">
                  {item.content}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{item.authorName}</span>
                  <span className="mx-2">•</span>
                  <span>
                    {new Date(item.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  {item.tags && item.tags.length > 0 && (
                    <>
                      <span className="mx-2">•</span>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>

          {currentAffairs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No current affairs available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}