import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Hammer,
  Scissors,
  Wine,
  Gem,
  Briefcase,
  Flame,
  Palette,
  Package,
  Layers,
  TreePine,
  Flower2,
  Brush,
  Compass,
} from 'lucide-react';
import { Category } from '@/types';

const CATEGORY_ICONS: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  ceramica: {
    icon: <Sparkles size={20} strokeWidth={1.8} />,
    color: 'text-[#E07A5F]',
    bg: 'bg-[#C85A32]/20 border-[#E07A5F]/40',
  },
  madeira: {
    icon: <Hammer size={20} strokeWidth={1.8} />,
    color: 'text-[#E9C46A]',
    bg: 'bg-[#4A3525]/30 border-[#E9C46A]/40',
  },
  tecelagem: {
    icon: <Scissors size={20} strokeWidth={1.8} />,
    color: 'text-[#D8F3DC]',
    bg: 'bg-[#1B4332]/30 border-[#D8F3DC]/40',
  },
  sabores: {
    icon: <Wine size={20} strokeWidth={1.8} />,
    color: 'text-[#F4A261]',
    bg: 'bg-[#7F4F24]/30 border-[#F4A261]/40',
  },
  joias: {
    icon: <Gem size={20} strokeWidth={1.8} />,
    color: 'text-[#E9C46A]',
    bg: 'bg-[#1B4332]/30 border-[#E9C46A]/40',
  },
  couro: {
    icon: <Briefcase size={20} strokeWidth={1.8} />,
    color: 'text-[#D4A373]',
    bg: 'bg-[#4A3525]/30 border-[#D4A373]/40',
  },
  aromas: {
    icon: <Flame size={20} strokeWidth={1.8} />,
    color: 'text-[#F8EBDC]',
    bg: 'bg-[#C85A32]/30 border-[#F8EBDC]/40',
  },
  decoracao: {
    icon: <Palette size={20} strokeWidth={1.8} />,
    color: 'text-[#D8F3DC]',
    bg: 'bg-[#2D6A4F]/30 border-[#D8F3DC]/40',
  },
};

interface CategoryCardProps {
  category: Category;
  variant?: 'grid' | 'pill';
}

export default function CategoryCard({ category, variant = 'grid' }: CategoryCardProps) {
  const categoryConfig = CATEGORY_ICONS[category.slug] || {
    icon: <Package size={20} strokeWidth={1.8} />,
    color: 'text-white',
    bg: 'bg-white/20 border-white/30',
  };

  if (variant === 'pill') {
    return (
      <Link
        href={`/explorar?categoria=${category.slug}`}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#F4EFE6] border border-[#EDE5D8] text-xs font-semibold text-[#4A3525] hover:text-[#C85A32] shadow-xs hover:shadow-sm transition-all shrink-0 group"
      >
        <span className="text-[#C85A32] group-hover:scale-110 transition-transform">
          {categoryConfig.icon}
        </span>
        <span>{category.name}</span>
        {category.productsCount !== undefined && category.productsCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-[#EDE5D8] rounded-full text-[#7F4F24] font-bold">
            {category.productsCount}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href={`/explorar?categoria=${category.slug}`}
      className="group relative flex flex-col justify-end h-48 md:h-56 rounded-2xl overflow-hidden border border-[#EDE5D8] shadow-xs hover:shadow-artisan-hover transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Background Image */}
      <img
        src={category.imageUrl}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        loading="lazy"
      />

      {/* Warm Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/95 via-[#1B4332]/50 to-transparent group-hover:from-[#C85A32]/95 transition-colors duration-500" />

      {/* Content */}
      <div className="relative p-4 text-white z-10">
        <div
          className={`w-10 h-10 rounded-xl backdrop-blur-md flex items-center justify-center mb-2.5 border shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-white ${categoryConfig.bg} ${categoryConfig.color} group-hover:text-[#C85A32] group-hover:border-white`}
        >
          {categoryConfig.icon}
        </div>
        <h3 className="font-serif font-bold text-base md:text-lg leading-tight drop-shadow-xs">
          {category.name}
        </h3>
        <p className="text-xs text-white/80 line-clamp-1 mt-0.5 font-light">
          {category.description}
        </p>
      </div>
    </Link>
  );
}
