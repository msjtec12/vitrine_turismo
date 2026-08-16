import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  MapPin,
  Clock,
  Globe,
  Share2,
  Heart,
  Star,
  Package,
  Sparkles,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { storeService } from '@/lib/data/store-service';
import ProductCard from '@/components/ui/ProductCard';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { VerifiedBadge, FeaturedBadge } from '@/components/ui/Badges';
import InteractiveMap from '@/components/ui/InteractiveMap';
import { Product, Review } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = await storeService.getStoreBySlug(slug);

  if (!store) {
    return { title: 'Loja não encontrada | Descubra Artes' };
  }

  return {
    title: `${store.name} | Artesanato em ${store.city?.name || 'São Roque'}`,
    description: `${store.artisanName} - ${store.bio}. Conheça os produtos artesanais e encomende direto pelo WhatsApp.`,
    openGraph: {
      title: `${store.name} - Ateliê de ${store.artisanName}`,
      description: store.bio,
      images: [{ url: store.coverUrl }],
    },
  };
}

export default async function StorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await storeService.getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const products = await storeService.getStoreProducts(store.id);
  const reviews = await storeService.getStoreReviews(store.id);

  return (
    <div className="space-y-12 pb-24 md:pb-16">
      {/* ========================================== */}
      {/* 1. STORE HEADER & COVER                    */}
      {/* ========================================== */}
      <section className="relative">
        {/* Cover Photo */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-[#EDE5D8]">
          <img
            src={store.coverUrl}
            alt={store.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>

        {/* Store Profile Floating Header Card */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-20 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#EDE5D8]">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              {/* Avatar + Main Details */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-white shrink-0">
                  <img
                    src={store.logoUrl}
                    alt={store.artisanName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#1B4332]">
                      {store.name}
                    </h1>
                    {store.verified && <VerifiedBadge size="md" />}
                  </div>

                  <p className="text-sm font-semibold text-[#7F4F24]">
                    Mestre Artesão: <span className="text-[#2C2623]">{store.artisanName}</span>
                  </p>

                  <div className="flex items-center gap-4 text-xs text-[#6B625B] flex-wrap pt-1">
                    {store.city && (
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin size={13} className="text-[#C85A32]" />
                        <span>{store.neighborhood ? `${store.neighborhood}, ` : ''}{store.city.name} - {store.city.uf}</span>
                      </span>
                    )}

                    <span className="flex items-center gap-1 font-medium">
                      <Clock size={13} className="text-[#2D6A4F]" />
                      <span>{store.openingHours}</span>
                    </span>

                    <span className="flex items-center gap-1 font-bold text-[#4A3525]">
                      <Star size={13} className="text-[#D4A373] fill-[#D4A373]" />
                      <span>{store.rating.toFixed(1)}</span>
                      <span className="font-normal text-[#9E9188]">({store.reviewsCount} avaliações)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action WhatsApp Button & Socials */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                {store.instagram && (
                  <a
                    href={`https://instagram.com/${store.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#EDE5D8] text-[#4A3525] flex items-center justify-center transition-colors border border-[#EDE5D8]"
                    title="Instagram do Ateliê"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}

                <WhatsAppButton
                  phone={store.whatsapp}
                  storeName={store.name}
                  storeId={store.id}
                  cityId={store.cityId}
                  customLabel="Falar no WhatsApp"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6 pt-6 border-t border-[#EDE5D8]">
              <p className="text-sm text-[#4A3525] leading-relaxed max-w-4xl">
                {store.bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 2. PRODUTOS DO ATELIÊ                      */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#EDE5D8]">
          <div className="flex items-center gap-2">
            <Package size={22} className="text-[#C85A32]" />
            <h2 className="font-serif font-bold text-2xl text-[#1B4332]">
              Catálogo de Peças ({products.length})
            </h2>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} showStore={false} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#EDE5D8]">
            <p className="text-sm text-[#7F4F24]">Nenhum produto cadastrado no momento.</p>
          </div>
        )}
      </section>

      {/* ========================================== */}
      {/* 3. SOBRE O ARTESÃO E PROCESSO CRIATIVO     */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-10 border border-[#EDE5D8]">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#C85A32]">
              <Sparkles size={13} />
              História & Tradição
            </span>
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#1B4332]">
              Sobre o Artesão & Ateliê
            </h2>
            <p className="text-sm sm:text-base text-[#4A3525] leading-relaxed whitespace-pre-line font-light">
              {store.story}
            </p>

            {store.processDescription && (
              <div className="mt-6 pt-6 border-t border-[#EDE5D8] space-y-2">
                <h3 className="font-serif font-bold text-base text-[#1B4332]">
                  Como as peças são feitas:
                </h3>
                <p className="text-xs sm:text-sm text-[#6B625B] leading-relaxed">
                  {store.processDescription}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 4. ONDE ENCONTRAR (ENDEREÇO & MAPA)        */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
                Visitação Presencial
              </span>
              <h2 className="font-serif font-bold text-2xl text-[#1B4332] mt-1">
                📍 Onde Encontrar o Ateliê
              </h2>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-[#2D6A4F] transition-colors"
            >
              <span>Como chegar (Google Maps)</span>
              <ExternalLink size={13} />
            </a>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#EDE5D8] flex items-center gap-3 text-xs text-[#4A3525]">
            <MapPin size={16} className="text-[#C85A32] shrink-0" />
            <span className="font-medium">{store.address}</span>
            <span className="text-[#9E9188]">•</span>
            <Clock size={16} className="text-[#2D6A4F] shrink-0" />
            <span>{store.openingHours}</span>
          </div>

          <InteractiveMap
            stores={[store]}
            initialLat={store.latitude}
            initialLng={store.longitude}
            initialZoom={15}
            className="h-[360px] w-full"
          />
        </div>
      </section>

      {/* ========================================== */}
      {/* 5. AVALIAÇÕES DE TURISTAS                  */}
      {/* ========================================== */}
      {reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <h2 className="font-serif font-bold text-2xl text-[#1B4332]">
              Depoimentos de Visitantes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((rev: Review) => (
                <div
                  key={rev.id}
                  className="bg-white p-6 rounded-2xl border border-[#EDE5D8] shadow-xs flex flex-col justify-between"
                >
                  <p className="text-xs sm:text-sm text-[#4A3525] italic leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                  <div className="mt-4 pt-4 border-t border-[#F4EFE6] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#1B4332]">{rev.authorName}</div>
                      {rev.authorCity && (
                        <span className="text-[10px] text-[#9E9188]">{rev.authorCity}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 text-[#D4A373]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={13} className="fill-[#D4A373]" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fixed WhatsApp CTA on Mobile */}
      <WhatsAppButton
        phone={store.whatsapp}
        storeName={store.name}
        storeId={store.id}
        cityId={store.cityId}
        variant="floating"
        customLabel="Falar com o Artesão no WhatsApp"
      />
    </div>
  );
}
