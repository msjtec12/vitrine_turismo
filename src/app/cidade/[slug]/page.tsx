import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MapPin, Sparkles, Store as StoreIcon, Package, ArrowRight, Flame } from 'lucide-react';
import { storeService } from '@/lib/data/store-service';
import ProductCard from '@/components/ui/ProductCard';
import StoreCard from '@/components/ui/StoreCard';
import CategoryCard from '@/components/ui/CategoryCard';
import InteractiveMap from '@/components/ui/InteractiveMap';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = await storeService.getCityBySlug(slug);

  if (!city) {
    return {
      title: 'Cidade não encontrada | Descubra Artes',
    };
  }

  return {
    title: `Artesanato em ${city.name} - ${city.uf} | Descubra Artes`,
    description: `Encontre artesãos, produtos regionais, lembranças e ateliês de artesanato em ${city.name} - ${city.uf}. ${city.description}`,
    openGraph: {
      title: `Artesanato e Produtores Locais em ${city.name} - ${city.uf}`,
      description: city.description,
      images: [{ url: city.coverImage }],
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = await storeService.getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  const stores = await storeService.getStores({ citySlug: slug });
  const products = await storeService.getProducts({ citySlug: slug });
  const categories = await storeService.getCategories();
  const promoProducts = products.filter((p) => p.isPromo);

  return (
    <div className="space-y-16 pb-16">
      {/* ========================================== */}
      {/* 1. CITY HERO COVER                         */}
      {/* ========================================== */}
      <section className="relative min-h-[380px] md:min-h-[460px] flex items-end justify-start overflow-hidden">
        <img
          src={city.bannerImage || city.coverImage}
          alt={city.name}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C85A32] text-white text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin size={13} />
            <span>Destino Turístico Oficial</span>
          </div>

          <h1 className="font-serif font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            {city.name} <span className="text-[#E9C46A] text-2xl sm:text-4xl font-sans font-light">({city.uf})</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/90 font-light leading-relaxed">
            {city.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <div className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 font-semibold flex items-center gap-1.5">
              <StoreIcon size={14} className="text-[#E9C46A]" />
              <span>{stores.length} Ateliês e Mestres</span>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 font-semibold flex items-center gap-1.5">
              <Package size={14} className="text-[#D8F3DC]" />
              <span>{products.length} Produtos Regionais</span>
            </div>
            <Link
              href={`/explorar?cidade=${city.slug}`}
              className="bg-[#E9C46A] text-[#1B4332] font-bold px-4 py-1.5 rounded-xl hover:bg-[#D4A373] transition-colors"
            >
              Explorar Catálogo de {city.name} →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 2. ARTESÃOS & ATELIÊS DA CIDADE            */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
              Quem Produz em {city.name}
            </span>
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#1B4332] mt-1">
              Ateliês & Mestres Locais
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* 3. PRODUTOS & LEMBRANÇAS DA CIDADE         */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
              Vitrine de Peças
            </span>
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#1B4332] mt-1">
              Produtos & Lembranças de {city.name}
            </h2>
          </div>

          <Link
            href={`/explorar?cidade=${city.slug}`}
            className="text-xs font-bold text-[#1B4332] hover:text-[#C85A32] flex items-center gap-1"
          >
            <span>Ver todos</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* 4. OFERTAS NA CIDADE                       */}
      {/* ========================================== */}
      {promoProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAF7F2] p-6 md:p-10 rounded-3xl border border-[#EDE5D8]">
            <div className="flex items-center gap-2 mb-6">
              <Flame size={22} className="text-[#C85A32]" />
              <h2 className="font-serif font-bold text-2xl text-[#1B4332]">
                Ofertas & Promoções em {city.name}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {promoProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================== */}
      {/* 5. MAPA DA CIDADE                          */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
            Roteiro Turístico
          </span>
          <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#1B4332] mt-1 flex items-center gap-2">
            <MapPin size={24} className="text-[#C85A32]" />
            <span>Mapa de Ateliês em {city.name}</span>
          </h2>
        </div>

        <InteractiveMap
          stores={stores}
          initialLat={city.latitude}
          initialLng={city.longitude}
          className="h-[480px] w-full"
        />
      </section>
    </div>
  );
}
