'use client';

import { useState } from 'react';
import Logo from './Logo';
import NavLinks from './NavLinks';
import MobileMenu from './MobileMenu';

interface NavBarProps {
  variant?: 'light' | 'dark';
  isCompact?: boolean;
  showLogo?: boolean;
}

export default function NavBar({ variant = 'light', isCompact = false, showLogo = true }: NavBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const bgClass = variant === 'dark' ? 'bg-slate-800' : 'bg-white';
  const backdropClass = isCompact ? 'backdrop-blur-md' : '';
  const shadowClass = isCompact ? 'shadow-lg' : 'shadow-sm';
  const positionClass = isCompact ? 'sticky top-0 z-50' : '';

  return (
    <div className={`relative ${bgClass} ${backdropClass} ${shadowClass} ${positionClass} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-4">
          {showLogo && <Logo variant={variant} size={isCompact ? 'small' : 'large'} />}
          <div className="flex-1 flex justify-center">
            <NavLinks variant={variant} className="hidden md:flex" />
          </div>
          <button
            className={`md:hidden p-2 ${variant === 'dark' ? 'text-white hover:text-gray-200' : 'text-gray-700 hover:text-gray-900'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </div>
  );
}