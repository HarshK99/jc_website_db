import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'small' | 'large';
}

export default function Logo({ variant = 'light', size = 'large' }: LogoProps) {
  const sizeClass = size === 'small' ? 'h-8' : 'h-12';
  const filterClass = variant === 'dark' ? 'brightness-0 invert' : '';

  return (
    <Link href="/" className="block">
      <img
        src="/logo.jpeg"
        alt="J & C Group"
        className={`${sizeClass} ${filterClass} transition-opacity hover:opacity-80`}
      />
    </Link>
  );
}