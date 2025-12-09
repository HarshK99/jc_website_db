'use client';

import { useState } from 'react';
import Logo from './Logo';
import NavLinks from './NavLinks';
import MobileMenu from './MobileMenu';
import Search from '../Search';

interface NavBarProps {
  variant?: 'light' | 'dark';
  isSticky?: boolean;
  showLogo?: boolean;
}

export default function NavBar({ variant = 'light', isSticky = false, showLogo = true }: NavBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const bgClass = variant === 'dark' ? 'bg-black' : 'bg-white';
  const backdropClass = isSticky ? 'backdrop-blur-md' : '';
  const shadowClass = isSticky ? 'shadow-lg' : 'shadow-sm';
  const positionClass = isSticky ? 'sticky top-0 z-50' : '';

  return (
    <div className={`relative ${bgClass} ${backdropClass} ${shadowClass} ${positionClass} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-4">
          {showLogo && <Logo size='large' />}
          <div className="flex-1 flex justify-center">
            <NavLinks variant={variant} className="hidden md:flex" />
          </div>
          <div className="flex items-center space-x-2">
            {isSticky && (
              <button
                className={`hidden md:block p-2 ${variant === 'dark' ? 'text-white hover:text-gray-200' : 'text-gray-700 hover:text-gray-900'}`}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Toggle search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                className={`p-2 ${variant === 'dark' ? 'text-white hover:text-gray-200' : 'text-gray-700 hover:text-gray-900'}`}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Toggle search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button
                className={`p-2 ${variant === 'dark' ? 'text-white hover:text-gray-200' : 'text-gray-700 hover:text-gray-900'}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {isSearchOpen && (
          <>
            <div className="md:hidden pb-4 px-4 flex justify-end">
              <Search />
            </div>
            {isSticky && (
              <div className="hidden md:block pb-4 px-4 flex justify-end">
                <Search />
              </div>
            )}
          </>
        )}
      </div>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </div>
  );
}