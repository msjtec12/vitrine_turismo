'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { useFavorites } from '@/lib/favorites-context';
import { PromotionBadge, FeaturedBadge } from './Badges';
import WhatsAppButton from './WhatsAppButton';

interface ProductCardProps {
  product: Product;
  showStore?: boolean;
  priorityImage?: boolean;
}

export default function ProductCard({
  product,
  showStore = true,
  priorityImage = false,
}: ProductCardProps) {
  const { isProductFavorite, toggleProductFavorite } = useFavorites();
  const isFav = isProductFavorite(product.id);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#EDE5D8] hover:border-[#C85A32]/40 shadow-xs hover:shadow-artisan-hover transition-all duration-300">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F4EFE6]">
        <Link href={`/produto/${product.slug}`} className="block w-full h-full">
          <img
            src={product.coverImage || product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading={priorityImage ? 'eager' : 'lazy'}
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isPromo && (
            <PromotionBadge discountPercent={product.promoDiscountPercent} />
          )}
          {product.isFeatured && !product.isPromo && (
            <FeaturedBadge text="Destaque" />
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleProductFavorite(product);
          }}
          aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isFav
              ? 'bg-[#C85A32] text-white shadow-md'
              : 'bg-white/80 text-[#4A3525] hover:bg-white hover:text-[#C85A32]'
          }`}
        >
          <Heart size={17} className={isFav ? 'fill-white' : ''} />
        </button>

        {/* City Tag on Image bottom */}
        {product.city && (
          <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white">
              <MapPin size={11} className="text-[#E9C46A]" />
              <span>{product.city.name} - {product.city.uf}</span>
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          {/* Store Name */}
          {showStore && product.store && (
            <div className="flex items-center gap-1 text-xs text-[#7F4F24] font-medium mb-1.5">
              <Link
                href={`/loja/${product.store.slug}`}
                className="hover:text-[#C85A32] transition-colors truncate max-w-[200px]"
              >
                {product.store.name}
              </Link>
              {product.store.verified && (
                <span title="Artesão Verificado" className="inline-flex">
                  <CheckCircle2 size={13} className="text-[#2D6A4F] shrink-0" />
                </span>
              )}
            </div>
          )}

          {/* Product Title */}
          <Link href={`/produto/${product.slug}`} className="block group-hover:text-[#C85A32] transition-colors">
            <h3 className="font-serif font-semibold text-base text-[#2C2623] line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action Area */}
        <div className="mt-4 pt-3 border-t border-[#F4EFE6] flex items-center justify-between gap-2">
          <div>
            {product.isPromo && product.promoPrice ? (
              <div className="flex flex-col">
                <span className="text-xs text-[#9E9188] line-through">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-lg font-bold text-[#C85A32]">
                  {formatCurrency(product.promoPrice)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-[#1B4332]">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {product.store && (
              <WhatsAppButton
                phone={product.store.whatsapp}
                storeName={product.store.name}
                storeId={product.store.id}
                productName={product.name}
                productId={product.id}
                cityId={product.cityId}
                variant="compact"
              />
            )}
            <Link
              href={`/produto/${product.slug}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#FAF7F2] text-[#4A3525] hover:bg-[#EDE5D8] transition-colors"
            >
              <span>Ver</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
