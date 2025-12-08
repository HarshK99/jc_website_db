import Link from 'next/link';

interface NavLinksProps {
  variant?: 'light' | 'dark';
  className?: string;
}

const links = [
  { href: '/', label: 'Home' },
  { href: '/books', label: 'Books' },
  { href: '/blog', label: 'Blogs' },
];

export default function NavLinks({ variant = 'light', className = '' }: NavLinksProps) {
  const baseClasses = 'transition-colors duration-200';
  const lightClasses = 'text-gray-700 hover:text-gray-900';
  const darkClasses = 'text-white hover:text-gray-200';

  const linkClasses = variant === 'dark' ? darkClasses : lightClasses;

  return (
    <nav className={`flex space-x-8 ${className}`}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`${baseClasses} ${linkClasses}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}