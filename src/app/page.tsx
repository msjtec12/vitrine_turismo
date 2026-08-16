import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MapPin,
  ArrowRight,
  Flame,
  Star,
  CheckCircle2,
  Heart,
  ShieldCheck,
  Compass,
  MessageCircle,
} from 'lucide-react';
import { storeService } from '@/lib/data/store-service';
import SearchBar from '@/components/ui/SearchBar';
import CategoryCard from '@/components/ui/CategoryCard';
import ProductCard from '@/components/ui/ProductCard';
import StoreCard from '@/components/ui/StoreCard';
import InteractiveMap from '@/components/ui/InteractiveMap';

export default async function HomePage() {
  const cities = await storeService.getCities();
  const categories = await storeService.getCategories();
  const featuredProducts = await storeService.getFeaturedProducts(8);
  const featuredStores = await storeService.getFeaturedStores(6);
  const promoProducts = await storeService.getPromoProducts(4);
  const saoRoqueCity = await storeService.getCityBySlug('sao-roque');

  return (
    <div className="space-y-16 md:space-y-24 pb-12">
      {/* ========================================== */}
      {/* 1. HERO SECTION                            */}
      {/* ========================================== */}
      <section className="relative min-h-[620px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Natural Warm Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85"
            alt="Paisagem e cultura artesanal em São Roque"
            className="w-full h-full object-cover object-center scale-105 animate-in fade-in duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-[#FAF7F2]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
          {/* Slogan Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold uppercase tracking-wider mb-6 shadow-xs animate-in slide-in-from-top duration-500">
            <Sparkles size={14} className="text-[#E9C46A]" />
            <span>Guia de Turismo & Vitrine de Artesãos</span>
          </div>

          {/* Main Slogan Title */}
          <h1 className="font-serif font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15] drop-shadow-md">
            Descubra quem faz. <br className="hidden sm:inline" />
            <span className="text-[#E9C46A]">Conheça o lugar.</span> Leve uma história.
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-white/90 font-light leading-relaxed drop-shadow-sm">
            Encontre mestres artesãos, ateliês autorais, produtos regionais e lembranças especiais direto de quem produz em São Roque e destinos de todo o Brasil.
          </p>

          {/* Search Bar Container */}
          <div className="mt-8">
            <SearchBar cities={cities} />
          </div>

          {/* Trust Highlights */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-white/90 text-xs font-medium">
            <div className="flex items-center justify-center gap-2 bg-black/25 backdrop-blur-xs py-2 px-3 rounded-xl border border-white/10">
              <CheckCircle2 size={15} className="text-[#E9C46A]" />
              <span>Artesãos Verificados</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-black/25 backdrop-blur-xs py-2 px-3 rounded-xl border border-white/10">
              <MessageCircle size={15} className="text-[#25D366]" />
              <span>Contato Direto no WhatsApp</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-black/25 backdrop-blur-xs py-2 px-3 rounded-xl border border-white/10">
              <MapPin size={15} className="text-[#E07A5F]" />
              <span>Roteiros & Mapas Locais</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-black/25 backdrop-blur-xs py-2 px-3 rounded-xl border border-white/10">
              <Heart size={15} className="text-[#C85A32]" />
              <span>Valorização do Produtor</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 2. CATEGORIAS                              */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
              Tradição e Técnicas Manuais
            </span>
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#1B4332] mt-1">
              Explore por Categoria
            </h2>
          </div>
          <Link
            href="/explorar"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7F4F24] hover:text-[#C85A32] transition-colors"
          >
            <span>Ver todas as categorias</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* 3. PRODUTOS EM DESTAQUE                    */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C85A32]">
              <Sparkles size={14} className="text-[#C85A32]" />
              <span>Curadoria Especial</span>
            </span>
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#1B4332] mt-1 flex items-center gap-2">
              <Sparkles size={24} className="text-[#E9C46A]" />
              <span>Produtos em Destaque</span>
            </h2>
            <p className="text-xs text-[#7F4F24] mt-1">
              Peças exclusivas feitas à mão com materiais nobres da região
            </p>
          </div>

          <Link
            href="/explorar?destaques=true"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B4332] hover:text-[#C85A32] transition-colors"
          >
            <span>Explorar todos os produtos</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* 4. SEÇÃO "DESCUBRA SÃO ROQUE" (INTEGRAÇÃO) */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#1B4332] text-white p-8 md:p-14 shadow-xl">
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 opacity-25 md:opacity-40 overflow-hidden pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
              alt="São Roque - SP"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C85A32] text-white text-xs font-bold uppercase tracking-wider">
              <MapPin size={13} className="text-[#E9C46A]" />
              <span>Descubra São Roque</span>
            </div>

            <h2 className="font-serif font-bold text-3xl md:text-4xl text-white leading-tight">
              Conheça os ateliês e sabores que fazem São Roque ser inesquecível
            </h2>

            <p className="text-white/85 text-sm md:text-base leading-relaxed font-light">
              Do Roteiro do Vinho ao Centro Histórico: descubra taças e petisqueiras em grés vulcânico, tábuas em carvalho de antigas adegas, o clássico licor de alcachofra e muito mais.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                href="/cidade/sao-roque"
                className="px-7 py-3.5 rounded-2xl bg-[#E9C46A] hover:bg-[#D4A373] text-[#1B4332] font-bold text-sm transition-all shadow-md flex items-center gap-2"
              >
                <span>Explorar São Roque</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/mapa"
                className="px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm transition-all border border-white/20"
              >
                Ver no Mapa da Cidade
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 5. ARTESÃOS EM DESTAQUE (QUEM FAZ)         */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
              Histórias, Vidas e Mestres
            </span>
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#1B4332] mt-1 flex items-center gap-2">
              <Star size={24} className="text-[#D4A373] fill-[#D4A373]/30" />
              <span>Conheça Quem Faz</span>
            </h2>
            <p className="text-xs text-[#7F4F24] mt-1">
              Visite ateliês autênticos e converse diretamente com os artesãos
            </p>
          </div>

          <Link
            href="/explorar?tipo=lojas"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B4332] hover:text-[#C85A32] transition-colors"
          >
            <span>Ver todos os artesãos</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredStores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* 6. OFERTAS DA REGIÃO (PROMOÇÕES)          */}
      {/* ========================================== */}
      {promoProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAF7F2] p-6 md:p-10 rounded-3xl border border-[#EDE5D8]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#C85A32]">
                  <Flame size={14} className="text-[#C85A32]" />
                  Descontos Especiais de Temporada
                </span>
                <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#1B4332] mt-1 flex items-center gap-2">
                  <Flame size={24} className="text-[#C85A32]" />
                  <span>Ofertas da Região</span>
                </h2>
                <p className="text-xs text-[#7F4F24] mt-1">
                  Aproveite valores promocionais exclusivos comprando direto pelo WhatsApp
                </p>
              </div>

              <Link
                href="/promocoes"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C85A32] hover:text-[#A4421F] transition-colors"
              >
                <span>Ver todas as ofertas</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {promoProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================== */}
      {/* 7. MAPA INTERATIVO TEASER                  */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7F4F24]">
              Geolocalização & Roteiro
            </span>
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#1B4332] mt-1 flex items-center gap-2">
              <MapPin size={24} className="text-[#C85A32]" />
              <span>Encontre Ateliês Perto de Você</span>
            </h2>
            <p className="text-xs text-[#7F4F24] mt-1">
              Trace sua rota pelo Roteiro do Vinho e Centro de São Roque para visitar os artesãos pessoalmente
            </p>
          </div>

          <Link
            href="/mapa"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B4332] hover:text-[#C85A32] transition-colors"
          >
            <span>Abrir mapa completo</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <InteractiveMap stores={featuredStores} className="h-[440px] w-full" />
      </section>
    </div>
  );
}
