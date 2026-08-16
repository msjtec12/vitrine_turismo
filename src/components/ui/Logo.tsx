import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'compact' | 'icon-only';
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  className?: string;
}

export default function Logo({
  variant = 'full',
  theme = 'dark',
  size = 'md',
  href = '/',
  className = '',
}: LogoProps) {
  const isLight = theme === 'light';

  const heightClasses = {
    sm: 'h-11',
    md: 'h-14 sm:h-16',
    lg: 'h-18 sm:h-20',
    xl: 'h-24 sm:h-28',
  };

  const iconSizes = {
    sm: 'w-11 h-11',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  if (variant === 'icon-only') {
    const iconContent = (
      <div
        className={`relative ${iconSizes[size]} p-2 rounded-2xl bg-white border border-[#EAE3D6] shadow-xs shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-md ${
          isLight ? 'bg-white ring-2 ring-white/40' : 'bg-white'
        } ${className}`}
      >
        <img
          src="/images/logo.png"
          alt="Descubra Artes Ícone"
          className="w-full h-full object-contain"
        />
      </div>
    );

    if (href) {
      return (
        <Link href={href} className="inline-flex items-center group">
          {iconContent}
        </Link>
      );
    }
    return iconContent;
  }

  const fullContent = (
    <div
      className={`relative ${heightClasses[size]} p-1.5 px-3 rounded-2xl bg-white border border-[#EAE3D6] shadow-xs shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-103 group-hover:shadow-md ${
        isLight ? 'bg-white ring-2 ring-white/40' : 'bg-white'
      } ${className}`}
    >
      <img
        src="/images/logo.png"
        alt="Descubra Artes • Turismo, Cultura e Artesanato"
        className="h-full w-auto object-contain max-h-full"
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center group">
        {fullContent}
      </Link>
    );
  }

  return fullContent;
}
