'use client';

import { useScrollPosition } from '../lib/hooks/useScrollPosition';
import { useIsMobile } from '../lib/hooks/useIsMobile';
import NavBar from './Header/NavBar';
import Logo from './Header/Logo';
import Search from './Search';

export default function Header() {
  const isScrolled = useScrollPosition(120);
  const isMobile = useIsMobile();

  const showUtilityBar = !isMobile && !isScrolled;

  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
    <header>
      {showUtilityBar && (
        <div className="bg-gray-50 border-b border-gray-200 hidden sm:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="grid grid-cols-3 items-center text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <Logo size="large" />
              </div>
              <div className="text-center font-medium">
                {currentDate}
              </div>
              <div className="flex justify-end">
                <Search />
              </div>
            </div>
          </div>
        </div>
      )}
      <NavBar
          variant={!isMobile ? "dark" : "light"}
          isSticky={false}
          showLogo={!isMobile ? false : true}
        />
      
    </header>
    {isScrolled && (
    <header className='sticky top-0 z-50 compact-header'>
     
        <NavBar
          variant="light"
          isSticky={true}
          showLogo={true}
        />
      
    </header>)}
    </>
    
  );
}