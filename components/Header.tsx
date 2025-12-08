'use client';

import { useScrollPosition } from '../lib/hooks/useScrollPosition';
import { useIsMobile } from '../lib/hooks/useIsMobile';
import NavBar from './Header/NavBar';
import Logo from './Header/Logo';

export default function Header() {
  const isScrolled = useScrollPosition(120);
  const isMobile = useIsMobile();

  const showUtilityBar = !isMobile && !isScrolled;

  return (
    <header>
      {showUtilityBar && (
        <div className="bg-gray-50 border-b border-gray-200 hidden sm:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <Logo size="large" />
                <span>Come to the point, go to the root</span>
              </div>
              <div className="flex space-x-4">
                <span>Email: info@jcgroup.com</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <NavBar
        variant="dark"
        isCompact={false}
        showLogo={false}
      />
      {isScrolled && !isMobile && (
        <NavBar
          variant="light"
          isCompact={true}
          showLogo={true}
        />
      )}
    </header>
  );
}