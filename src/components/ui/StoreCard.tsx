'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Package, Star, ArrowRight, Heart } from 'lucide-react';
import { Store } from '@/types';
import { VerifiedBadge, FeaturedBadge } from './Badges';
import WhatsAppButton from './WhatsAppButton';
import { useFavorites } from '@/lib/favorites-context';

interface StoreCardProps {
  store: Store;
}

export default function StoreCard({ store }: StoreCardProps) {
  const { isStoreFavorite, toggleStoreFavorite } = useFavorites();
  const isFav = isStoreFavorite(store.id);

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#EDE5D8] hover:border-[#2D6A4F]/40 shadow-xs hover:shadow-artisan-hover transition-all duration-300">
      {/* Store Cover Image */}
      <div className="relative h-44 w-full overflow-hidden bg-[#EDE5D8]">
        <img
          src={store.coverUrl}
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleStoreFavorite(store);
          }}
          aria-label={isFav ? 'Remover loja dos favoritos' : 'Favoritar loja'}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isFav
              ? 'bg-[#C85A32] text-white shadow-md'
              : 'bg-white/80 text-[#4A3525] hover:bg-white hover:text-[#C85A32]'
          }`}
        >
          <Heart size={16} className={isFav ? 'fill-white' : ''} />
        </button>

        {/* Featured Tag */}
        {store.isFeatured && (
          <div className="absolute top-3 left-3 z-10">
            <FeaturedBadge text="Ateliê em Destaque" />
          </div>
        )}

        {/* City on Cover */}
        {store.city && (
          <div className="absolute bottom-3 left-24 right-3 text-white pointer-events-none">
            <div className="flex items-center gap-1 text-xs font-medium drop-shadow-sm">
              <MapPin size={12} className="text-[#E9C46A] shrink-0" />
              <span className="truncate">
                {store.neighborhood ? `${store.neighborhood}, ` : ''}{store.city.name} - {store.city.uf}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Avatar positioned overlapping cover */}
      <div className="relative px-5 pt-0 pb-5 flex-1 flex flex-col justify-between">
        <div className="relative -mt-10 mb-3 flex items-end justify-between">
          <div className="relative w-18 h-18 rounded-2xl overflow-hidden border-3 border-white bg-white shadow-md">
            <img
              src={store.logoUrl}
              alt={store.artisanName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#EDE5D8] text-xs font-semibold text-[#4A3525]">
            <Star size={13} className="text-[#D4A373] fill-[#D4A373]" />
            <span>{store.rating.toFixed(1)}</span>
            <span className="text-[#9E9188] font-normal">({store.reviewsCount})</span>
          </div>
        </div>

        {/* Store Info */}
        <div className="space-y-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Link href={`/loja/${store.slug}`}>
                <h3 className="font-serif font-bold text-lg text-[#1B4332] group-hover:text-[#C85A32] transition-colors leading-tight">
                  {store.name}
                </h3>
              </Link>
            </div>
            <p className="text-xs font-medium text-[#7F4F24]">
              {store.artisanName}
            </p>
          </div>

          {store.verified && (
            <div>
              <VerifiedBadge size="sm" />
            </div>
          )}

          <p className="text-xs text-[#6B625B] line-clamp-2 leading-relaxed">
            {store.bio}
          </p>
        </div>

        {/* Footer Meta & Action */}
        <div className="mt-4 pt-4 border-t border-[#F4EFE6] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#6B625B]">
            <Package size={14} className="text-[#7F4F24]" />
            <span>{store.productsCount || 0} produtos</span>
          </div>

          <div className="flex items-center gap-2">
            <WhatsAppButton
              phone={store.whatsapp}
              storeName={store.name}
              storeId={store.id}
              cityId={store.cityId}
              variant="compact"
            />
            <Link
              href={`/loja/${store.slug}`}
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1B4332] hover:bg-[#2D6A4F] text-white transition-colors shadow-xs"
            >
              <span>Conhecer</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
