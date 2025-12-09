import Link from 'next/link';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const links = [
  { href: '/', label: 'Home' },
  { href: '/books', label: 'Books' },
  { href: '/blog', label: 'Blogs' },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t z-50">
      <div className="px-4 py-6 space-y-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block text-gray-700 hover:text-gray-900 py-2"
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}