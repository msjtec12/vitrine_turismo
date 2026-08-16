import React from 'react';
import { ShieldCheck, Sparkles, Percent, Award, Flame } from 'lucide-react';

export function VerifiedBadge({
  className = '',
  size = 'md',
  showText = true,
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}) {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 13,
    md: 15,
    lg: 18,
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full bg-linear-to-r from-[#D8F3DC] to-[#E8F8EE] text-[#1B4332] border border-[#2D6A4F]/25 shadow-xs transition-transform hover:scale-102 ${sizeClasses[size]} ${className}`}
      title="Selo Oficial de Artesão Verificado pela Curadoria"
    >
      <ShieldCheck
        size={iconSizes[size]}
        className="text-[#2D6A4F] shrink-0 fill-[#2D6A4F]/15"
        strokeWidth={2}
      />
      {showText && <span>Artesão Verificado</span>}
    </span>
  );
}

export function FeaturedBadge({
  className = '',
  text = 'Destaque',
}: {
  className?: string;
  text?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-linear-to-r from-[#E9C46A] via-[#F4A261] to-[#E9C46A] text-[#2C2623] border border-[#D4A373]/40 shadow-xs tracking-wide uppercase text-[10px] ${className}`}
    >
      <Sparkles size={13} className="text-[#A4421F] fill-[#A4421F]/30 shrink-0" strokeWidth={2} />
      <span>{text}</span>
    </span>
  );
}

export function PromotionBadge({
  discountPercent,
  className = '',
}: {
  discountPercent?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full bg-linear-to-r from-[#C85A32] to-[#E07A5F] text-white shadow-xs tracking-wide ${className}`}
    >
      <Flame size={13} className="text-white fill-white/25 shrink-0" strokeWidth={2} />
      <span>{discountPercent ? `-${discountPercent}%` : 'Oferta'}</span>
    </span>
  );
}

export function ArtisanAwardBadge({
  title = 'Mestre Tradicional',
  className = '',
}: {
  title?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#FAF7F2] text-[#7F4F24] border border-[#EDE5D8] ${className}`}
    >
      <Award size={13} className="text-[#D4A373] shrink-0" strokeWidth={2} />
      <span>{title}</span>
    </span>
  );
}
