import Link from 'next/link';

interface NavLinksProps {
  variant?: 'light' | 'dark';
  className?: string;
}

const links = [
  { href: '/', label: 'HOME' },
  { href: '/books', label: 'BOOKS' },
  { href: '/blog', label: 'BLOGS' },
];

export default function NavLinks({ variant = 'light', className = '' }: NavLinksProps) {
  const baseClasses = 'text-bold transition-colors duration-200';
  const lightClasses = 'text-gray-700 hover:text-primary-dark';
  const darkClasses = 'text-white hover:text-primary-dark';

  const linkClasses = variant === 'dark' ? darkClasses : lightClasses;

  return (
    <nav className={`flex space-x-8 py-2 ${className}`}>
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