'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  Store as StoreIcon,
  MapPin,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import { City, Category, Product, Store, FilterOptions } from '@/types';
import ProductCard from '@/components/ui/ProductCard';
import StoreCard from '@/components/ui/StoreCard';
import Filters from '@/components/ui/Filters';
import InteractiveMap from '@/components/ui/InteractiveMap';

interface ExplorarClientProps {
  cities: City[];
  categories: Category[];
  initialProducts: Product[];
  initialStores: Store[];
  initialQuery?: string;
  initialCity?: string;
  initialCategory?: string;
  initialPromo?: boolean;
  initialFeatured?: boolean;
}

export default function ExplorarClient({
  cities,
  categories,
  initialProducts,
  initialStores,
  initialQuery = '',
  initialCity = '',
  initialCategory = '',
  initialPromo = false,
  initialFeatured = false,
}: ExplorarClientProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'stores' | 'map'>('products');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>({
    query: initialQuery,
    citySlug: initialCity || undefined,
    categorySlug: initialCategory || undefined,
    onlyPromotions: initialPromo || undefined,
    onlyFeatured: initialFeatured || undefined,
    sortBy: 'recommended',
  });

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    if (filters.citySlug) {
      const city = cities.find((c) => c.slug === filters.citySlug);
      if (city) list = list.filter((p) => p.cityId === city.id);
    }

    if (filters.categorySlug) {
      const cat = categories.find((c) => c.slug === filters.categorySlug);
      if (cat) list = list.filter((p) => p.categoryId === cat.id);
    }

    if (filters.onlyPromotions) {
      list = list.filter((p) => p.isPromo);
    }

    if (filters.onlyFeatured) {
      list = list.filter((p) => p.isFeatured);
    }

    if (filters.minPrice !== undefined) {
      list = list.filter((p) => (p.promoPrice ?? p.price) >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      list = list.filter((p) => (p.promoPrice ?? p.price) <= filters.maxPrice!);
    }

    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.materials && p.materials.some((m) => m.toLowerCase().includes(q))) ||
          (p.store && p.store.name.toLowerCase().includes(q))
      );
    }

    // Sort
    if (filters.sortBy === 'price-asc') {
      list.sort((a, b) => (a.promoPrice ?? a.price) - (b.promoPrice ?? b.price));
    } else if (filters.sortBy === 'price-desc') {
      list.sort((a, b) => (b.promoPrice ?? b.price) - (a.promoPrice ?? a.price));
    } else if (filters.sortBy === 'popular') {
      list.sort((a, b) => (b.whatsappClicksCount + b.viewsCount) - (a.whatsappClicksCount + a.viewsCount));
    } else if (filters.sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [initialProducts, filters, cities, categories]);

  // Filtered Stores
  const filteredStores = useMemo(() => {
    let list = [...initialStores];

    if (filters.citySlug) {
      const city = cities.find((c) => c.slug === filters.citySlug);
      if (city) list = list.filter((s) => s.cityId === city.id);
    }

    if (filters.categorySlug) {
      const cat = categories.find((c) => c.slug === filters.categorySlug);
      if (cat) list = list.filter((s) => s.categoryId === cat.id);
    }

    if (filters.onlyVerified) {
      list = list.filter((s) => s.verified);
    }

    if (filters.onlyFeatured) {
      list = list.filter((s) => s.isFeatured);
    }

    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.artisanName.toLowerCase().includes(q) ||
          s.bio.toLowerCase().includes(q)
      );
    }

    return list;
  }, [initialStores, filters, cities, categories]);

  const handleResetFilters = () => {
    setFilters({
      query: '',
      citySlug: undefined,
      categorySlug: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      onlyPromotions: undefined,
      onlyFeatured: undefined,
      onlyVerified: undefined,
      sortBy: 'recommended',
    });
  };

  const activeCityObj = cities.find((c) => c.slug === filters.citySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FAF7F2] p-6 md:p-8 rounded-3xl border border-[#EDE5D8]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C85A32]">
              <Sparkles size={14} />
              <span>Catálogo Geral de Descoberta</span>
            </div>
            <h1 className="font-serif font-bold text-2xl md:text-3xl text-[#1B4332] mt-1">
              {activeCityObj ? `Artesanato em ${activeCityObj.name} - ${activeCityObj.uf}` : 'Explorar Todos os Produtos & Ateliês'}
            </h1>
            <p className="text-xs text-[#7F4F24] mt-1">
              Descubra criações autênticas, fale no WhatsApp e compre direto do mestre artesão
            </p>
          </div>

          {/* Search Input In Header */}
          <div className="w-full md:w-80 relative">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7F4F24]" />
            <input
              type="text"
              value={filters.query || ''}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              placeholder="Buscar cerâmica, tábua, licor..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#EDE5D8] text-xs text-[#2C2623] focus:border-[#C85A32] outline-hidden font-medium"
            />
          </div>
        </div>

        {/* View Switcher Tabs & Mobile Filter Button */}
        <div className="mt-6 pt-4 border-t border-[#EDE5D8] flex items-center justify-between gap-3 flex-wrap">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#EDE5D8]">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'text-[#7F4F24] hover:text-[#2C2623]'
              }`}
            >
              <LayoutGrid size={15} />
              <span>Produtos ({filteredProducts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('stores')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'stores'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'text-[#7F4F24] hover:text-[#2C2623]'
              }`}
            >
              <StoreIcon size={15} />
              <span>Ateliês ({filteredStores.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'text-[#7F4F24] hover:text-[#2C2623]'
              }`}
            >
              <MapPin size={15} />
              <span>Ver no Mapa</span>
            </button>
          </div>

          {/* Right Tools: Sort and Mobile filter toggle */}
          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            {activeTab === 'products' && (
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#EDE5D8] text-xs">
                <ArrowUpDown size={13} className="text-[#7F4F24]" />
                <select
                  value={filters.sortBy || 'recommended'}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                  className="bg-transparent text-[#2C2623] font-medium focus:outline-hidden cursor-pointer"
                >
                  <option value="recommended">Recomendados</option>
                  <option value="popular">Mais Populares</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="newest">Mais Recentes</option>
                </select>
              </div>
            )}

            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#EDE5D8] text-xs font-bold text-[#1B4332] shadow-xs"
            >
              <SlidersHorizontal size={14} className="text-[#C85A32]" />
              <span>Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid + Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <Filters
          categories={categories}
          cities={cities}
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          isMobileOpen={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        {/* Catalog Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === 'products' && (
            <>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-[#EDE5D8] p-8">
                  <div className="w-16 h-16 rounded-full bg-[#FAF7F2] flex items-center justify-center text-3xl mx-auto mb-4">
                    🔍
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#1B4332]">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-xs text-[#7F4F24] mt-2 max-w-sm mx-auto">
                    Tente ajustar ou limpar os filtros aplicados para visualizar outros itens artesanais.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Limpar Filtros
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'stores' && (
            <>
              {filteredStores.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredStores.map((store) => (
                    <StoreCard key={store.id} store={store} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-[#EDE5D8] p-8">
                  <div className="w-16 h-16 rounded-full bg-[#FAF7F2] flex items-center justify-center text-3xl mx-auto mb-4">
                    🧵
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#1B4332]">
                    Nenhum ateliê encontrado
                  </h3>
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-bold shadow-xs"
                  >
                    Limpar Filtros
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'map' && (
            <div className="space-y-4">
              <InteractiveMap stores={filteredStores} className="h-[600px] w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
