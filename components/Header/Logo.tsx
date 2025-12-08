import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'small' | 'large';
}

export default function Logo({ variant = 'light', size = 'large' }: LogoProps) {
  const textColor = variant === 'dark' ? 'text-white' : 'text-gray-900';
  const sizeClass = size === 'small' ? 'text-xl' : 'text-2xl';

  return (
    <Link href="/" className={`${sizeClass} font-bold ${textColor} hover:opacity-80 transition-opacity`}>
      J & C Group
    </Link>
  );
}