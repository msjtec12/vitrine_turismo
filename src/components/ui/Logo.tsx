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

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  const LogoIcon = (
    <div
      className={`relative ${iconSizes[size]} rounded-2xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 duration-300 ${
        isLight ? 'bg-white/10 ring-1 ring-white/20' : 'bg-[#1B4332]'
      }`}
    >
      <img
        src="/images/logo.png"
        alt="Descubra Artes Ícone"
        className="w-full h-full object-cover rounded-2xl"
      />
    </div>
  );

  const LogoText = (
    <div className="flex flex-col">
      <span
        className={`font-serif font-extrabold tracking-tight leading-none transition-colors ${
          titleSizes[size]
        } ${isLight ? 'text-white' : 'text-[#1B4332] group-hover:text-[#C85A32]'}`}
      >
        DESCUBRA ARTES
      </span>
      {variant === 'full' && (
        <span
          className={`font-sans font-semibold tracking-wider uppercase mt-1 ${
            subtitleSizes[size]
          } ${isLight ? 'text-[#E9C46A]' : 'text-[#7F4F24]'}`}
        >
          Turismo • Cultura • Artesanato
        </span>
      )}
    </div>
  );

  if (variant === 'icon-only') {
    if (href) {
      return (
        <Link href={href} className={`inline-flex items-center group ${className}`}>
          {LogoIcon}
        </Link>
      );
    }
    return LogoIcon;
  }

  const content = (
    <div className={`inline-flex items-center gap-3 group ${className}`}>
      {LogoIcon}
      {LogoText}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center group">
        {content}
      </Link>
    );
  }

  return content;
}
